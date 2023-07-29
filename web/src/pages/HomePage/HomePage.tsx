import {MetaTags} from '@redwoodjs/web'
import {LandingFooter} from "src/pages/HomePage/LandingFooter";
import {FAQ} from "src/pages/HomePage/FAQ";
import {LandingDemo} from "src/pages/HomePage/LandingDemo";
import {LandingHero} from "src/pages/HomePage/LandingHero";
import {LandingBlurColor} from "src/pages/HomePage/LandingBlurColor";
import {PricingV2} from "src/components/Pricing/PricingV2";

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page"/>
      <div className={'bg-base-300 z-0 relative '}>
        <LandingBlurColor/>
        {/*HERO SECTION*/}
        <LandingHero/>
        {/*VIDEO DEMO*/}
        <LandingDemo/>
        {/*PRICING*/}
        <PricingV2/>
        {/*FAQ*/}
        <FAQ/>
        {/*FOOTER*/}
        <LandingFooter/>
      </div>
    </>
  )
}

export default HomePage
