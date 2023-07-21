import { render } from '@redwoodjs/testing/web'

import CheckoutSuccessPage from './CheckoutSuccessPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CheckoutSuccessPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CheckoutSuccessPage />)
    }).not.toThrow()
  })
})
