import {useMutation} from "@redwoodjs/web";
import {useState} from "react";
import {useAuth} from "src/auth";
import {toast} from "@redwoodjs/web/toast";

const REQUEST_MODEL = gql`
  mutation RequestModel($input: CreateModelRequestInput!) {
    createModelRequest(input: $input) {
      id
    }
  }
`

export const ModelRequestSection = () => {
  const [businessName, setBusinessName] = useState<string>("")
  const [businessSiteUrl, setBusinessSiteUrl] = useState<string>("")
  const {currentUser} = useAuth()

  const [requestModel, {loading, error}] = useMutation(REQUEST_MODEL, {
    onCompleted: () => {}
  });

  const handleRequestModel = async () => {
    if (!businessName || businessName.length === 0) {
      toast.error('Please enter a business name')
      return
    } else {
      try {
        toast.loading(`Requesting NLP model of ${businessName}'s customers...`)
        await requestModel({
          variables: {
            input: {
              businessName: businessName,
              businessWebsite:businessSiteUrl,
              userId: currentUser.sub
            }
          }
        })
        toast.dismiss()
        toast.success('Success.. we will add this to our database ASAP')
        setBusinessSiteUrl("")
        setBusinessName("")
      } catch (e) {
        toast.dismiss()
        toast.error(e.message)
      }
    }
  }


  return (
    <div className="py-8 flex flex-col">
      <div className=" flex-shrink-0 flex flex-col">
        <span className="text-2xl font-medium text-base-content title-font mb-2">Request a business or a product</span>
        <span className="font-medium  text-base-content title-font mb-2">Let us know what business or products customers you would like to interview, and we will do our best to add it to our database ASAP</span>
      </div>
      <div className=" flex pt-2 space-x-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Name of the business *</span>
          </label>
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} type="text" placeholder="Eg: Apple" className="input input-bordered input-primary w-full max-w-xs" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Url of the website of the business</span>
          </label>
          <input  value={businessSiteUrl} onChange={(e)=>setBusinessSiteUrl(e.target.value)} type="text" placeholder="Eg: https://www.apple.com/" className="input input-bordered input-primary w-full max-w-xs" />
        </div>
      </div>
      <div className=" flex pt-2 space-x-4">
        <button onClick={handleRequestModel} className={'btn btn-sm btn-primary'}>Request</button>
      </div>
    </div>
  )
}
