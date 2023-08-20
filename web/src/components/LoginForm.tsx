import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {loginFormSchema} from "src/components/LoginFormSchema";
import {yupResolver} from "@hookform/resolvers/yup";
import {useAuth} from "src/auth";
import {toast} from "@redwoodjs/web/toast";
import {navigate, routes} from "@redwoodjs/router";
import {useMutation} from "@redwoodjs/web";

const enum FormAction {
  LOGIN = 'Login',
  SIGNUP = 'Sign up',
}

const USER_SIGNUP_BACKGROUND = gql`
  mutation UserSignUpBackgroundTasks($id: String!) {
    userSignUp(id: $id) {
      id
    }
  }
`;


export function LoginForm() {
  const {register, handleSubmit, reset, watch, formState: {errors}} = useForm({resolver: yupResolver(loginFormSchema)});
  const [action, setAction] = useState<FormAction>(FormAction.LOGIN);
  const {signUp, client, logIn, isAuthenticated} = useAuth();
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const [userSignUpBackgroundTasks] = useMutation(USER_SIGNUP_BACKGROUND);

  const onSubmit = async (data: any) => {
    if (!isAuthenticated) navigate(routes.chat())
    if (action === FormAction.LOGIN) {
      // login
      await logIn({
        authMethod: 'password',
        email: data.email,
        password: data.password,
      }).then((res) => {
        if (!res.error) {
          toast.success("Login success");
          navigate(routes.chat())
          reset()
        } else {
          toast.error(res.error.message);
          reset()
        }
      })
    }

    if (action === FormAction.SIGNUP) {
      // signup
      await signUp({
        email: data.email,
        password: data.password,
      }).then((res) => {
        if (!res.error) {
          userSignUpBackgroundTasks({variables: {id: res.data.user.id}});
          toast.success("Almost there! Please confirm your email and then login", {duration: 10000});
          setAwaitingConfirmation(true)
          reset()
          setAction(FormAction.LOGIN)
        } else {
          toast.error(res.error.message);
        }
      }).catch((err) => {
        console.log("error");
        toast.error("Error signing up");
        reset()
      });
    }
  }

  return (
    <div className="bg-white shadow rounded lg:w-1/4  md:w-1/3 w-full p-10 ">
      {
        awaitingConfirmation &&
        <div className=" shadow rounded-lg p-4 mb-4 border">
          <p className="text-sm font-medium leading-none text-gray-900">
            Please confirm your email before logging in
          </p>
        </div>
      }

      {/* Title */}
      <p tabIndex={0} role="heading" aria-label="Login/signup"
         className="text-2xl font-extrabold leading-6 text-gray-800">
        {action}
      </p>

      {/* Login Signup Nav */}
      {action === FormAction.LOGIN ? (
        <>
          <p className="text-sm mt-4 font-medium leading-none text-gray-500">
            Dont have account?{" "}
            <span onClick={() => setAction(FormAction.SIGNUP)} tabIndex={0} role="link" aria-label="Sign up here"
                  className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">
                            {" "}
              Sign up here
                        </span>
          </p>
        </>
      ) : (
        <>
          <p className="text-sm mt-4 font-medium leading-none text-gray-500">
            <span onClick={() => setAction(FormAction.LOGIN)} tabIndex={0} role="link" aria-label="Sign up here"
                  className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">
                            {" "}
                          Back to login
                        </span>
          </p>
        </>
      )}

      <div className="w-full flex items-center justify-between py-5">
        <hr className="w-full bg-gray-400"/>
        <p className="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
        <hr className="w-full bg-gray-400  "/>
      </div>


      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-sm font-medium leading-none text-gray-800">Email</label>
          <input aria-label="enter email address" role="input" type="email"
                 className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                 {...register("email")}
          />
          {errors.email && <span className={'text-error'}>{errors.email.message}</span>}
        </div>
        <div className="mt-6 ">
          <label className="text-sm font-medium leading-none text-gray-800">Password</label>
          <input aria-label="enter Password" role="input" type="password"
                 className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                 {...register("password")}
          />
          {errors.password && <span className={'text-error'}>{errors.password.message}</span>}
        </div>
        {action === FormAction.LOGIN &&
          <div className={'pt-1 '}>
            <label onClick={()=>navigate(routes.forgotPassword())} className="text-xs cursor-pointer  hover:underline leading-none text-base-content">forgot
              password?</label>
          </div>
        }
        <div className="mt-8">
          <button onClick={handleSubmit(onSubmit)} role="button" aria-label="create my account"
                  className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full">
            {action === FormAction.LOGIN ? "Login" : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
