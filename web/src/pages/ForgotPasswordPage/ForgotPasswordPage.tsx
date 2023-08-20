import {Link, navigate, routes} from '@redwoodjs/router'
import {MetaTags, useMutation} from '@redwoodjs/web'
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import { forgotPasswordSchema} from "src/components/LoginFormSchema";
import React, {useState} from "react";
import {useAuth} from "src/auth";
import {toast} from "@redwoodjs/web/toast";


const ForgotPasswordPage = () => {
  const {register, handleSubmit, reset, watch, formState: {errors}} = useForm({resolver: yupResolver(forgotPasswordSchema)});
  const {signUp, client} = useAuth();

  const onSubmit = async (data: any) => {
    toast.loading("Sending password reset email...")
    await client.auth.resetPasswordForEmail(data.email, {
      redirectTo: "https://www.interview-ai.one/update-password",
    }).then((res) => {
      toast.dismiss()
      toast("Please check your email for a password reset link.", {duration: 10000})
      reset()
    })
  }

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
          <div className="bg-white shadow rounded lg:w-1/4  md:w-1/3 w-full p-10 ">

            {/* Title */}
            <p tabIndex={0} role="heading" aria-label="Login/signup"
               className="text-2xl font-extrabold leading-6 text-gray-800">
              Reset password
            </p>
            <p className="text-sm mt-4 font-medium leading-none text-gray-500">
            <span onClick={() => navigate(routes.login())} tabIndex={0} role="link" aria-label="Sign up here"
                  className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">
                            {" "}
              Back to login
                        </span>
            </p>



            <div className="w-full flex items-center justify-between py-5">
              <hr className="w-full bg-gray-400"/>
              <p className="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
              <hr className="w-full bg-gray-400  "/>
            </div>


            {/* Form */}
            <form  onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-sm font-medium leading-none text-gray-800">Email</label>
                <input aria-label="enter email address" role="input" type="email"
                       className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                       {...register("email")}
                />
                {errors.email && <span className={'text-error'}>{errors.email.message}</span>}
              </div>
              <div className="mt-8">
                <button  role="button" aria-label="create my account"
                        className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full">
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
