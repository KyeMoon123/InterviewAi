import {JSX, ReactElement, ReactNode, useEffect} from "react";

export interface ConfirmationModalProps {
  onConfirm?: () => void
  open?: boolean
  setOpen?: (open: boolean) => void
  title: string
  description: string
  OpenButton?: ReactElement
  confirmationText?: string
}

export const ConfirmationModal = ({

                                    onConfirm,
                                    setOpen,
                                    open,
                                    title,
                                    description,
                                    confirmationText,
                                    OpenButton
                                  }: ConfirmationModalProps) => {

  return (
    <>
      <input onChange={()=>{}} checked={open} type="checkbox"  className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{description}</p>
          <div className="modal-action">
            <button className="btn btn-sm btn-outline" onClick={()=>{setOpen(false)}}>Close</button>
            <button onClick={onConfirm} className="btn btn-sm">{confirmationText ? confirmationText : "Confirm"}</button>
          </div>
        </div>
      </div>
    </>
  )
}
