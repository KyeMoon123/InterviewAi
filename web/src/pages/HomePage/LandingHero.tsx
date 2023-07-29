import Typewriter from "typewriter-effect";
import {navigate, routes} from "@redwoodjs/router";
import {useAuth} from "src/auth";

export const LandingHero = () => {
  const  {isAuthenticated} = useAuth()

  return (
    <section className="z-20 relative">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className=" md:px-20 lg:px-40">
          <div className={'flex flex-col items-center text-center'}>
            <h1 className="sm:text-8xl font-bold text-3xl mb-4 text-base-content  ">Interview </h1>
            <Typewriter
              options={{
                wrapperClassName: "sm:text-8xl font-bold text-3xl mb-4 text-base-content ",
                cursorClassName: "sm:text-8xl font-bold text-3xl mb-4 text-base-content ",
                strings: ['Your', "Your competitor's", "Anyone's"],
                autoStart: true,
                loop: true,
              }}
            />
            <h1 className="sm:text-8xl font-bold text-3xl mb-4 text-base-content">Customers </h1>
            {/*<p className="mb-2 leading-relaxed text-2xl">*/}
            {/*  Interview thousands of customers in a matter of minutes.*/}
            {/*</p>*/}
            <p className="mb-2 leading-relaxed text-3xl font-medium">
              Leveraging the power of AI, conduct customer interviews at scale with incredible ease.
            </p>
            <p className="mb-8 leading-relaxed text-2xl font-medium">
              Language models are trained on thousands of reviews specific to individual products and services.
              Interview-AI takes all of these reviews and provides you with chatbots you can talk to as though you
              were talking to a real customer of that product or service.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate(routes.chat())
                } else {
                  navigate(routes.login())
                }
              }}
              className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Get
              started now
            </button>
          </div>
        </div>
        {/*<div className="lg:max-w-xl lg:w-full md:w-1/2 w-5/6 rounded-full">*/}
        {/*  <img className="object-cover object-center rounded" alt="hero" src="https://sryturtzcqyklvfwmaux.supabase.co/storage/v1/object/sign/Images/vecteezy_finding-and-selecting-the-best-candidates-for-the-team_.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvdmVjdGVlenlfZmluZGluZy1hbmQtc2VsZWN0aW5nLXRoZS1iZXN0LWNhbmRpZGF0ZXMtZm9yLXRoZS10ZWFtXy5qcGciLCJpYXQiOjE2OTAzNzEyNjEsImV4cCI6MTY5Mjk2MzI2MX0.ZZtjbeysFxumha3cMIMduAfFOpnC3hWQp41ORrhhEi8&t=2023-07-26T11%3A34%3A21.319Z"/>*/}
        {/*</div>*/}
      </div>
    </section>
  )
}
