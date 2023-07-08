import {logger} from "src/lib/logger";

import {PromisePool} from "@supercharge/promise-pool";

import {TrustPilotReview} from "src/lib/TrustPilotLib/interfaces";
import {trustPilotScraper} from "src/lib/TrustPilotLib/TrustPilotScraper";

import {CreateReviewInput, Review} from "types/graphql";

/**
 * @description TrustPilotService is a service that handles all the TrustPilot related Logic operations
 */
export const TrustPilotService = (function () {

  // /**
  //  * Trigger Trust Pilot review scraping by kicking off a serverless background function
  //  * @param campaignId
  //  * @param excludeNames
  //  * @param url
  //  * @param searchRequestId
  //  */
  // const triggerTrustPilotScraping = ({campaignId, url, searchRequestId, searchType}: TriggerScrapingInput) => {
  //   const payload = {searchRequestId, campaignId, url, searchType};
  //   const signature = authService.signWebhookPayload(payload);
  //
  //   axios.post(
  //     `${process.env.SERVER_FUNCTIONS_SRC}/trustpilotReviews-background`,
  //     payload,
  //     {
  //       headers: {
  //         "Authorization": "Bearer " + context.currentUser?.token,
  //         "auth-provider": String(context.currentUser?.type),
  //         "Content-Type": "application/json",
  //         "Percept-Webhook-Signature": signature,
  //       },
  //     }
  //   ).catch((error) => {
  //     logger.error(`${error}`);
  //   });
  // }

  /**
   * @description Scrape reviews from TrustPilot and convert them to {@link Review}'s
   * First scrape the pagination links to determine how many pages to scrape
   * The method will only scrape the amount of reviews that the user is allowed to scrape based on their role
   * @param url
   */
  const scrapeTrustPilotReviews = async (url: string): Promise<TrustPilotReview[] | undefined> => {
    let urls: string[] = [];

    try {
      urls = await trustPilotScraper.getUrlsForAllReviewPages(url);
    } catch (error) {
      logger.info(`Error Fetching pagination urls: ${error}`)
      return undefined;
    }

    if (!urls || urls.length === 0) return [];

    const reviews = await trustPilotScraper.scrapeUrls({urls});

    logger.info(`Scraped ${reviews.length} reviews from TrustPilot`);

    return reviews;
  };

  /**
   * @description Creates a unique external reference for a TrustPilotReview.
   * @example "JohnDoe-trust_pilot-2021-01-01-5"
   * @param review
   * @returns The unique external reference.
   */
  const createTrustPilotExternalRef = (review: TrustPilotReview): string => {
    return `${review.reviewerName}-trust_pilot-${review.reviewDate.trim()}-${review.reviewRating}`.replace(/\s/g, '');
  };



  /**
   * @description from a list of {@link TrustPilotReview}'s  convert them to {@link Review}'s
   * Use PromisePool to convert them in parallel
   * Review text is labeled using sentiment analysis during conversion
   * @param trustPilotReviews
   */
  const convertTrustPilotReviewsToReviews = async (trustPilotReviews: TrustPilotReview[]): Promise<CreateReviewInput[]> => {
    const {results} = await PromisePool
      .for(trustPilotReviews)
      .withConcurrency(15)
      .process(async review => {
        let label = "UNKNOWN" // default label
        let reviewText = review.reviewText ? review.reviewText.substring(0, 1000) : review.reviewTitle
        try {
          return {
            externalReference: createTrustPilotExternalRef(review),
            body: reviewText,
            source: "TRUST_PILOT",
            rating: parseInt(review.reviewRating),
            createdAt: new Date(review.reviewDate.trim()),
            scrapedAt: new Date(),
          }
        } catch (err) {
          logger.error(`Error while classifying review ${review.reviewText}`)
        }
      })
    return results.filter(r => r != undefined) as CreateReviewInput[] // filter out undefined just in case
  }

  return {
    scrapeTrustPilotReviews,
    convertTrustPilotReviewsToReviews,
    createTrustPilotExternalRef
  }
})();



