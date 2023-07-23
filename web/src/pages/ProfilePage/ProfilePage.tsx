import {MetaTags} from '@redwoodjs/web'
import UserProfileCell from "src/components/UserProfileCell";
import {useAuth} from "src/auth";

const ProfilePage = () => {
  const {currentUser} = useAuth()
  return (
    <>
      <MetaTags title="Profile" description="Profile page"/>
      <div className={'p-12   w-full  '}>
        <h1 className={'text-3xl font-bold'}>
          Your profile
        </h1>
        {
          currentUser &&
          <UserProfileCell id={String(currentUser.sub)}/>
        }
      </div>
    </>
  )
}

export default ProfilePage
