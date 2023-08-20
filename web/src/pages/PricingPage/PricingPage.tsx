import {Link, routes} from '@redwoodjs/router'
import {MetaTags} from '@redwoodjs/web'
import Pricing from "src/components/Pricing/Pricing";
import {PricingV2} from "src/components/Pricing/PricingV2";
import {FAQBlock} from "src/pages/HomePage/FAQ";

const PricingPage = () => {
  return (
    <>
      <MetaTags title="Pricing" description="Pricing page"/>
      <div className={'h-screen w-full'}>
          <PricingV2/>
        <div className="grid grid-cols-1 md:grid-cold-2 lg:grid-cols-2 gap-4 place-items-center px-60">
          <FAQBlock
            title={'How do credits work?'}
            answer={'Each question/response pair costs approximately 1 credit.' +
              ' This can vary slightly depending on the length of the question and response but is usually accurate. ' +
              ' You can see how many credits you have left on your profile dashbord.'}
          />
          <FAQBlock
            title={'When are my credits renewed'}
            answer={'your credits are renewed every month on the date you signed up. ' +
              'For example, if you signed up on the 15th of the month, your credits will be renewed on the 15th of each month.' +
              ' you can see your next renewal date on your profile dashboard.'}
          />
          <FAQBlock title={'If you have any other questions, please reach out on twitter'} answer={' @interviewaiapp'}/>
        </div>
      </div>
    </>
  )
}

export default PricingPage
