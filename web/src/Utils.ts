import {Types} from "ably";
import {ConversationEntry} from "src/components/Conversation/Conversation";

export const updateChatbotMessage = (
  conversation: ConversationEntry[],
  message: Types.Message
): ConversationEntry[] => {
  const interactionId = message.data.interactionId;

  const updatedConversation = conversation.reduce(
    (acc: ConversationEntry[], e: ConversationEntry) => [
      ...acc,
      e.id === interactionId
        ? {...e, message: e.message + message.data.token}
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
        message: message.data.token,
        speaker: "bot",
        date: new Date(),
      },
    ];
};
