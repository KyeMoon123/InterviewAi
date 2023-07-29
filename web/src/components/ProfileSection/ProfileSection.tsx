import {navigate, routes} from "@redwoodjs/router";
import {User} from "types/graphql";
import {useMutation} from "@redwoodjs/web";
import {toast} from "@redwoodjs/web/toast";
import dayjs from "dayjs";
import {ModelRequestSection} from "src/components/ProfileSection/ModelRequestSection";

interface ProfileSectionProps {
  user: Partial<User>
}

const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription {
    cancelSubscription {
      id
      subscriptionName
      subscriptionId
    }
  }
`

const ProfileSection = ({user}: ProfileSectionProps) => {

  const [cancelSubscription, {loading, error}] = useMutation(CANCEL_SUBSCRIPTION, {
    onCompleted: () => {
      toast.dismiss()
      toast.success('Subscription cancelled')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    refetchQueries: ['FindUserProfileQuery'],
    awaitRefetchQueries: true
  })

  const onConfirmCancelSubscription = async () => {
    try {
      toast.loading('Cancelling subscription...')
      await cancelSubscription()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onClickCancelSubscription = async () => {
    {
      (!user.subscriptionId || user.subscriptionCancelAtPeriodEnd )  ?
        toast.error('You do not have an active subscription')
        :     // @ts-ignore
        window.cancel_confirmation.showModal()
    }
  }

  return (
    <section className="text-base-content overflow-hidden">

      {/* Confirmation dialog */}
      <dialog id="cancel_confirmation" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Are you sure 😢</h3>
          <p className="py-4">Clicking cancel will cancel your plan and stop your billing. You will keep your current
            credits</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn ">Close</button>
            <button onClick={() => onConfirmCancelSubscription()} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </dialog>


      <div className="px-5 py-12 pt-20">
        <div className="-my-8 divide-y-2 divide-accent-content/10 ">
          <div className="py-8 flex flex-col ">
            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <span className="text-lg font-medium text-base-content title-font mb-2">Current Subscription</span>
            </div>
            <div className="md:flex-grow pt-2">
              <h2
                className="text-4xl font-medium text-primary title-font mb-2">{user.subscriptionName ? user.subscriptionName : "Free"}</h2>
            </div>
            <div className={'grid grid-cols-4  gap-4 space-y-4 '}>
              <div className={'flex flex-col'}>
                <span className={'text-sm font-semibold py-2'}></span>
                <span className={'text-base-content'}>
                  <button onClick={() => {
                    navigate(routes.pricing({ref: 'upgrade'}))
                  }} className={'btn btn-sm btn-primary mt-2 '}>
                    Upgrade
                  </button>
                </span>
              </div>
              <div className={'flex flex-col'}>
                <span className={'text-base-content'}>
                  <button onClick={() => onClickCancelSubscription()} className={'btn btn-sm btn-outline mt-2 '}>
                    Cancel
                  </button>
                </span>
              </div>
              <div className={'flex flex-col'}>
                <span className={'font-semibold'}>Next Billing Date</span>
                {user.subscriptionCancelAtPeriodEnd
                  ? (
                    <>
                      <span className={'text-sm text-base-content'}>You have cancelled your subscription</span>
                      <span className={'text-sm text-base-content'}>{`It will end on ${dayjs(user.subscriptionCurrentPeriodEnd).format('DD MMMM YYYY')} and will not be renewed`} </span>
                    </>
                  )
                  : (<span>{dayjs(user.subscriptionCurrentPeriodEnd).format('DD MMMM YYYY')}</span>)

                }
              </div>
            </div>
          </div>
          <div className="py-8 flex flex-col">
            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <span className="text-2xl font-medium text-base-content title-font mb-2">Remaining Credits</span>
            </div>
            <div className="md:flex-grow pt-2">
              <h2 className="text-4xl font-medium text-base-content title-font mb-2">{user.credits}</h2>
            </div>
          </div>

          <ModelRequestSection/>
        </div>
      </div>
    </section>
  )
}

export default ProfileSection
