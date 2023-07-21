import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {loginFormSchema} from "src/components/LoginFormSchema";
import {yupResolver} from "@hookform/resolvers/yup";
import {useAuth} from "src/auth";
import {toast} from "@redwoodjs/web/toast";
import {navigate, routes} from "@redwoodjs/router";
import {useMutation} from "@redwoodjs/web";

const enum FormAction {
  LOGIN = 'login',
  SIGNUP = 'signup'
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
  const {signUp, logIn, isAuthenticated} = useAuth();
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const [userSignUpBackgroundTasks] = useMutation(USER_SIGNUP_BACKGROUND);

  const onSubmit = async (data: any) => {
    if(!isAuthenticated) navigate(routes.chat())
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
          toast.success("Almost there!, Please confirm your email and then login", {duration: 10000});
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
        awaitingConfirmation && (
          <div className="bg-white shadow rounded-lg p-4 mb-4 border">
            <p className="text-sm font-medium leading-none text-gray-900">
              Please confirm your email before logging in
            </p>
          </div>
        )
      }
      {/* Title */}
      <p tabIndex={0} role="heading" aria-label="Login/signup"
         className="text-2xl font-extrabold leading-6 text-gray-800">
        {action === FormAction.LOGIN ? "Login" : "Sign up"}
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

      {/*/!* Google AUTH *!/*/}
      {/*<button aria-label="Continue with google" role="button"*/}
      {/*        className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"*/}
      {/*        onClick={handleGoogleAuth}*/}
      {/*>*/}
      {/*  <svg width={19} height={20} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*    <path*/}
      {/*      d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z"*/}
      {/*      fill="#4285F4"/>*/}
      {/*    <path*/}
      {/*      d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z"*/}
      {/*      fill="#34A853"/>*/}
      {/*    <path*/}
      {/*      d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z"*/}
      {/*      fill="#FBBC05"/>*/}
      {/*    <path*/}
      {/*      d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z"*/}
      {/*      fill="#EB4335"/>*/}
      {/*  </svg>*/}
      {/*  <p className="text-base font-medium ml-4 text-gray-700">{action === FormAction.LOGIN ? "Continue with Google" : "Sign up with Google"}</p>*/}
      {/*</button>*/}


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
