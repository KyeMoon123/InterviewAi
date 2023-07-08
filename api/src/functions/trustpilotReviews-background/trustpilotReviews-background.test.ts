import {mockHttpEvent} from '@redwoodjs/testing/api'
import {handler} from './trustpilotReviews-background'

describe('trustpilotReviews-background function', () => {
  test('should respond with 200', async () => {
    const payload = {
      url: 'https://au.trustpilot.com/review/ubank.com.au',
    }

    const event = mockHttpEvent({
      queryStringParameters: payload,
    })
    const response = await handler(event, null)
    const {data} = JSON.parse(response.body)
  }, 100000)
})
