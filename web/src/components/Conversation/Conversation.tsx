import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export type ConversationEntry = {
  message: string;
  speaker: "bot" | "user";
  date: Date;
  id?: string;
};
interface ConversationProps {
  conversation: ConversationEntry[];
}
const Conversation = ({conversation}:ConversationProps) => {
  return (
    <div className="h-screen overflow-y-auto pb-60 mb-30 bg-base-200">
      <div className={"flex flex-row  justify-center items-center  "}>
        <div className={"flex flex-col space-y-4 mt-12 justify-center  "}>
          {conversation.map((entry, index) => {
            return (
              <div className={entry.speaker === "user" ? "py-4 bg-base-200 " : " py-8 pb-12 bg-base-300 "}>
                <div className={'mx-96 space-y-4'}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, rehypeKatex]}
                  >
                    {entry.message}
                  </ReactMarkdown>
                </div>

              </div>

            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Conversation
