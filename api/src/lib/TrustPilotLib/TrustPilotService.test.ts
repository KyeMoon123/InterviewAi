import {TrustPilotService} from "src/lib/TrustPilotLib/TrustPilotService";

describe('TrustPilotService', () => {
  describe('getPaginationLinks', () => {
    it('should return an array of pagination links for ING', async () => {
      const url = "https://au.trustpilot.com/review/ing.com.au"
      const links = await TrustPilotService.getUrls(url)
      expect(links.length).toEqual(88)
    })
    it('should return an array of pagination links for Alex Bank', async () => {
      const url = "https://au.trustpilot.com/review/www.alex.bank"
      const links = await TrustPilotService.getUrls(url)
      expect(links.length).toEqual(16)
    })

    it('should return an array of pagination links for UBank', async () => {
      const url = "https://au.trustpilot.com/review/ubank.com.au"
      const links = await TrustPilotService.getUrls(url)
      expect(links.length).toEqual(2)
    })
  })

  describe("scrapeTrustPilotReviews", () => {
    it("should return an array of reviews", async () => {
      const url = "https://au.trustpilot.com/review/ubank.com.au"
      const reviews = await TrustPilotService.scrapeTrustPilotReviews(url)
      expect(reviews.length).not.toEqual(0)
    })
  })
})
