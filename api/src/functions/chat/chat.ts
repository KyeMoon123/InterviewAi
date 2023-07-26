import type {APIGatewayEvent, Context} from 'aws-lambda'

import {logger} from 'src/lib/logger'
import {PineconeClient} from "@pinecone-database/pinecone";
import * as Ably from 'ably';
import {CallbackManager} from "langchain/callbacks";
import {LLMChain} from "langchain/chains";
import {ChatOpenAI} from "langchain/chat_models";
import {OpenAIEmbeddings} from 'langchain/embeddings';
import {OpenAI} from "langchain/llms";
import {PromptTemplate} from "langchain/prompts";

import {uuid} from 'uuidv4';
import {summarizeLongDocument} from "src/lib/summarizer";
import {templates} from "src/lib/templates";
import {getMatchesFromEmbeddings, Metadata} from "src/lib/matches";
import {ConversationLog} from "src/lib/conversationLog";
import {useRequireAuth} from "@redwoodjs/graphql-server";
import {getCurrentUser} from "src/lib/auth";
import {authDecoder} from "@redwoodjs/auth-supabase-api";
import {PineConeService} from "src/lib/PineConeService";
import {getUserCredits, updateUser} from "src/services/users/users";


const llm = new OpenAI({});
let pinecone: PineconeClient | null = null

const maxPublishRate = 15; // Maximum publish rate per second
const tokenBatchSize = 10; // Number of tokens to send in each batch
const tokenBatchDelay = 1000 / maxPublishRate; // Delay between batches to maintain rate limit

let tokenBatch = []; // Accumulated tokens in the current batch
let publishingTokens = false; // Flag to track if tokens are being published


const ably = new Ably.Realtime({key: process.env.ABLY_API_KEY});

export const chatHandler = async (event: APIGatewayEvent, _context: Context) => {
  const parsedBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  const {prompt, modelName, modelId, conversationId} = JSON.parse(parsedBody);
  const userId = String(context.currentUser.sub)
  logger.info(`querying model ${modelName} with id ${modelId} for user ${String(context.currentUser.sub)} and conversation ${conversationId} with prompt ${prompt} `)
  const userCredits = await getUserCredits(userId)

  if (userCredits < 1) {
    return {
      statusCode: 402,
      body: JSON.stringify({
        error: 'Insufficient credits, please upgrade your plan or purchase additional credits'
      })
    }
  }

  if (!pinecone) {
    pinecone = await PineConeService.initPineconeClient()
  }

  try {
    const channel = ably.channels.get(userId);
    const interactionId = uuid()

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(conversationId)
    const conversationHistory = await conversationLog.getConversation({limit: 10, speaker: "user"})
    await conversationLog.addEntry({entry: prompt, speaker: "user"})

    // Build an LLM chain that will improve the user prompt
    const inquiryChain = new LLMChain({
      llm, prompt: new PromptTemplate({
        template: templates.inquiryTemplate,
        inputVariables: ["userPrompt", "conversationHistory"],
      })
    });
    const inquiryChainResult = await inquiryChain.call({userPrompt: prompt, conversationHistory})
    const inquiry = inquiryChainResult.text

    // Embed the user's intent and query the Pinecone index
    const embedder = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002"
    });

    const embeddings = await embedder.embedQuery(inquiry);

    channel.publish({
      data: {
        event: "status",
        message: "Finding matches...",
      }
    })

    // take the embeddings and find the top 2 matches in the pinecone index
    const matches = await getMatchesFromEmbeddings(embeddings, pinecone!, 3);

    //   TODO: i am not using urls, change to review external references
    //   const urls = matches && Array.from(new Set(matches.map(match => {
    //     const metadata = match.metadata as Metadata
    //     const {url} = metadata
    //     return url
    //   })))

    const docs = matches && Array.from(
      matches.reduce((map, match) => {
        const metadata = match.metadata as Metadata;
        const {text, url} = metadata;
        if (!map.has(url)) {
          map.set(url, text);
        }
        return map;
      }, new Map())
    ).map(([_, text]) => text);

    const promptTemplate = new PromptTemplate({
      template: templates.qaTemplate,
      inputVariables: ["summaries", "question", "conversationHistory"],
    });

    const chat = new ChatOpenAI({
      streaming: true,
      verbose: true,
      modelName: "gpt-3.5-turbo",
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          tokenBatch.push(token); // Accumulate tokens in a batch
          if (!publishingTokens) {
            await publishTokens(channel, interactionId);
          }
        },
        async handleLLMEnd(result) {
          tokenBatch.push("END"); // Add "END" token to the batch
          if (!publishingTokens) {
            await publishTokens(channel, interactionId);
          }
          await conversationLog.addEntry({entry: result.generations[0][0].text, speaker: "ai"})
        },
      }),
    });

    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: chat,
    });

    const allDocs = docs.join("\n")
    if (allDocs.length > 4000) {
      channel.publish({
        data: {
          event: "status",
          message: `Just a second, forming final answer...`,
        }
      })
    }

    const summary = allDocs.length > 4000 ? await summarizeLongDocument({document: allDocs, inquiry}) : allDocs

    await chain.call({
      summaries: summary,
      question: prompt,
      conversationHistory,
    }).then(async () => {
        await updateUser({
          id: userId,
          input: {
            credits: (userCredits - 1)
          }
        })

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: 'chat function',
          }),
        }
      }
    )
  } catch (error) {
    console.error(error)
  }
}

export const handler = useRequireAuth({
  handlerFn: chatHandler,
  getCurrentUser,
  authDecoder,
})


// UTIL FUNCTIONS - Should move out somewhere neater

const publishTokens = async (channel, interactionId) => {
  publishingTokens = true;
  while (tokenBatch.length > 0) {
    const batch = tokenBatch.slice(0, tokenBatchSize); // Extract a batch of tokens
    tokenBatch = tokenBatch.slice(tokenBatchSize); // Remove the published tokens from the batch
    await publishBatch(channel, batch, interactionId); // Publish the batch of tokens
    await delay(tokenBatchDelay); // Delay between batches
  }
  publishingTokens = false;
};

const publishBatch = async (channel, batch, interactionId) => {
  for (const token of batch) {
    let data
    if (token === "END") {
      data = {
        event: "responseEnd",
        token: token,
        interactionId,
      };
      channel.publish({data}); // Publish "END" token
      continue;
    } else {
      data = {
        event: "response",
        token: token,
        interactionId,
      }
    }

    channel.publish({data}); // Publish each token separately
    await delay(tokenBatchDelay); // Delay between publishing tokens to maintain rate limit
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


