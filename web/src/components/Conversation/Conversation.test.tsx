import { render } from '@redwoodjs/testing/web'

import Conversation from './Conversation'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Conversation', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Conversation />)
    }).not.toThrow()
  })
})
