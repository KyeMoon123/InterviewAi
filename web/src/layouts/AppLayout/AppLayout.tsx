import {useState} from "react";
import {NavBar} from "src/pages/HomePage/NavBar";

type AppLayoutProps = {
  children?: React.ReactNode
}

const AppLayout = ({children}: AppLayoutProps) => {
  const [showModels, setShowModels] = useState(true);
  return (
    <>

      <div className={'bg-base-300'}>
        <NavBar/>
        {children}
      </div>
    </>
  )
}

export default AppLayout
