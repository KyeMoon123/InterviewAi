import type {ConversationEntriesQuery} from 'types/graphql'
import type {CellSuccessProps, CellFailureProps} from '@redwoodjs/web'

import Skeleton from "react-loading-skeleton";
import {ConversationPanel} from "src/components/ConversationEntriesCell/ConversationPanel";

export const QUERY = gql`
  query ConversationEntriesQuery($conversationId: String!) {
    conversationEntries(conversationId: $conversationId) {
      id
      speaker
      entry
      createdAt
    }
  }
`

export const Loading = () => {
  return (
    <div className={'p-3'}>
      <Skeleton className={'opacity-5'} height={100} count={2}/>
    </div>
  )
}

export const Empty = () => {
  return (
    <>
      <ConversationPanel conversationEntries={[]}/>
    </>

  )
}

export const Failure = ({error}: CellFailureProps) => (
  <div style={{color: 'red'}}>Error: {error?.message}</div>
)

export const Success = ({
                          conversationEntries,
                        }: CellSuccessProps<ConversationEntriesQuery>) => {

  return (
      <ConversationPanel conversationEntries={conversationEntries}/>
  )
}
