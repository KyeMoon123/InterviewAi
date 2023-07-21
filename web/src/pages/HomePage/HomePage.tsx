import {MetaTags} from '@redwoodjs/web'
import {useAuth} from "src/auth";
import Pricing from "src/components/Pricing/Pricing";


const HomePage = () => {
  const {currentUser} = useAuth()
  return (
    <>
      <MetaTags title="Home" description="Home page"/>

      <div className={'bg-base-300 z-0 relative '}>

        <div className=" inset-x-0 top-0 z-10 absolute transform-gpu overflow-hidden  blur-3xl opacity-50 sm:top-0">
          <svg
            className="relative  max-w-none -translate-x-1/3 rotate-[30deg] sm:left-[calc(50%-30rem)] "
            viewBox="0 0 1155 678" xmlns="http://www.w3.org/2000/svg">
            <path fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)" fill-opacity=".3"
                  d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"></path>
            <defs>
              <linearGradient id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533" x1="1155.49" x2="-78.208" y1=".177" y2="474.645"
                              gradientUnits="userSpaceOnUse">
                <stop stopColor="#9089FC"></stop>
                <stop offset="1" stopColor="#FF80B5"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/*HERO SECTION*/}
        <section className="z-20 relative">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div
              className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="sm:text-7xl font-bold text-3xl mb-4 text-base-content  ">Interview your competitors
                customers</h1>
              <p className="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air
                plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken
                authentic tumeric truffaut hexagon try-hard chambray.</p>
              <div className="flex justify-center">
                <button
                  className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button
                </button>
                <button
                  className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button
                </button>
              </div>
            </div>
            <div className="lg:max-w-xl lg:w-full md:w-1/2 w-5/6">
              <img className="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/1000x800"/>
            </div>
          </div>
        </section>

        {/*VIDEO DEMO*/}

        <section className="z-20 relative">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="font-bold text-3xl mb-4 text-white/80 ">Demo</h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed">Demo description</p>
            </div>
            <div className="flex justify-center">
              <div className="lg:max-w-xl lg:w-full md:w-1/2 w-5/6">
                <img className="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/1000x800"/>
              </div>
            </div>
          </div>
        </section>


      <Pricing/>


        {/*FOOTER*/}
        <footer className="text-gray-600 body-font">
          <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round"
                   stroke-linejoin="round" stroke-width="2"
                   className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-3 text-xl">Tailblocks</span>
            </a>
            <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">©
              2020 Tailblocks —
              <a href="https://twitter.com/knyttneve" className="text-gray-600 ml-1" rel="noopener noreferrer"
                 target="_blank">@knyttneve</a>
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                 <a className="text-gray-500">
                   <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24">
                     <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                   </svg>
                 </a>
                 <a className="ml-3 text-gray-500">
                   <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24">
                     <path
                       d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                   </svg>
                 </a>
                  <a className="ml-3 text-gray-500">
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                         stroke-width="2"
                         className="w-5 h-5" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                    </svg>
                  </a>
                  <a className="ml-3 text-gray-500">
                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                         stroke-width="0"
                         className="w-5 h-5" viewBox="0 0 24 24">
                      <path stroke="none"
                            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                      <circle cx="4" cy="4" r="2" stroke="none"></circle>
                    </svg>
                  </a>
            </span>
          </div>
        </footer>
      </div>

    </>
  )
}

export default HomePage
