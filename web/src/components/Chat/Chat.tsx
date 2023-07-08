import ChatInput from "src/components/ChatInput/ChatInput";
import Conversation, {ConversationEntry} from "src/components/Conversation/Conversation";
import {useState} from "react";
import {useChannel} from "@ably-labs/react-hooks";
import {updateChatbotMessage} from "src/Utils";

const Chat = () => {
  const [text, setText] = useState("");
  const [extendedResult, updateExtendedResult] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Waiting for query...");
  const [isListening, setIsListening] = useState(false);
  const userId = "123";

  useChannel(userId, (message) => {
    switch (message.data.event) {
      case "response":
        setConversation((state) => updateChatbotMessage(state, message));
        break;
      case "status":
        setStatusMessage(message.data.message);
        break;
      case "responseEnd":
      default:
        setBotIsTyping(false);
        setStatusMessage("Waiting for query...");
    }
  });

  const submit = async (event) => {
    event.preventDefault();
    setConversation((state) => [
      ...state,
      {
        message: text,
        speaker: "user",
        date: new Date(),
      },
    ]);
    try {
      setBotIsTyping(true);
      const response = await fetch("http://localhost:8910/.redwood/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({prompt: text, userId}),
      });

      await response.json();
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setBotIsTyping(false);
    }
    setText("");
  };

  return (
    <div>
      <Conversation conversation={conversation}/>
      <ChatInput onSubmit={submit} text={text} setText={setText}/>
    </div>
  )
}

export default Chat
