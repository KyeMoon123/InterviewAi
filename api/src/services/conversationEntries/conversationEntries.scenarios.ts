import type { Prisma, ConversationEntry } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ConversationEntryCreateArgs>({
  conversationEntry: {
    one: {
      data: {
        updatedAt: '2023-07-08T07:32:44.753Z',
        speaker: 'user',
        entry: 'String',
        conversation: { create: { updatedAt: '2023-07-08T07:32:44.753Z' } },
      },
    },
    two: {
      data: {
        updatedAt: '2023-07-08T07:32:44.753Z',
        speaker: 'user',
        entry: 'String',
        conversation: { create: { updatedAt: '2023-07-08T07:32:44.753Z' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  ConversationEntry,
  'conversationEntry'
>
