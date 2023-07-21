import { render } from '@redwoodjs/testing/web'

import ModelConversationsPanel from './ModelConversationsPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ModelConversationsPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ModelConversationsPanel />)
    }).not.toThrow()
  })
})
