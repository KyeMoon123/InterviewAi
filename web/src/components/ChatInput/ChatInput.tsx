import React from "react";

interface ChatInputProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  text: string
  setText: (text: string) => void
}
const ChatInput = ({text,setText,onSubmit}:ChatInputProps) => {
  return (
    <div className="relative ">
      <div className="absolute  pt-12 inset-x-0 bottom-0 flex flex-row justify-center ">
        <form className={"flex flex-row justify-center items-center w-full max-w-4xl pb-12"} onSubmit={onSubmit}>
          <input value={text} onChange={(event) => setText(event.target.value)} type="text" placeholder="Type here"
                 className="input h-20 pb-6 border bg-base-100 w-full"/>
        </form>
      </div>
    </div>
  )
}

export default ChatInput
