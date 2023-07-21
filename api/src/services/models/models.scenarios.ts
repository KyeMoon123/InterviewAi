import type { Prisma, Model } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ModelCreateArgs>({
  model: {
    one: {
      data: {
        updatedAt: '2023-07-08T07:32:29.622Z',
        name: 'String',
        version: 'String',
      },
    },
    two: {
      data: {
        updatedAt: '2023-07-08T07:32:29.622Z',
        name: 'String',
        version: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Model, 'model'>
