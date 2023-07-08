import { mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './chat'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('chat function', () => {
  it('Should respond with 200', async () => {

    const payload = {
      prompt: 'what is the most common complaint?',
      userId: '123',
    }


    const httpEvent = mockHttpEvent({
      body: JSON.stringify(payload),
    })

    const response = await handler(httpEvent, null)
    const { data } = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(data).toBe('chat function')
  })

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
