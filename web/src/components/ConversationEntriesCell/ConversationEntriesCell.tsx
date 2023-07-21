 import type {ConversationEntriesQuery} from 'types/graphql'
import type {CellSuccessProps, CellFailureProps} from '@redwoodjs/web'
import Conversation, {ConversationEntry} from "src/components/Conversation/Conversation";
import ChatInput from "src/components/ChatInput/ChatInput";
import {useContext, useState} from "react";
import {ModelContext} from "src/context/ModelProvider";
import {ConversationContext} from "src/context/ConversationProvider";
import {useChannel} from "@ably-labs/react-hooks";
import {updateChatbotMessage} from "src/Utils";
 import {useAuth} from "src/auth";
 import {toast} from "@redwoodjs/web/toast";

export const QUERY = gql`
  query ConversationEntriesQuery($conversationId: String!) {
    conversationEntries(conversationId: $conversationId) {
      id
      speaker
      entry
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  const [text, setText] = useState("");
  const [localConversation, setLocalConversation] = useState<ConversationEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("Waiting for query...");
  const [isThinking, setIsThinking] = useState(false);

  const {model} = useContext(ModelContext);
  const {conversation} = useContext(ConversationContext);
  const {currentUser, getToken} = useAuth()

  useChannel(currentUser.sub as string, (message) => {
    switch (message.data.event) {
      case "response":
        setLocalConversation((state) => updateChatbotMessage(state, message));
        break;
      case "status":
        setStatusMessage(message.data.message);
        break;
      case "responseEnd":
      default:
        setStatusMessage("Waiting for query...");
    }
  });

  const submit = async () => {
    setLocalConversation((state) => [
      ...state,
      {
        message: text,
        speaker: "user",
        date: new Date(),
      },
    ]);
    try {
      setIsThinking(true)
      const response = await fetch("http://localhost:8910/.redwood/functions/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${await getToken()}`,
          "Content-Type": "application/json",
          "auth-provider": "supabase"
        },
        body: JSON.stringify({
          prompt: text,
          modelId: model.id,
          modelName: model.name,
          conversationId: conversation.id,
        }),
      });

      await response.json();
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsThinking(false)
    }
    setText("");
  };

  return (
    <>
      <Conversation conversation={localConversation}/>
      <ChatInput onSubmit={submit} text={text} setText={setText}/>
    </>
  )
}

export const Failure = ({error}: CellFailureProps) => (
  <div style={{color: 'red'}}>Error: {error?.message}</div>
)

export const Success = ({
                          conversationEntries,
                        }: CellSuccessProps<ConversationEntriesQuery>) => {

  const existingConversationEntries = conversationEntries.map((entry) => ({
    message: entry.entry,
    speaker: entry.speaker,
    date: new Date(entry.createdAt),
  }));

  const [text, setText] = useState("");
  const [localConversation, setLocalConversation] = useState<ConversationEntry[]>(existingConversationEntries);
  const [statusMessage, setStatusMessage] = useState("Waiting for query...");
  const [isThinking, setIsThinking] = useState(false);
  const [disableInput, setDisableInput] = useState(false)
  const {currentUser, getToken} = useAuth()

  const {model} = useContext(ModelContext);
  const {conversation} = useContext(ConversationContext);



  useChannel(String(currentUser.sub), (message) => {
    switch (message.data.event) {
      case "response":
        setLocalConversation((state) => updateChatbotMessage(state, message));
        break;
      case "status":
        setStatusMessage(message.data.message);
        break;
      case "responseEnd":
      default:
        setDisableInput(false)
        setStatusMessage("Waiting for query...");
    }
  });

  const submit = async () => {
    setLocalConversation((state) => [
      ...state,
      {
        message: text,
        speaker: "user",
        date: new Date(),
      },
    ]);
    try {
      setDisableInput(true)
      setIsThinking(true)
      const response = await fetch("http://localhost:8910/.redwood/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getToken()}`,
          "auth-provider": "supabase"
        },
        body: JSON.stringify({
          prompt: text,
          modelId: model.id,
          modelName: model.name,
          conversationId: conversation.id,
        }),
      });
     const json = await response.json();
     if(json.error) {
        toast.error(json.error)
     }
      setIsThinking(false)
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {

    }
    setText("");
  };

  return (
    <>
      <div className={'top-0  px-6 bg-base-200 text-base-content py-2'}>
        <div className={'flex flex-col '}>
          <h1 className={'capitalize text-lg font-semibold'}>{model.name}</h1>
          <h1 className={' text-sm font-semibold '}>{statusMessage}</h1>
        </div>
      </div>
      <div className={'overflow-hidden overflow-y-scroll h-screen'}>
        <Conversation conversation={localConversation}/>
      </div>

      <div className={''}>
        <ChatInput disabled={disableInput} onSubmit={submit} text={text} setText={setText}/>
      </div>
    </>
  )
}
