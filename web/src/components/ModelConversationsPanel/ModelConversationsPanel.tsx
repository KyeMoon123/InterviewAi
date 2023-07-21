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
  const {conversation, setConversation} = useContext(ConversationContext)
  const {currentUser} = useAuth()
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')


  const [newConversation, {loading, error, data}] = useMutation(NEW_CONVERSATION, {
    onCompleted: (data) => {
      toast.success('Conversation created')
      setConversation(data.createConversation)
    },
    refetchQueries: ['ModelConversationsQuery'],
    awaitRefetchQueries: true
  })

  const handleCreateConversation = async () => {
    if(name === ''){
      toast.error('Please enter a name')
      return
    }else {
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
        <div className={'flex space-x-4 place-content-center '}>
          <h2 className={'flex justify-center  align-middle font-semibold'}>Conversations </h2>
          <button onClick={() => setShow(!show)} className={'btn btn-sm '}>
            <PlusIcon className={'w-6'}/>
          </button>
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
export const ConversationNameInput = ({onSubmit, setName, name}:ConversationNameInputProps) => {
  return (
    <div className={'flex space-x-4 place-content-center pt-3 '}>
      <div className="flex  space-x-2">
        <input value={name} type="text" placeholder="Conversation name" className="input input-sm input-bordered" onChange={(e)=>setName(e.target.value)}/>
        <button  onClick={()=>onSubmit()} className="btn btn-sm  normal-case">Start</button>
      </div>
    </div>
  )
}
