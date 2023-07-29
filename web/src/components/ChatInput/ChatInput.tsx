import React, {useRef} from "react";

interface ChatInputProps {
  onSubmit: () => Promise<void>
  text: string
  setText: (text: string) => void
  disabled?: boolean
}
const ChatInput = ({text,setText,onSubmit, disabled}:ChatInputProps) => {

  const textareaRef = useRef<HTMLFormElement>(null);
  const textareaElement = textareaRef.current;

  const commentEnterSubmit = (e) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      const data = {content: e.target.value};
      return onSubmit();
    }
  }

  return (
      <div className="flex flex-row justify-center  ">
        <form className={"items-center w-full mx-4 "} onSubmit={async (e) => {
          e.preventDefault()
          await onSubmit()

        }}>
          <input disabled={disabled} value={disabled ? '' : text} onChange={(event) => setText(event.target.value)} type="text" placeholder="Type here"
                 className=" h-20 pb-6 border rounded-xl px-6 bg-base-100 w-full focus:border-primary"/>
        </form>
      </div>
  )
}

export default ChatInput
