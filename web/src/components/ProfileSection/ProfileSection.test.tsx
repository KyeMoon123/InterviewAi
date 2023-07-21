import { render } from '@redwoodjs/testing/web'

import ProfileSection from './ProfileSection'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProfileSection', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProfileSection />)
    }).not.toThrow()
  })
})
