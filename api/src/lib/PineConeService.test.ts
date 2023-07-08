import {awaitAllCallbacks} from "langchain/callbacks";
import {PineConeService} from "src/lib/PineConeService";

describe('PineConeService', () => {
  describe("getIndexes", () => {
    test("should return a list of indexes", async () => {
      const result = await PineConeService.getIndexes()
      expect(result).toEqual(["test"])
    })
  })
})
