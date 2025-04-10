import type {Model, ModelsQuery} from 'types/graphql'
import type {CellFailureProps, CellSuccessProps} from '@redwoodjs/web'
import {useContext, useEffect} from "react";
import {ModelContext} from "src/context/ModelProvider";
import {ConversationContext} from "src/context/ConversationProvider";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export const QUERY = gql`
  query ModelsQuery {
    models {
      id
      name
      imageUrl
      categories
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

export const Empty = () => <div>Empty</div>

export const Failure = ({error}: CellFailureProps) => (
  <div style={{color: 'red'}}>Error: {error?.message}</div>
)

export const Success = ({models}: CellSuccessProps<ModelsQuery>) => {

  const {model, setModel} = useContext(ModelContext)
  const {conversation, setConversation} = useContext(ConversationContext)

  useEffect(() => {
    if (!model) {
      setModel(models[0] as Model)
    }
  }, [])

  const handleSelectModel = (model) => {
    setModel(model)
    setConversation(null)
  }


  return (
    <ul className={'space-y-2  overflow-y-auto '}>
      {models.map((m) => {
          return (
            <li key={m.id} className="px-2 space-y-2 ">
              <button
                onClick={() => handleSelectModel(m)}
                className={`p-3 rounded-lg h-12 w-full flex space-x-4  align-middle items-center shadow-xl  cursor-pointer ${model && m.id === model.id ? 'bg-primary text-primary-content' : 'bg-base-100'}`}>
                {m.imageUrl && <img className=" w-8 max-h-8 " src={m.imageUrl} alt=""/>}
                <div className={'flex flex-col px-2 '}>
                  <h2 className="capitalize text-sm flex justify-start">{(m.name)}</h2>
                  <h4 className={'text-xs text-primary-content/70 '}>{
                   m.categories && m.categories.map((c) => {
                      return (
                        <>
                          <span key={c} className={'capitalize'}>{c} </span>
                          <span className={'text-primary-content/70'}>•</span>
                        </>
                      )
                    })
                  }</h4>
                </div>

              </button>

            </li>
          )
        }
      )}
    </ul>
  )
}
