import {Button} from "src/components/ui/button";
import {Link, navigate, routes} from "@redwoodjs/router";
import {useAuth} from "src/auth";
import {ArrowRightIcon} from "@heroicons/react/24/solid";

export const NavBar = () => {
  const {isAuthenticated, currentUser} = useAuth()
  const [theme, setTheme] = React.useState(window.localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);


  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <Link to={routes.home()}>
          <h2 className="btn btn-ghost normal-case text-xl">Interview-AI</h2>
        </Link>
      </div>

      <div className="navbar-end space-x-4">
        {isAuthenticated ? (
          <div className={'flex align-middle items-center space-x-4 '}>
            <div className="rounded-full border mb-2">
              <img src={`https://robohash.org/${currentUser.sub}`}
                   className={'w-8 h-8 rounded-full'}/>
            </div>
            <Link className={'btn btn-outline btn-sm'} to={routes.chat()}>
              Dashboard
              <ArrowRightIcon className={'w-4'}/>
            </Link>
          </div>
        ) : (
          <Button onClick={() => navigate(routes.login())} variant={'outline'}>
            Sign In / Sign Up
          </Button>
        )}
      </div>

    </div>
  )
}
