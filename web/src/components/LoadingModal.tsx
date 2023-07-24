import {useEffect} from "react";

interface LoadingModalProps {
  loading: boolean
}

export const LoadingModal = ({loading}: LoadingModalProps) => {

  useEffect(() => {
    if(loading) {
      //@ts-ignore
      window.loading_modal.showModal()
    }else{
      //@ts-ignore
      window.loading_modal.close()
    }
  }, [loading])

  return (
    <dialog id="loading_modal" className="modal">
      <form method="dialog" className="modal-box">
      <div className={'flex flex-col place-items-center space-y-6'}>
        <h1 className={'text-lg font-semibold'}>Just a second...</h1>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
      </form>
    </dialog>
  )
}
