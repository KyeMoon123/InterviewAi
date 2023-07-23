import type {Conversation, ModelConversationsQuery} from 'types/graphql'
import type {CellSuccessProps, CellFailureProps} from '@redwoodjs/web'
import {ConversationContext} from "src/context/ConversationProvider";
import {useContext, useEffect} from "react";
import Skeleton from "react-loading-skeleton";

export const QUERY = gql`
  query ModelConversationsQuery($modelId: String!) {
    modelConversations(modelId: $modelId) {
      id
      name
    }
  }
`

export const Loading = () => {
  return (
    <div className={'p-3'}>
      <Skeleton className={'opacity-5'}  height={40} count={5}/>
    </div>
  )
}

export const Empty = () => <div className={'px-6'}>Start a conversation...</div>

export const Failure = ({error}: CellFailureProps) => (
  <div style={{color: 'red'}}>Error: {error?.message}</div>
)

export const Success = ({
                          modelConversations,
                        }: CellSuccessProps<ModelConversationsQuery>) => {

  const {conversation, setConversation} = useContext(ConversationContext)

  useEffect(() => {
    if (!conversation) {
      setConversation(modelConversations[0] as Conversation)
    }
  }, [])

  const handleSelectConversation = (conversation) => {
    setConversation(conversation)
  }


  return (
    <ul className={'space-y-2'}>
      {modelConversations.map((m) => {
          return (
            <li key={m.id} className="px-2 space-y-2">
              <button
                onClick={() => handleSelectConversation(m)}
                className={`p-3 rounded-lg w-full flex shadow-xl  cursor-pointer ${conversation && m.id === conversation.id ? 'bg-primary text-primary-content' : 'bg-base-100'}`}>
                <h2 className="capitalize text-sm">{(m.name)}</h2>
              </button>
            </li>
          )
        }
      )}
    </ul>
  )
}
