import {APIGatewayEvent} from "aws-lambda";
import {signPayload, verifyEvent, VerifyOptions} from "@redwoodjs/api/webhooks";

export const verifyWebhook = (event: APIGatewayEvent) => {
  const parsedBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  try {
    const options = {
      signatureHeader: 'internal-Webhook-Signature',
    } as VerifyOptions

    verifyEvent('sha256Verifier', {
      event,
      payload: parsedBody,
      secret: process.env.INTERNAL_WEBHOOK_SECRET,
      options,
    })
  } catch (e) {
    throw new Error('Webhook verification failed')
  }
}

