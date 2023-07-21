import puppeteer, {Page} from "puppeteer-core";
import {TrustPilotReview} from "src/lib/TrustPilotLib/interfaces";
import _ from "lodash";
import {logger} from "src/lib/logger";

export const trustPilotScraper = (function () {
  const auth = 'brd-customer-hl_70da15bc-zone-zone3:imqnakbigdg4';

  /**
   * @description Get the number of pages for pagination on TrustPilot
   * Used to determine how many pages to scrape and generate pagination URLs
   * Currently get number of pages for all plan tiers
   * @param url - base URL of TrustPilot page
   */
  const getUrlsForAllReviewPages = async (url: string): Promise<string[]> => {
    const urls: string[] = []
    let browser;
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
      });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await page.goto(`${url}?&sort=recency`)
      const largestPageNumber = await getNumberOfPages(page)

      for (let i = 1; i <= largestPageNumber; i++) {
        urls.push(`${url}?page=${i}&sort=recency`) // sort by recency
      }

      return urls
    } catch (e) {
      throw new Error('failed while fetching pagination URLs', e);
    } finally {
      await browser?.close();
    }
  }

  const scrapePage = async (url: string): Promise<TrustPilotReview[] | undefined> => {
    let browser;
    let pageReviews: TrustPilotReview[] = [];
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
      });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await page.goto(`${url}?&sort=recency`)
      try {
        pageReviews = await getPageReviews({
          page: page,
        });
      } catch (e) {
        logger.error('failed to get page reviews', e)
        pageReviews = undefined;
      }
    } catch (e) {
      throw new Error('failed while fetching pagination URLs', e);
    } finally {
      await browser?.close();
    }
    return pageReviews
  }


  /**
   * @description Scrape an array of URLs and return the reviews for each page
   * @param urls - array of pagination URLs
   * @param maxReviewCountByRole - max number of reviews to scrape based on user role
   * @param lastReviewScraped
   * @param searchType
   */
  const scrapeUrls = async ({
                              urls,
                            }: {
    urls: string[],

  }): Promise<TrustPilotReview[]> => {
    let browser;
    const reviews: TrustPilotReview[] = [];
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`,
      });

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);

      for (const [index, url] of _.entries(urls)) {
        logger.info(`Scraping page ${parseInt(index) + 1} of ${urls.length}`)
        let pageReviews;
        await page.goto(url)
        try {
          pageReviews = await getPageReviews({
            page: page,
          });
        } catch (e) {
          logger.error('failed to get page reviews', e)
          return reviews
        }
        reviews.push(...pageReviews);
      }
    } catch (e) {
    } finally {
      await browser?.close();
    }
    return reviews
  }

  /**
   * @description Utility function to evaluate each page and return the reviews from it
   * @param page - puppeteer page
   * @param remainingCount - number of reviews remaining to scrape before reaching max review count by role
   */
  const getPageReviews = async ({
                                  page,

                                }: { page: Page }): Promise<TrustPilotReview[]> => {

    return await page.evaluate(() => {
      const cards: TrustPilotReview[] = [];
      const cardElements = document.querySelectorAll(".styles_cardWrapper__LcCPA.styles_show__HUXRb.styles_reviewCard__9HxJJ");

      for (let i = 0; i < cardElements.length; i++) {
        const cardElement = cardElements[i];
        const reviewTitleElement = cardElement.querySelector('h2.typography_heading-s__f7029');
        const reviewTextElement = cardElement.querySelector('p.typography_body-l__KUYFJ');
        const reviewerNameElement = cardElement.querySelector('span.typography_heading-xxs__QKBS8');
        const ratingImageElement = cardElement.querySelector('div.star-rating_starRating__4rrcf img');
        const dateElement = cardElement.querySelector('p.typography_body-m__xgxZ_');

        // Check if the elements exist before accessing their textContent
        const reviewTitle = reviewTitleElement ? reviewTitleElement.textContent : '';
        const reviewText = reviewTextElement ? reviewTextElement.textContent : '';
        const reviewerName = reviewerNameElement ? reviewerNameElement.textContent : '';
        const ratingImage = ratingImageElement ? ratingImageElement.getAttribute('src') : '';
        const reviewDate = dateElement ? String(dateElement.textContent).replace('Date of experience:', '') : '';

        // Extract the rating value from the image source URL
        const reviewRating = ratingImage.match(/stars-(\d)\.svg$/)?.[1] || '';

        const trustPilotReview: TrustPilotReview = {
          reviewTitle,
          reviewText,
          reviewerName,
          reviewRating,
          reviewDate,
        };

        cards.push({
          ...trustPilotReview,
        });

      }
      return cards;
    })
  }

  /**
   * @description Utility function to get the number of pages for pagination on TrustPilot
   * Used to determine how many pages to scrape and generate pagination URLs
   * @param page
   */
  const getNumberOfPages = async (page: Page) => {
    return await page.evaluate(() => {
      let links = []
      const navElement = document.querySelector('nav.pagination_pagination___F1qS');
      const pageLinks = navElement.querySelectorAll('a.pagination-link_item__mkuN3');
      for (let i = 0; i < pageLinks.length; i++) {
        const pageLink = pageLinks[i];
        links.push(pageLink.textContent)
      }
      return Math.max(...links)
    })
  }

  return {
    scrapeUrls,
    scrapePage,
    getUrlsForAllReviewPages
  }
})();
