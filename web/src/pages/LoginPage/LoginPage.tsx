import {MetaTags} from '@redwoodjs/web'
import {LoginForm} from "src/components/LoginForm";

const LoginPage = () => {
  return (
    <div className={''}>
      <MetaTags title="Login" description="Login page"/>

      {/*GRAPHICS */}
      <div className=" inset-x-0 top-0 absolute h-2/3 transform-gpu overflow-hidden  blur-3xl  sm:top-0">
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


      {/*Form*/}
      <div className="bg-base-300  h-screen flex flex-col place-content-center">
        <div className="text-center pb-6">
          <h1 className="text-4xl font-bold">Interviewr</h1>
          <p className="text-lg">Login or sign up to continue</p>
        </div>
        <div className="relative flex justify-center">
          <LoginForm/>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
