import type {ScenarioData} from '@redwoodjs/testing/api'

export const standard = defineScenario({
  campaign: {
    one: {
      data: {
        title: 'String',
        description: 'String',
        userId: '123',
        integrations: {
          create: {
            type: 'TRUST_PILOT',
            status: 'Active',
            url: 'String',
          }
        }
      },
    }
  }
})

export type StandardScenario = ScenarioData<unknown>
