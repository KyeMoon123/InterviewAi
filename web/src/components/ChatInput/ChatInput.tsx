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
      <div className="absolute  pt-12 inset-x-0 bottom-0 flex flex-row justify-center ">
        <form className={"flex flex-row justify-center items-center w-full max-w-4xl pb-12"} onSubmit={async (e) => {
          e.preventDefault()
          await onSubmit()
        }}>
          <input disabled={disabled} value={disabled ? '' : text} onChange={(event) => setText(event.target.value)} type="text" placeholder="Type here"
                 className="input h-20 pb-6 border border-neutral bg-base-100 w-full border border-white/30"/>
        </form>
      </div>
  )
}

export default ChatInput
