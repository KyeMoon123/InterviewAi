import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {Speaker} from "types/graphql";

export type ConversationEntry = {
  message: string;
  speaker: Speaker
  date: Date;
  id?: string;
};
interface ConversationProps {
  conversation: ConversationEntry[];
}
const Conversation = ({conversation}:ConversationProps) => {
  return (
    <div className="overflow-auto pb-60 mb-30">
      <div className={"flex flex-row  justify-center items-center  "}>
        <div className={"flex flex-col space-y-2 mt-6 justify-center w-full  "}>
          {conversation.map((entry, index) => {
            return (
              <div className={entry.speaker === "user" ? "py-4 bg-base-100 " : " py-4  bg-base-300 "}>
                <div className={' space-y-4'}>
                  <div className={'mx-10 md:mx-20 lg:mx-40 xl:mx-60'}>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, rehypeKatex]}
                    >
                      {entry.message}
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
