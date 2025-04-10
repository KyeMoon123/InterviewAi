import type {APIGatewayEvent, Context} from 'aws-lambda'
import Ably from "ably/promises";

import {logger} from 'src/lib/logger'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */

let options: Ably.Types.ClientOptions = {key: process.env.ABLY_API_KEY};
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: ablyTokenRequest function`)

  const client = new Ably.Realtime(options);
  const tokenRequestData = await client.auth.createTokenRequest({clientId: event.queryStringParameters?.clientId});

  logger.info(`tokenRequestData: ${JSON.stringify(tokenRequestData)}`)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokenRequestData),
  }
}
