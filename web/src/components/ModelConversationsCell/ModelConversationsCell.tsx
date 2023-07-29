import type {Conversation, ModelConversationsQuery} from 'types/graphql'
import type {CellSuccessProps, CellFailureProps} from '@redwoodjs/web'
import {ConversationContext} from "src/context/ConversationProvider";
import {useContext, useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {TrashIcon} from "@heroicons/react/24/outline";
import {ConfirmationModal} from "src/components/ConfirmationModal";

export const QUERY = gql`
  query ModelConversationsQuery($modelId: String!) {
    modelConversations(modelId: $modelId) {
      id
      name
    }
  }
`
const DELETE_CONVERSATION = gql`
  mutation DeleteConversationMutation($id: String!) {
    deleteConversation(id: $id) {
      id
    }
  }
`


export const Loading = () => {
  return (
    <div className={'p-3'}>
      <Skeleton className={'opacity-5'} height={40} count={5}/>
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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [modelIdSelectedForDeletion, setModelIdSelectedForDeletion] = useState(null)

  useEffect(() => {
    if (!conversation) {
      setConversation(modelConversations[0] as Conversation)
    }
  }, [])

  const handleSelectConversation = (conversation) => {
    setConversation(conversation)
  }

  const [deleteConversation, {
    loading: deleteLoading,
    error: deleteError,
    data: deleteData
  }] = useMutation(DELETE_CONVERSATION, {
    onCompleted: (data) => {
      toast.success('Conversation deleted')
      setConversation(null)
    },
    refetchQueries: ['ModelConversationsQuery', 'ConversationEntriesQuery'],
    awaitRefetchQueries: true
  })

  return (
    <>
      <ConfirmationModal
        title={"Are you sure?"}
        description={"This will delete the conversation and all of its entries."}
        setOpen={setShowConfirmationModal}
        open={showConfirmationModal}
        onConfirm={async () => {
          await deleteConversation({variables: {id: modelIdSelectedForDeletion}})
          setShowConfirmationModal(false)
          setModelIdSelectedForDeletion(null)
        }}
      />
      <ul className={'space-y-2'}>
        {modelConversations.map((m) => {
            return (
              <li key={m.id} className="px-2 space-y-2">
                <span
                  onClick={() => handleSelectConversation(m)}
                  className={`p-3 rounded-lg w-full flex shadow-xl  cursor-pointer ${conversation && m.id === conversation.id ? 'bg-primary text-primary-content' : 'bg-base-100'}`}
                >
                  <div className={'flex justify-between w-full'}>
                    <h2 className="capitalize text-sm">{(m.name)}</h2>
                    <button onClick={() => {
                      setModelIdSelectedForDeletion(m.id)
                      setShowConfirmationModal(true)
                    }} className={'btn btn-xs btn-circle btn-ghost'}
                    >
                      <TrashIcon className={'font-semibold w-4'}/>
                    </button>
                  </div>
                </span>
              </li>
            )
          }
        )}
      </ul>
    </>
  )
}
