import React from 'react'
import {Dialog} from './lib'

const ModalContext = React.createContext()

function useModal() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a <Modal>')
  }
  return context
}

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  const value = {isOpen, setIsOpen}
  return <ModalContext.Provider value={value} {...props} />
}

function ModalDismissButton({children}) {
  const {setIsOpen} = useModal()

  return React.cloneElement(children, {
    onClick: () => setIsOpen(false),
  })
}

function ModalOpenButton({children}) {
  const {setIsOpen} = useModal()
  return React.cloneElement(children, {
    onClick: () => setIsOpen(true),
  })
}

function ModalContents(props) {
  const {isOpen, setIsOpen} = useModal()

  const close = () => setIsOpen(false)

  return <Dialog isOpen={isOpen} onDismiss={close} {...props} />
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
