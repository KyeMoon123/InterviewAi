import type { ModelRequest } from '@prisma/client'

import {
  modelRequests,
  modelRequest,
  createModelRequest,
  updateModelRequest,
  deleteModelRequest,
} from './modelRequests'
import type { StandardScenario } from './modelRequests.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('modelRequests', () => {
  scenario('returns all modelRequests', async (scenario: StandardScenario) => {
    const result = await modelRequests()

    expect(result.length).toEqual(Object.keys(scenario.modelRequest).length)
  })

  scenario(
    'returns a single modelRequest',
    async (scenario: StandardScenario) => {
      const result = await modelRequest({ id: scenario.modelRequest.one.id })

      expect(result).toEqual(scenario.modelRequest.one)
    }
  )

  scenario('creates a modelRequest', async () => {
    const result = await createModelRequest({
      input: { userId: 'String', businessName: 'String' },
    })

    expect(result.userId).toEqual('String')
    expect(result.businessName).toEqual('String')
  })

  scenario('updates a modelRequest', async (scenario: StandardScenario) => {
    const original = (await modelRequest({
      id: scenario.modelRequest.one.id,
    })) as ModelRequest
    const result = await updateModelRequest({
      id: original.id,
      input: { userId: 'String2' },
    })

    expect(result.userId).toEqual('String2')
  })

  scenario('deletes a modelRequest', async (scenario: StandardScenario) => {
    const original = (await deleteModelRequest({
      id: scenario.modelRequest.one.id,
    })) as ModelRequest
    const result = await modelRequest({ id: original.id })

    expect(result).toEqual(null)
  })
})
