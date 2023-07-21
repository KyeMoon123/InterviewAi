import {MutationResolvers} from "types/graphql";
import {modelRepository} from "src/services/models/models";

export const triggerScrape: MutationResolvers['triggerScrape'] = async ({url, modelName, source}) => {
  let model = await modelRepository.findModelByName(modelName.toLowerCase());
  if (model === null) {
    model = await modelRepository.createModel({name: modelName.toLowerCase()});
  }
  triggerBySource(source, url, model.name);
  return {
    url: url,
    modelName: model.name,
    message: `Scraping ${source} reviews for ${model.name} from ${url} has been triggered.`
  }
}

const triggerBySource =  (source, url, modelName) => {
  switch (source) {
    case "TRUST_PILOT":
      scrapeTrustPilot(url,modelName);
    default:
      return {
        url: url,
        modelName: modelName,
        message: "Source does not exist"
      }
  }
}

const scrapeTrustPilot =  async (url, modelName) => {
  try {
    await fetch("http://localhost:8911/trustpilotReviews-background", {
      method: 'POST',
      body: JSON.stringify({
        url: url,
        modelName: modelName
      })
    });
  } catch (error) {
    console.log(error)
    return {
      url: url,
      modelName: modelName,
      message: "Error while fetching reviews from TrustPilot"
    }
  }
}
