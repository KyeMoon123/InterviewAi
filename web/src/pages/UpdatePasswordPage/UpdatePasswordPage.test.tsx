import { render } from '@redwoodjs/testing/web'

import UpdatePasswordPage from './UpdatePasswordPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('UpdatePasswordPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UpdatePasswordPage />)
    }).not.toThrow()
  })
})
