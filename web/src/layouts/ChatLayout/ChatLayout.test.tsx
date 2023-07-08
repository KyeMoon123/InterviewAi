import { render } from '@redwoodjs/testing/web'

import ChatLayout from './ChatLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ChatLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ChatLayout />)
    }).not.toThrow()
  })
})
