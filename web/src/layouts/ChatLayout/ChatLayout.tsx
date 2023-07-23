import {Sidebar} from "src/layouts/ChatLayout/SideBar";
import {ModelProvider} from "src/context/ModelProvider";
import {ConversationProvider} from "src/context/ConversationProvider";
import {useState} from "react";

type ChatLayoutProps = {
  children?: React.ReactNode
}

const ChatLayout = ({children}: ChatLayoutProps) => {
  const [showModels, setShowModels] = useState(true);

  return (
    <div className="flex-1 flex max-h-screen">
      <Sidebar showModels={showModels} setShowModels={setShowModels}/>
      <ModelProvider>
        <ConversationProvider>
          {children}
        </ConversationProvider>
      </ModelProvider>
    </div>
  )
}

export default ChatLayout



