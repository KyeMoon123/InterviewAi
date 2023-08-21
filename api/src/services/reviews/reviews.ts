import type {CreateReviewInput} from 'types/graphql'

import {db} from 'src/lib/db'
import {PromisePool} from "@supercharge/promise-pool";
import {logger} from "src/lib/logger";
import {TokenTextSplitter} from "langchain/text_splitter";
import {Document} from "langchain/document";
import {Vector} from "@pinecone-database/pinecone";
import {PineConeService} from "src/lib/PineConeService";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {uuid} from "uuidv4";
import Bottleneck from "bottleneck";

export const batchSaveReviews = async (reviews: CreateReviewInput[], source: string) => {
  const {results, errors} = await PromisePool
    .for(reviews)
    .withConcurrency(15)
    .process(async review => {
      try {
        logger.info(`Saving review: ${review.externalReference}`)
        await saveReview(review, source)
      } catch (e) {
        logger.error(`Error saving review: ${review.externalReference}: skipping...`)
      }
    })
}

export const removeExistingReviews = async (listOfUserReviews:  CreateReviewInput[]): Promise<CreateReviewInput[]> => {
  const reviewReferences = listOfUserReviews.map(r => r.externalReference)
  const existingReviews = await db.review.findMany({
    where: {
      externalReference: {
        in: reviewReferences
      }
    }
  })
  return listOfUserReviews.filter((review: any) => {
    return !existingReviews.some((existingReview: any) => {
      return existingReview.externalReference === review.externalReference
    })
  })
}

const saveReview = async (review: CreateReviewInput, source: string) => {
  return await db.review.create({
    data: {
      externalReference: review.externalReference,
      body: review.body,
      source: source,
      rating: review.rating,
      authoredAt: review.authoredAt
    }
  })
}
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};


export const sliceIntoChunks = (arr: Vector[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
};

export const indexReviews = async (reviews:  CreateReviewInput[], source:string, modelName: string) => {
  const indexName = process.env.PINECONE_INDEX_NAME
  const limiter = new Bottleneck({
    minTime: 50
  });

  const documents = await Promise.all(reviews.map(async row => {

    const splitter = new TokenTextSplitter({
      encodingName: "gpt2",
      chunkSize: 300,
      chunkOverlap: 20,
    });

    const pageContent =  row.body

    return splitter.splitDocuments([
      new Document({pageContent, metadata: {source: source, reference: row.externalReference, text: truncateStringByBytes(pageContent, 36000)}}),
    ])
  }))

  const index = await PineConeService.getIndex(indexName)

  const embedder = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002"
  })
  let counter = 0

  //Embed the documents
  const getEmbedding = async (doc: Document) => {
    const embedding = await embedder.embedQuery(doc.pageContent)

    process.stdout.write(`${Math.floor((counter / documents.flat().length) * 100)}%\r`)
    counter = counter + 1
    return {
      id: uuid(),
      values: embedding,
      metadata: {
        chunk: doc.pageContent,
        text: doc.metadata.text as string,
        url: doc.metadata.url as string,
      }
    } as Vector
  }
  const rateLimitedGetEmbedding = limiter.wrap(getEmbedding);
  process.stdout.write("100%\r")
  console.log("done embedding");

  let vectors = [] as Vector[]

  try {
    vectors = await Promise.all(documents.flat().map((doc) => rateLimitedGetEmbedding(doc))) as unknown as Vector[]
    const chunks = sliceIntoChunks(vectors, 10)

    try {
      await Promise.all(chunks.map(async chunk => {
        await index!.upsert({
          upsertRequest: {
            vectors: chunk as Vector[],
            namespace: modelName,
          }
        })
      }))
    } catch (e) {
      console.log(e)
    }
  } catch (e) {
    console.log(e)
  }
}

// export const reviews: QueryResolvers['reviews'] = () => {
//   return db.review.findMany()
// }
//
// export const review: QueryResolvers['review'] = ({ id }) => {
//   return db.review.findUnique({
//     where: { id },
//   })
// }
//
// export const createReview: MutationResolvers['createReview'] = ({ input }) => {
//   return db.review.create({
//     data: input,
//   })
// }
//
// export const updateReview: MutationResolvers['updateReview'] = ({
//   id,
//   input,
// }) => {
//   return db.review.update({
//     data: input,
//     where: { id },
//   })
// }
//
// export const deleteReview: MutationResolvers['deleteReview'] = ({ id }) => {
//   return db.review.delete({
//     where: { id },
//   })
// }
