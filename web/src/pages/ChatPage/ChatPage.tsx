import {MetaTags} from '@redwoodjs/web'
import Chat from "src/components/Chat/Chat";


const ChatPage = () => {

  return (
    <>
      <MetaTags title="Chat" description="Chat page"/>
      <Chat/>
    </>
  )
}

export default ChatPage
