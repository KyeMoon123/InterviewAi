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

export const sendChatMessage = async ({token, body}:{token:string, body:any}):Promise<Response> => {
  let response =  await fetch(`${process.env.UI_FUNCTIONS_SRC}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "auth-provider": "supabase"
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    if(response.status === 504){
      throw new Error("Sorry your request timed out. Your query may be to large or there may be an issue on our end. Please try again later.")
    }
    const {error} = await response.json()
    throw new Error(error)
  }
  return response
}

export const stripeCheckout = async ({token, planType}:{token:string, planType:string}):Promise<Response> => {
  return  await fetch(`${process.env.UI_FUNCTIONS_SRC}/checkout?plan=${planType}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "auth-provider": "supabase"
    },
  })
}
