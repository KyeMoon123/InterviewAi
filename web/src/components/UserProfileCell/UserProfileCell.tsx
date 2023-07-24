import type {FindUserProfileQuery, FindUserProfileQueryVariables,} from 'types/graphql'
import type {CellFailureProps, CellSuccessProps} from '@redwoodjs/web'
import ProfileSection from "src/components/ProfileSection/ProfileSection";

export const QUERY = gql`
  query FindUserProfileQuery($id: String!) {
    user: user(id: $id) {
      id
      subscriptionName
      subscriptionId
      credits
      subscriptionCancelAtPeriodEnd
      subscriptionCurrentPeriodEnd
    }
  }
`

export const Loading = () => {
  return (
    <div className={'flex  h-full w-full place-content-center'}>
      <span className=" text-primary loading loading-dots loading-lg"></span>
    </div>
  )
}

export const Empty = () => <div>Empty</div>

export const Failure = ({
                          error,
                        }: CellFailureProps<FindUserProfileQueryVariables>) => (
  <div style={{color: 'red'}}>Error: {error?.message}</div>
)

export const Success = ({
                          user,
                        }: CellSuccessProps<FindUserProfileQuery, FindUserProfileQueryVariables>) => {
  return (
    <ProfileSection user={user}/>
  )
}
