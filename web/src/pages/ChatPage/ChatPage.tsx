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
      <div className={'w-full flex h-screen'}>
        <div className="sidebar-1">
          <ModelsPanel/>
        </div>
        <div className="flex-1 flex-col h-full">
          <Chat/>
        </div>
        <div className="sidebar-2 ">
          <ModelConversationsPanel/>
        </div>
      </div>
    </>
  )
}

export default ChatPage
