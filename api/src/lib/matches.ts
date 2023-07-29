import {PineconeClient, ScoredVector} from "@pinecone-database/pinecone";

export type Metadata = {
  url: string,
  text: string,
  chunk: string,
}


const getMatchesFromEmbeddings = async ({
                                          embeddings,
                                          pinecone,
                                          topK,
                                          namespace
                                        }: { embeddings: number[], pinecone: PineconeClient, topK: number, namespace: string }): Promise<ScoredVector[]> => {
  if (!process.env.PINECONE_INDEX_NAME) {
    throw (new Error("PINECONE_INDEX_NAME is not set"))
  }

  const index = pinecone!.Index(process.env.PINECONE_INDEX_NAME);
  const queryRequest = {
    vector: embeddings,
    topK,
    includeMetadata: true,
    namespace: namespace,
  }
  console.log("Querying embeddings: ", queryRequest)
  console.log("Size: ", queryRequest.vector.length)
  try {
    const queryResult = await index.query({
      queryRequest
    })
    console.log("Query result: ", queryResult)

    return queryResult.matches?.map(match => ({
      ...match,
      metadata: match.metadata as Metadata
    })) || []
  } catch (e) {
    console.log("Error querying embeddings: ", e)
    throw (new Error(`Error querying embeddings: ${e}`,))
  }
}

export {getMatchesFromEmbeddings}
