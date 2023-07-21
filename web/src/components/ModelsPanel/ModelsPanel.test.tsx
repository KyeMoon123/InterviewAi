import { render } from '@redwoodjs/testing/web'

import ModelsPanel from './ModelsPanel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ModelsPanel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ModelsPanel />)
    }).not.toThrow()
  })
})
