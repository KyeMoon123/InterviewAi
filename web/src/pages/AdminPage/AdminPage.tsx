import {MetaTags, useMutation} from '@redwoodjs/web'
import {useState} from "react";
import {toast} from "@redwoodjs/web/toast";

const AdminPage = () => {
  const [link, setLink] = useState('')
  const [modelName, setModelName] = useState<string | undefined>(undefined)
  const [source, setSource] = useState<string | undefined>(undefined)

  const TRIGGER_SCRAPE = gql`
    mutation TriggerScrape($url: String!, $modelName: String!, $source: String!) {
      triggerScrape(url: $url, modelName: $modelName source: $source) {
        url
        modelName
        message
      }
    }
  `

  const [triggerScrape, { data, loading, error }] = useMutation(TRIGGER_SCRAPE, {
    variables: {
      url: link,
      modelName: modelName,
      source: source
    },
    onCompleted: (data) => {
      toast.success(data.triggerScrape.message)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })


  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      <div className={'bg-base-300 h-screen space-y-8'}>
        <h1 className={'text-xl'}>Admin: Dont break shit pls</h1>
        <div className=" bg-base-200 py-12 px-20">
          <div className={'flex flex-col space-y-4'}>
            Scrape trust pilot
            <form>
              <div className={'space-x-12'}>
                <input onChange={(event)=>{setLink(event.target.value)}} type="text" placeholder="Type Link Here" className="input input-bordered w-full max-w-md" />
                <input onChange={(event) => {setModelName(event.target.value)}} type={'text'} placeholder={"Model name"} className="input input-bordered w-1/2 max-w-md"/>
                <button className={'btn btn-primary'} onClick={async (e) => {
                  e.preventDefault()
                  setSource("TRUST_PILOT")
                  await triggerScrape()
                }}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}

export default AdminPage
