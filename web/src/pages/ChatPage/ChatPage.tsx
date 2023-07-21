import {MetaTags} from '@redwoodjs/web'
import Chat from "src/components/Chat/Chat";
import {useAuth} from "src/auth";
import ModelsPanel from "src/components/ModelsPanel/ModelsPanel";
import ModelConversationsPanel from "src/components/ModelConversationsPanel/ModelConversationsPanel";


const ChatPage = () => {
  const {currentUser} = useAuth()
  return (
    <>
      <MetaTags title="Chat" description="Chat page"/>
      <div className="sidebar-1 h-screen">
        <ModelsPanel/>
      </div>
      <div className="content flex-1 overflow-hidden ">
        <Chat/>
      </div>
      <div className="sidebar-2  h-screen ">
        <ModelConversationsPanel/>
      </div>
    </>
  )
}

export default ChatPage
