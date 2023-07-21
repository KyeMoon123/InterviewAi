import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        id: 'String',
        updatedAt: '2023-07-16T08:56:34.834Z',
        credits: 8415735,
      },
    },
    two: {
      data: {
        id: 'String',
        updatedAt: '2023-07-16T08:56:34.834Z',
        credits: 2374818,
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
