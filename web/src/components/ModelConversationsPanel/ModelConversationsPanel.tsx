import ModelConversationsCell from "src/components/ModelConversationsCell/"
import {ModelContext} from "src/context/ModelProvider";
import {useContext, useState} from "react";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import {ConversationContext} from "src/context/ConversationProvider";
import {PlusIcon} from "@heroicons/react/24/solid";
import {useAuth} from "src/auth";

const NEW_CONVERSATION = gql`
  mutation NewConversationMutation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
    }
  }
`

const ModelConversationsPanel = () => {
  const {model} = useContext(ModelContext)
  const {setConversation} = useContext(ConversationContext)
  const {currentUser} = useAuth()
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')


  const [newConversation, {loading, error, data}] = useMutation(NEW_CONVERSATION, {
    onCompleted: (data) => {
      toast.success('Conversation created, go ahead and start chatting!')
      setConversation(data.createConversation)
    },
    refetchQueries: ['ModelConversationsQuery'],
    awaitRefetchQueries: true
  })



  const handleCreateConversation = async () => {
    if (name === '') {
      toast.error('Please enter a name')
      return
    } else {
      await newConversation({
        variables: {input: {modelId: model.id, userId: currentUser.sub, name: name}},
      })
      setShow(false)
      setName('')
    }
  }

  return (
    <div>
      <div className="flex flex-col h-screen bg-base-300 w-72 pt-6 border-l border-base-100">
        <div className={'flex flex-col space-x-4 text-lg px-4'}>
          <h2 className={'flex  ml-4 font-semibold'}>Conversations </h2>
          <div className={'flex space-x-4 align-middle'}>
            <p className={'text-sm text-gray-500 pt-0.5'}>Start a new conversation</p>
            <button onClick={() => setShow(!show)} className={'btn btn-xs btn-primary'}>
              <PlusIcon className={'w-4'}/>
            </button>
          </div>

        </div>
        {show && <ConversationNameInput onSubmit={handleCreateConversation} setName={setName}/>}
        <div className="divider"/>
        {
          model && <ModelConversationsCell modelId={model.id}/>
        }
      </div>
    </div>
  )
}

export default ModelConversationsPanel

export interface ConversationNameInputProps {
  onSubmit: () => void
  setName: (name: string) => void
  name?: string
}

export const ConversationNameInput = ({onSubmit, setName, name}: ConversationNameInputProps) => {
  return (
    <div className={'flex space-x-4 place-content-center pt-3 '}>
      <div className="flex  space-x-2">

        <input value={name} type="text" placeholder="Enter conversation title" className="input input-sm input-bordered"
               onChange={(e) => setName(e.target.value)}/>

        <button onClick={() => onSubmit()} className="btn btn-sm btn-primary  normal-case">Start</button>
      </div>
    </div>
  )
}
