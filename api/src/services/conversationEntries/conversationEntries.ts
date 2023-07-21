import type {
  QueryResolvers,
  MutationResolvers,
  ConversationEntryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const conversationEntries: QueryResolvers['conversationEntries'] =
  ({conversationId}) => {
    return db.conversationEntry.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: { createdAt: 'asc' },
    })
  }

export const conversationEntry: QueryResolvers['conversationEntry'] = ({
  id,
}) => {
  return db.conversationEntry.findUnique({
    where: { id },
  })
}

export const createConversationEntry: MutationResolvers['createConversationEntry'] =
  ({ input }) => {
    return db.conversationEntry.create({
      data: input,
    })
  }

export const updateConversationEntry: MutationResolvers['updateConversationEntry'] =
  ({ id, input }) => {
    return db.conversationEntry.update({
      data: input,
      where: { id },
    })
  }

export const deleteConversationEntry: MutationResolvers['deleteConversationEntry'] =
  ({ id }) => {
    return db.conversationEntry.delete({
      where: { id },
    })
  }

export const ConversationEntry: ConversationEntryRelationResolvers = {
  conversation: (_obj, { root }) => {
    return db.conversationEntry
      .findUnique({ where: { id: root?.id } })
      .conversation()
  },
}
