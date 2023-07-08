import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import {useState} from "react";

const AdminPage = () => {
  const [trustPilotLink, setTrustPilotLink] = useState('')

  const scrapeTrustPilot = async () => {
    const response  = await fetch("http://localhost:8910/.redwood/functions/trustpilotReviews-background",{
      method: 'POST',
      body: JSON.stringify({
        url: trustPilotLink
      })
    })
    console.log(response)
  }


  return (
    <>
      <MetaTags title="Admin" description="Admin page" />
      <div className={'bg-base-300 h-screen space-y-8'}>
        <h1 className={'text-xl'}>Admin: Dont break shit pls</h1>
        <div className=" bg-base-200 py-12 px-20">
          <div className={'flex flex-col space-y-4'}>
            Scrape trust pilot
            <div className={'space-x-12'}>
              <input onChange={(event)=>{setTrustPilotLink(event.target.value)}} type="text" placeholder="Type Link Here" className="input input-bordered w-full max-w-md" />
              <button className={'btn btn-primary'} onClick={()=>scrapeTrustPilot()}>
                Submit
              </button>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}

export default AdminPage
