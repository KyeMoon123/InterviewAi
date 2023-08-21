import {PineconeClient, Vector} from "@pinecone-database/pinecone";
import {Document} from "langchain/document";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {uuid} from "uuidv4";
import Bottleneck from "bottleneck";

export const EmbeddingsService = (function () {
  const embedder = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002"
  })
  const limiter = new Bottleneck({
    minTime: 50
  });


  let counter = 0
  //Embed the documents
  const getEmbedding = async (doc: Document) => {
    const embedding = await embedder.embedQuery(doc.pageContent)

    counter = counter + 1
    return {
      id: uuid(),
      values: embedding,
      metadata: {
        chunk: doc.pageContent,
        text: doc.metadata.text as string,
      }
    } as Vector
  }

  const rateLimitedGetEmbedding = limiter.wrap(getEmbedding);

  return{

  }
})();


export const PineConeService = (function () {
  let pinecone: PineconeClient | null = null

  type Response = {
    message: string
  }

  const initPineconeClient = async ():Promise<PineconeClient> => {
    pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    return pinecone
  }

  const getIndexes = async ():Promise<string[]> => {
    if(!pinecone){
      await initPineconeClient()
    }
    return await pinecone.listIndexes()
  }

  const getIndex = async (indexName: string) => {
    if(!pinecone){
      await initPineconeClient()
    }
    return pinecone.Index(indexName);
  }


  return{
    getIndexes,
    getIndex,
    initPineconeClient
  }
})();
