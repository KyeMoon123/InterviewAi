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
            Please choose a model to chat with. Then pick up on a conversation or start a new one.
          </div>
        )
      }
    </>
  )
}

export default Chat
