import {MoonIcon} from "@heroicons/react/24/solid";
import {SunIcon} from "@heroicons/react/24/outline";
import {ChatBubbleBottomCenterIcon, UserIcon, HomeIcon} from "@heroicons/react/24/outline";

type ChatLayoutProps = {
  children?: React.ReactNode
}

const ChatLayout = ({children}: ChatLayoutProps) => {
  return (

    <div className="flex flex-row h-screen">
      <Sidebar/>
      <SecondSidebar/>
      <div className="flex flex-col flex-1">

        {children}
      </div>
    </div>
  )
}

export default ChatLayout


export const Sidebar = () => {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  // initially set the theme and "listen" for changes to apply them to the HTML tag
  React.useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex flex-col h-screen bg-neutral w-16 rounded-r-box">
      <div className={"left-0 top-0 ml-5 pt-2 "}>
        <label className="swap swap-rotate">
          <input onClick={toggleTheme} type="checkbox"/>
          <div className="swap-on"><MoonIcon className={'w-5 text-neutral-content'}/></div>
          <div className="swap-off"><SunIcon className={'w-5 text-neutral-content'}/></div>
        </label>
      </div>
      <div className={'flex flex-col flex-1 justify-center items-center space-y-12 -mt-30'}>
        <div className={'btn btn-ghost'}>
          <HomeIcon className={'w-6 text-neutral-content'}/>
        </div>
        <div className={'btn btn-ghost'}>
          <ChatBubbleBottomCenterIcon className={'w-6 text-neutral-content'}/>
        </div>
        <div className={'btn btn-ghost'}>
          <UserIcon className={'w-6 text-neutral-content'}/>
        </div>
      </div>
    </div>
  )
}
export const SecondSidebar = () => {
  return (
    <div className="flex flex-col h-screen bg-base-200 w-80">
      <div className="p-2 pt-8">
        <input type="text" placeholder="Search" className="input w-full max-w-xs" />
        <div className="divider"/>
      </div>

      <ul>
        <li className="px-2 space-y-2">
          <div className="p-4 rounded-lg  bg-base-100 shadow-xl">
            <div className="">
              <h2 className="">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="flex justify-end">
                <button className="btn btn-sm btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg  bg-base-100 shadow-xl">
            <div className="">
              <h2 className="">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="flex justify-end">
                <button className="btn btn-sm btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        </li>
      </ul>

    </div>)
}
