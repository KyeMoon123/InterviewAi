import type {APIGatewayEvent, Context} from 'aws-lambda'
import {TrustPilotService} from "src/lib/TrustPilotLib/TrustPilotService";
import {logger} from "src/lib/logger";

import {batchSaveReviews, indexReviews, removeExistingReviews} from "src/services/reviews/reviews";

/**
 *
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param _context
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const {url} = JSON.parse(event.body);
  try {

    // Scrape TrustPilot reviews
    const trustPilotReviews = await TrustPilotService.scrapeTrustPilotReviews(url);

    if (trustPilotReviews === undefined) {
     return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error while fetching reviews from TrustPilot"
        })
     }
    }

    // Convert TrustPilot reviews to Reviews
    const reviews = await TrustPilotService.convertTrustPilotReviewsToReviews(trustPilotReviews);

    // Remove existing reviews
    const newReviews = await removeExistingReviews(reviews);

    // Batch save new reviews to DB
    await batchSaveReviews(newReviews, "TRUST_PILOT");

    // Index new reviews to Pinecone
    await indexReviews(newReviews, "TRUST_PILOT");

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
