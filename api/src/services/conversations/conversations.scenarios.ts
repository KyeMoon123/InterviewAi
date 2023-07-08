import type { Prisma, Conversation } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ConversationCreateArgs>({
  conversation: {
    one: {
      data: {
        updatedAt: '2023-07-07T12:12:19.128Z',
        speaker: 'USER',
        entry: 'String',
      },
    },
    two: {
      data: {
        updatedAt: '2023-07-07T12:12:19.128Z',
        speaker: 'USER',
        entry: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Conversation, 'conversation'>
