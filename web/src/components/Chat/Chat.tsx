import {useContext} from "react";
import {ModelContext} from "src/context/ModelProvider";
import {ConversationContext} from "src/context/ConversationProvider";
import ConversationEntriesCell from "src/components/ConversationEntriesCell";

const Chat = () => {

  const {model} = useContext(ModelContext);
  const {conversation} = useContext(ConversationContext);

  return (
    <>
      {conversation ?
        (
          <ConversationEntriesCell
            conversationId={conversation?.id}
          />
        ) : (
          <div className={'flex flex-col items-center place-content-center h-screen px-20 '}>
            Choose a model from the left, then start a conversation from the right.
          </div>
        )
      }
    </>
  )
}

export default Chat
