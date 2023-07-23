import {navigate, routes, useParams} from "@redwoodjs/router";
import {useEffect, useState} from "react";
import {useAuth} from "src/auth";
import {toast} from "@redwoodjs/web/toast";
import {useLazyQuery} from "@apollo/client";

interface PricingCardProps {
  planName: string,
  pricePerMonth: number
  annual?: boolean,
  pricePerYear: number,
  features: string[]
  buttonText?: string
  cardFooterText?: string,
  buttonOnClick?: ({planType: string}) => void,
  color?: boolean
  flagged?: boolean
  flagText?: string
}

const pricingCards: PricingCardProps[] = [
  {
    planName: 'Hobby',
    pricePerMonth: 19,
    features: ['test'],
    pricePerYear: 190,
  },
  {
    planName: 'Growth',
    pricePerMonth: 49,
    features: ['test'],
    pricePerYear: 190,
    color: true,
    flagged: true,
    flagText: 'Most Popular'
  },
  {
    planName: 'Standard',
    pricePerMonth: 99,
    features: ['test'],
    pricePerYear: 190,
  },
  {
    planName: 'Unlimited',
    pricePerMonth: 399,
    features: ['test'],
    pricePerYear: 190,
  },
]


const IS_USER_SUBSCRIBED = gql`
  query UserSubscription($userId: String!) {
    user(id: $userId) {
      id
      subscriptionName
      subscriptionId
    }
  }
`

const Pricing = () => {
  const [showAnnual, setShowAnnual] = useState(false)
  const params = useParams()
  const {getToken, isAuthenticated, currentUser} = useAuth()
  const [currentPlanType, setCurrentPlanType] = useState('')
  const [newpPlanType, setNewPlanType] = useState('')
  const [searchUser, {data, loading, error}] = useLazyQuery(IS_USER_SUBSCRIBED)

  const checkout = async (planType) => {

    const response = await fetch(`http://localhost:8910/api/checkout?plan=${planType}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${await getToken()}`,
        "auth-provider": "supabase"
      },
    })
    const {sessionUrl} = await response.json()

    if (sessionUrl) {
      toast.dismiss()
      window.open(sessionUrl)
    } else if (!sessionUrl && response.status === 200) {
      toast.dismiss()
      toast.success(`You have successfully subscribed to ${planType} plan`)
    } else {
      toast.dismiss()
      toast.error('Something went wrong')
    }
  }

  const onConfirm = async (planType) => {
    toast.loading('Processing subscription')
    await checkout(planType)
  }

  useEffect(() => {
    if (currentUser){
      searchUser({variables: {userId: currentUser.sub}})
    }
  },[currentUser])


  const handleSubscribeClick = async ({planType}: { planType: string }) => {
    if (!isAuthenticated) {
      toast('Log in or sign up to subscribe')
      navigate(routes.login())
    } else {
      if (data.user.subscriptionId) {
        console.log(data.user.subscriptionName)
        setCurrentPlanType(data.user.subscriptionName)
        setNewPlanType(planType)
        // @ts-ignore
        window.confirmation_dialog.showModal()
      } else {
        await checkout(planType)
      }
    }
  }


  return (
    <section className="text-base-content w-full overflow-hidden z-20 relative">

      {/* Confirmation dialog */}
      <dialog id="confirmation_dialog" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Double checking!</h3>
          <p className="py-4">{`Your current plan is`}</p>
          <p className="text-primary text-2xl font-semibold">{currentPlanType}</p>
          <p className="py-4">{`Are you sure you want to change to  `}</p>
          <p className="text-primary text-2xl font-semibold">{newpPlanType}</p>
          <p className="py-4 pt-12 text-sm">{`Clicking confirm will change your plan and update your billing`}</p>
          <div className="modal-action">
            <button className="btn">Close</button>
            <button onClick={() => onConfirm(newpPlanType)} className="btn btn-primary">Confirm</button>
          </div>
        </form>
      </dialog>


      <div className="container py-24 ">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 ">Pricing</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base ">Whatever cardigan tote bag tumblr
            hexagon brooklyn asymmetrical.</p>
          {/*<div className="flex mx-auto border-2 border-indigo-500 rounded overflow-hidden mt-6">*/}
          {/*  <button className="py-1 px-4 bg-indigo-500 text-white focus:outline-none">Monthly</button>*/}
          {/*  <button className="py-1 px-4 focus:outline-none">Annually</button>*/}
          {/*</div>*/}
        </div>
        <div className=" ">
          <div className={'flex flex-col md:flex-row justify-evenly gap-2 '}>
            {pricingCards.map((props) => (
              <PricingCard
                {...props}
                annual={showAnnual}
                buttonOnClick={handleSubscribeClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing


export const PricingCard = ({
                              planName,
                              pricePerMonth,
                              annual,
                              pricePerYear,
                              features,
                              cardFooterText,
                              color,
                              flagged,
                              buttonOnClick,
                            }: PricingCardProps) => {
  return (
    <div className="p-4  w-full">
      <div
        className={`h-full p-6 rounded-lg border-2 flex flex-col relative overflow-hidden ${color ? ('border-primary') : ('border-base-content')}`}>
        {flagged && <span
          className="bg-indigo-500 text-primary-content px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>}
        <h2 className="text-sm tracking-widest uppercase mb-1 font-medium">{planName}</h2>
        {annual ? (
          <h1
            className="text-5xl  leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
            <span>{`$${pricePerYear}`}</span>
            <span className="text-lg ml-1 font-normal ">/year</span>
          </h1>
        ) : (
          <h1
            className="text-5xl  leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
            <span>{`$${pricePerMonth}`}</span>
            <span className="text-lg ml-1 font-normal ">/mo</span>
          </h1>
        )}

        <div className={'h-80'}>
          {features.map((feature) => {
            return (
              <p className="flex items-center  mb-2">
            <span
              className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                   className="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>{feature}
              </p>
            )
          })}
        </div>
        <button
          onClick={() => {
            buttonOnClick({planType: planName})
          }}
          className={`btn ${color ? "btn-primary text-primary-content " : "btn-outline "}`}>Subscribe
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
               stroke-width="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
        <p className="text-xs  mt-3">{cardFooterText}</p>
      </div>
    </div>
  )
}
