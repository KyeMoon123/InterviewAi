import {useContext, useState} from "react";
import Conversation from "src/components/Conversation/Conversation";
import {useAuth} from "src/auth";
import {ModelContext} from "src/context/ModelProvider";
import {ConversationContext} from "src/context/ConversationProvider";
import {useChannel} from "@ably-labs/react-hooks";
import {updateChatbotMessage} from "src/Utils";
import {toast} from "@redwoodjs/web/toast";
import ChatInput from "src/components/ChatInput/ChatInput";
import {ConversationEntry} from "types/graphql";

export interface ConversationProps {
conversationEntries: Partial<ConversationEntry>[];
}

export const ConversationPanel = ({conversationEntries}:ConversationProps) => {

  const [text, setText] = useState("");
  const [localConversation, setLocalConversation] = useState<Partial<ConversationEntry>[]>(conversationEntries);
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
        entry: text,
        speaker: "user",
        date: new Date(),
      },
    ]);
    try {
      setDisableInput(true)
      setIsThinking(true)
      const response = await fetch("http://localhost:8910/api/chat", {
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
      if (json.error) {
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
      <div className={'flex flex-col justify-between h-full '}>
        <div className={' px-6 bg-base-200 text-base-content py-2'}>
          <div className={'flex flex-col '}>
            <h1 className={'capitalize text-lg font-semibold'}>{model.name}</h1>
            <h1 className={' text-sm font-semibold '}>{statusMessage}</h1>
          </div>
        </div>
        <div className={'h-full  border rounded rounded-xl overflow-hidden overflow-y-scroll  m-4'}>
          <Conversation conversation={localConversation}/>
        </div>
        <div className={' h-24 py-2 my-4 '}>
          <ChatInput disabled={disableInput} onSubmit={submit} text={text} setText={setText}/>
        </div>
      </div>
    </>
  )
}
