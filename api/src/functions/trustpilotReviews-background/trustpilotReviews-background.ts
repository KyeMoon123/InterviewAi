import type {APIGatewayEvent, Context} from 'aws-lambda'
import {TrustPilotService} from "src/lib/TrustPilotLib/TrustPilotService";
import {logger} from "src/lib/logger";
import { PromisePool } from '@supercharge/promise-pool'
import {batchSaveReviews, indexReviews, removeExistingReviews} from "src/services/reviews/reviews";
import {trustPilotScraper} from "src/lib/TrustPilotLib/TrustPilotScraper";
import {useRequireAuth} from "@redwoodjs/graphql-server";
import {getCurrentUser} from "src/lib/auth";
import {authDecoder} from "@redwoodjs/auth-supabase-api";
import {checkoutHandler} from "src/functions/checkout/checkout";
import {verifySignature} from "@redwoodjs/api/webhooks";
import {verifyWebhook} from "src/lib/utils";

/**
 *
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param _context
 * function, and execution environment.
 */
export const trustPilotScrapingHandler = async (event: APIGatewayEvent, _context: Context) => {
  await verifyWebhook(event)

  const parsedBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body
  const {url, modelName} = JSON.parse(parsedBody);
  try {

    const paginationURLS = await trustPilotScraper.getUrlsForAllReviewPages(url);

    if (paginationURLS === undefined) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error while fetching pagination urls from TrustPilot"
        })
      }
    }

    const { results, errors } = await PromisePool
      .for(paginationURLS)
      .onTaskStarted((url) => logger.info(`Scraping TrustPilot reviews from ${url}`))
      .onTaskFinished((url) => logger.info(`Finished scraping TrustPilot reviews from ${url}`))
      .withConcurrency(4)
      .process(async (url) => {
        const pageReviews =  await trustPilotScraper.scrapePage(url);
        if (pageReviews === undefined) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              message: "Error while fetching reviews from TrustPilot"
            })
          }
        }
        // Convert TrustPilot reviews to Reviews
        const reviews = await TrustPilotService.convertTrustPilotReviewsToReviews(pageReviews);

        // Remove existing reviews
        const newReviews = await removeExistingReviews(reviews);

        // Batch save new reviews to DB
        await batchSaveReviews(newReviews, "TRUST_PILOT");

        // Index new reviews to Pinecone
        await indexReviews(newReviews, "TRUST_PILOT", modelName);
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "success"
      })
    }
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error while fetching reviews from TrustPilot"
      })
    }
  }
}

export const handler = useRequireAuth({
  handlerFn: trustPilotScrapingHandler,
  getCurrentUser,
  authDecoder,
})
