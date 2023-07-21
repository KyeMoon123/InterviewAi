import {Link, routes} from '@redwoodjs/router'
import {MetaTags} from '@redwoodjs/web'
import Pricing from "src/components/Pricing/Pricing";

const PricingPage = () => {
  return (
    <>
      <MetaTags title="Pricing" description="Pricing page"/>
      <div className={'h-screen'}>
        <div className={'flex flex-content place-content-center items-center'}>
          <Pricing/>
        </div>
      </div>
    </>
  )
}

export default PricingPage
