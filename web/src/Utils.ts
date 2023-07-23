import {Types} from "ably";
import {ConversationEntry} from "types/graphql";

export const updateChatbotMessage = (
  conversation:Partial<ConversationEntry>[],
  message: Types.Message
): Partial<ConversationEntry>[] => {
  const interactionId = message.data.interactionId;

  const updatedConversation = conversation.reduce(
    (acc: ConversationEntry[], e: ConversationEntry) => [
      ...acc,
      e.id === interactionId
        ? {...e, entry: e.entry + message.data.token}
        : e,
    ],
    []
  );

  return conversation.some((e) => e.id === interactionId)
    ? updatedConversation
    : [
      ...updatedConversation,
      {
        id: interactionId,
        entry: message.data.token,
        speaker: "ai",
        createdAt: String(message.timestamp),
      },
    ];
};
