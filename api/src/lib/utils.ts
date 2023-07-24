import {APIGatewayEvent} from "aws-lambda";
import {signPayload, verifyEvent, VerifyOptions} from "@redwoodjs/api/webhooks";

export const verifyWebhook = (event: APIGatewayEvent) => {
  try {
    const options = {
      signatureHeader: 'internal-Webhook-Signature',
    } as VerifyOptions

    verifyEvent('sha256Verifier', {
      event,
      payload: event.body,
      secret: process.env.INTERNAL_WEBHOOK_SECRET,
      options,
    })
  } catch (e) {
    throw new Error('Webhook verification failed')
  }
}

const signWebhook = (payload) => {
  return signPayload('sha256Verifier', {
    payload: JSON.stringify(payload),
    secret: process.env.WEBHOOK_SECRET,
  })
}
