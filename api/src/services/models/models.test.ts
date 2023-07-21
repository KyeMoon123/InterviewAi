import type { Model } from '@prisma/client'

import { models, model, createModel, updateModel, deleteModel } from './models'
import type { StandardScenario } from './models.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('models', () => {
  scenario('returns all models', async (scenario: StandardScenario) => {
    const result = await models()

    expect(result.length).toEqual(Object.keys(scenario.model).length)
  })

  scenario('returns a single model', async (scenario: StandardScenario) => {
    const result = await model({ id: scenario.model.one.id })

    expect(result).toEqual(scenario.model.one)
  })

  scenario('creates a model', async () => {
    const result = await createModel({
      input: {
        updatedAt: '2023-07-08T07:32:29.589Z',
        name: 'String',
        version: 'String',
      },
    })

    expect(result.updatedAt).toEqual(new Date('2023-07-08T07:32:29.589Z'))
    expect(result.name).toEqual('String')
    expect(result.version).toEqual('String')
  })

  scenario('updates a model', async (scenario: StandardScenario) => {
    const original = (await model({ id: scenario.model.one.id })) as Model
    const result = await updateModel({
      id: original.id,
      input: { updatedAt: '2023-07-09T07:32:29.589Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-07-09T07:32:29.589Z'))
  })

  scenario('deletes a model', async (scenario: StandardScenario) => {
    const original = (await deleteModel({ id: scenario.model.one.id })) as Model
    const result = await model({ id: original.id })

    expect(result).toEqual(null)
  })
})
