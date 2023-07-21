import {useState} from "react";
import {Conversation} from "types/graphql";


interface ConversationContextProps {
  conversation: Conversation;
  setConversation: (conversation: Conversation) => void;
}

export const ConversationContext = React.createContext<ConversationContextProps>(null);
ConversationContext.displayName = 'ConversationContext';

export const ConversationProvider = ({children}) => {
  const [conversation, setConversation] = useState<Conversation>(window.localStorage.getItem('conversation') !== "undefined" ? JSON.parse(window.localStorage.getItem('conversation')) : null);


  const handleSetConversation = (conversation:Conversation) => {
    setConversation(conversation)
    window.localStorage.setItem('conversation', JSON.stringify(conversation))
  }

  return (
    <ConversationContext.Provider
      value={{
        conversation:  conversation as Conversation,
        setConversation: (conversation:Conversation) => {
          handleSetConversation(conversation);
        }
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
