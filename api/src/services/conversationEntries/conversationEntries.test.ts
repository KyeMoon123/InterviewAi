import type { ConversationEntry } from '@prisma/client'

import {
  conversationEntries,
  conversationEntry,
  createConversationEntry,
  updateConversationEntry,
  deleteConversationEntry,
} from './conversationEntries'
import type { StandardScenario } from './conversationEntries.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('conversationEntries', () => {
  scenario(
    'returns all conversationEntries',
    async (scenario: StandardScenario) => {
      const result = await conversationEntries()

      expect(result.length).toEqual(
        Object.keys(scenario.conversationEntry).length
      )
    }
  )

  scenario(
    'returns a single conversationEntry',
    async (scenario: StandardScenario) => {
      const result = await conversationEntry({
        id: scenario.conversationEntry.one.id,
      })

      expect(result).toEqual(scenario.conversationEntry.one)
    }
  )

  scenario(
    'creates a conversationEntry',
    async (scenario: StandardScenario) => {
      const result = await createConversationEntry({
        input: {
          updatedAt: '2023-07-08T07:32:44.722Z',
          conversationId: scenario.conversationEntry.two.conversationId,
          speaker: 'user',
          entry: 'String',
        },
      })

      expect(result.updatedAt).toEqual(new Date('2023-07-08T07:32:44.722Z'))
      expect(result.conversationId).toEqual(
        scenario.conversationEntry.two.conversationId
      )
      expect(result.speaker).toEqual('user')
      expect(result.entry).toEqual('String')
    }
  )

  scenario(
    'updates a conversationEntry',
    async (scenario: StandardScenario) => {
      const original = (await conversationEntry({
        id: scenario.conversationEntry.one.id,
      })) as ConversationEntry
      const result = await updateConversationEntry({
        id: original.id,
        input: { updatedAt: '2023-07-09T07:32:44.722Z' },
      })

      expect(result.updatedAt).toEqual(new Date('2023-07-09T07:32:44.722Z'))
    }
  )

  scenario(
    'deletes a conversationEntry',
    async (scenario: StandardScenario) => {
      const original = (await deleteConversationEntry({
        id: scenario.conversationEntry.one.id,
      })) as ConversationEntry
      const result = await conversationEntry({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
