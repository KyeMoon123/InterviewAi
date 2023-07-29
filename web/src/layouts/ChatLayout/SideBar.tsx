import {MoonIcon} from "@heroicons/react/24/solid";
import {ChatBubbleBottomCenterIcon, HomeIcon, SunIcon, UserIcon} from "@heroicons/react/24/outline";
import {navigate, NavLink, routes} from "@redwoodjs/router";
import {useAuth} from "src/auth";
import {DoorOpenIcon} from "lucide-react";

interface SidebarProps {
  showModels: boolean
  setShowModels: (showModel: boolean) => void
}

export const Sidebar = ({setShowModels, showModels}: SidebarProps) => {
  const {currentUser} = useAuth();
  const {logOut} = useAuth();
  const [theme, setTheme] = React.useState(window.localStorage.getItem('theme') || 'light');
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    window.localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  React.useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex flex-col h-screen bg-primary w-10 lg:w-14 ">
      <div className={"left-0 top-0 px-2 py-2 lg:px-4 lg:py-4 "}>
        <div className="tooltip tooltip-right" data-tip="Toggle theme">
          <label className="swap swap-rotate">
            <input onClick={toggleTheme} type="checkbox"/>
            <div className="swap-on"><MoonIcon className={'w-5 text-neutral-content'}/></div>
            <div className="swap-off"><SunIcon className={'w-5 text-neutral-content'}/></div>
          </label>
        </div>
      </div>


      <div className={'flex flex-col flex-1 justify-center items-center space-y-12 -mt-30'}>
        <div className="tooltip tooltip-right" data-tip="Home">
          <NavLink className={'btn btn-ghost btn-sm'} to={routes.home()} activeClassName={"border border-base-100"}>
            <HomeIcon className={'w-5 text-primary-content'}/>
          </NavLink>
        </div>
        <div className="tooltip tooltip-right" data-tip="Chat">
          <NavLink className={'btn btn-ghost btn-sm'} to={routes.chat()} activeClassName={"border border-base-100"}>
            <ChatBubbleBottomCenterIcon className={'w-5 text-primary-content'}/>
          </NavLink>
        </div>
        <div className="tooltip tooltip-right" data-tip="Your profile">
          <NavLink className={'btn btn-ghost btn-sm'} to={routes.profile()} activeClassName={"border border-base-100"}>
            <UserIcon className={'w-5 text-primary-content'}/>
          </NavLink>
        </div>
      </div>
      <div className={' flex flex-col place-items-center py-2'}>
        <div className="tooltip tooltip-right" data-tip="Your profile">
          <button onClick={()=> navigate(routes.profile())} className="rounded-full border hover:bg-base-100 ">
            <img src={`https://robohash.org/${currentUser.sub}`}
                 className={'w-8 h-8 rounded-full'}/>
          </button>
        </div>

      </div>
      <div className="tooltip tooltip-right" data-tip="Logout">
        <button onClick={() => logOut()}
                className={'cursor-pointer mb-6   btn btn-ghost hover:bg-primary btn-xs btn-circle'}>
          <DoorOpenIcon className={'w-4 text-primary-content '}/>
        </button>
      </div>
    </div>
  )
}
