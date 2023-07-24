import {MutationResolvers} from "types/graphql";
import {modelRepository} from "src/services/models/models";
import {signPayload} from "@redwoodjs/api/webhooks";
import {logger} from "src/lib/logger";

export const triggerScrape: MutationResolvers['triggerScrape'] = async ({url, modelName, source}) => {
  let model = await modelRepository.findModelByName(modelName.toLowerCase());
  if (model === null) {
    model = await modelRepository.createModel({name: modelName.toLowerCase()});
  }
  await triggerBySource(source, url, model.name);
  return {
    url: url,
    modelName: model.name,
    message: `Scraping ${source} reviews for ${model.name} from ${url} has been triggered.`
  }
}

const triggerBySource =  async (source, url, modelName) => {
  switch (source) {
    case "TRUST_PILOT":
      await scrapeTrustPilot(url, modelName);
    default:
      return {
        url: url,
        modelName: modelName,
        message: "Source does not exist"
      }
  }
}

const scrapeTrustPilot =  async (url, modelName) => {
  const body = {
    url: url,
    modelName: modelName
  }

  const signature =  signPayload('sha256Verifier', {
    payload: JSON.stringify(body),
    secret: process.env.WEBHOOK_SECRET,
  })

  try {
    console.log(`Triggering scraping for ${modelName} from ${url}`)
    console.log(`${process.env.PROTOCOL}${process.env.API_URL}/trustpilotReviews-background`)
    await fetch(`${process.env.PROTOCOL}${process.env.API_URL}/trustpilotReviews-background`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'internal-Webhook-Signature': signature
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
