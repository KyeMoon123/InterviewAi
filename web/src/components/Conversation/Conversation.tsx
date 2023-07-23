import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {ConversationEntry, Speaker} from "types/graphql";

interface ConversationProps {
  conversation: Partial<ConversationEntry>[];
}
const Conversation = ({conversation}:ConversationProps) => {
  return (
    <div className="overflow-auto  ">
      <div className={"flex flex-row  justify-center items-center  "}>
        <div className={"flex flex-col space-y-2 mt-6 justify-center w-full  "}>
          {conversation.map((entry, index) => {
            return (
              <div className={entry.speaker === "user" ? "py-4 bg-base-100 " : " py-4  bg-base-300 "}>
                <div className={' space-y-4'}>
                  <div className={'mx-4 md:mx-10 lg:mx-20 xl:mx-30'}>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, rehypeKatex]}
                    >
                      {entry.entry}
                    </ReactMarkdown>
                  </div>
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
