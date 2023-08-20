import {useLazyQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {useAuth} from "src/auth";
import {stripeCheckout} from "src/Utils";
import {toast} from "@redwoodjs/web/toast";
import {navigate, routes} from "@redwoodjs/router";
import {LoadingModal} from "src/components/LoadingModal";

const IS_USER_SUBSCRIBED = gql`
  query UserSubscription($userId: String!) {
    user(id: $userId) {
      id
      subscriptionName
      subscriptionId
    }
  }
`


export const PricingV2 = () => {
  const [searchUser, {data, loading, error}] = useLazyQuery(IS_USER_SUBSCRIBED)
  const [loadingModal, setLoadingModal] = useState(false)
  const {getToken, isAuthenticated, currentUser} = useAuth()
  const [currentPlanType, setCurrentPlanType] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(undefined)

  const checkout = async (planType) => {
    setLoadingModal(true)
    const response = await stripeCheckout({token: await getToken(), planType})
    const {sessionUrl} = await response.json()

    if (sessionUrl) {
      toast.dismiss()
      window.open(sessionUrl)
      setLoadingModal(false)
    } else if (!sessionUrl && response.status === 200) {
      toast.dismiss()
      toast.success(`You have successfully subscribed to ${planType} plan`)
      setLoadingModal(false)
    } else {
      toast.dismiss()
      toast.error('Something went wrong')
      setLoadingModal(false)
    }
  }

  const onConfirm = async (planType) => {
    toast.loading('Processing subscription')
    await checkout(planType)
  }

  useEffect(() => {
    if (currentUser) {
      searchUser({variables: {userId: currentUser.sub}})
    }
  }, [currentUser])


  const handleSubscribeClick = async ({planType}: { planType: string }) => {
    if (!isAuthenticated) {
      toast('Log in or sign up to subscribe')
      navigate(routes.login())
    } else {
      if (data.user.subscriptionId) {
        setCurrentPlanType(data.user.subscriptionName)
        setSelectedPlan(planType)
        // @ts-ignore
        window.confirmation_dialog.showModal()
      } else {
        await checkout(planType)
      }
    }
  }

  return (
    <section className=" body-font ">
      <LoadingModal loading={loadingModal}/>

      <dialog id="confirmation_dialog" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Double checking!</h3>
          <p className="py-4">{`Your current plan is`}</p>
          <p className="text-primary text-2xl font-semibold">{currentPlanType}</p>
          <p className="py-4">{`Are you sure you want to change to  `}</p>
          <p className="text-primary text-2xl font-semibold">{selectedPlan}</p>
          <p className="py-4 pt-12 text-primary">{`Clicking confirm will change your plan and update your billing. You wont be billed at the new plan rate until your current plan period ends`}</p>
          <div className="modal-action">
            <button className="btn">Close</button>
            <button onClick={() => onConfirm(selectedPlan)} className="btn btn-primary">Confirm</button>
          </div>
        </form>
      </dialog>


      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 ">Pricing</h1>
        </div>
        <div className="lg:w-2/3 w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
            <tr>
              <th
                className="px-4 py-3 title-font tracking-wider font-medium bg-base-100  text-sm rounded-tl rounded-bl">Plan
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium bg-base-100 text-sm ">Credits
                <span className="text-xs ml-1 font-normal ">/mo</span>
              </th>
              <th
                className="px-4 py-3 title-font tracking-wider font-medium  bg-base-100 text-sm ">Language models
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium bg-base-100  text-sm ">Price
              </th>
              <th
                className="w-10 title-font tracking-wider font-medium  text-sm bg-base-100  rounded-tr rounded-br pr-2">Select</th>
            </tr>
            </thead>
            <tbody >
            <tr>
              <td className="px-4 py-3">Hobby</td>
              <td className="px-4 py-3">950</td>
              <td className="px-4 py-3">All</td>
              <td className="px-4 py-3 text-lg ">$19</td>
              <td className="w-10 text-center">
                <input onClick={() => {
                  setSelectedPlan('Hobby')
                }} name="plan" type="radio"/>
              </td>
            </tr>
            <tr>
              <td className="  border-t-2 border-gray-200 px-4 py-3">Growth</td>
              <td className="border-t-2 border-gray-200 px-4 py-3">2,850</td>
              <td className="border-t-2 border-gray-200 px-4 py-3">All</td>
              <td className="border-t-2 border-gray-200 px-4 py-3 text-lg ">$49</td>
              <td className="border-t-2 border-gray-200 w-10 text-center">
                <input onClick={() => {
                  setSelectedPlan('Growth')
                }} name="plan" type="radio"/>
              </td>
            </tr>
            <tr>
              <td className="border-t-2 border-gray-200 px-4 py-3">Standard</td>
              <td className="border-t-2 border-gray-200 px-4 py-3">10,000</td>
              <td className="border-t-2 border-gray-200 px-4 py-3">All</td>
              <td className="border-t-2 border-gray-200 px-4 py-3 text-lg ">$99</td>
              <td className="border-t-2 border-gray-200 w-10 text-center">
                <input onClick={() => {
                  setSelectedPlan('Standard')
                }} name="plan" type="radio"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="flex pl-4 mt-4 lg:w-2/3 w-full mx-auto">
          <button
            onClick={() => handleSubscribeClick({planType: selectedPlan})}
            className="flex ml-auto btn btn-primary btn-sm normal-case leading-3">
            {selectedPlan ? `Subscribe to ${selectedPlan}` : 'Select a plan'}
          </button>
        </div>
      </div>
    </section>
  )
}

