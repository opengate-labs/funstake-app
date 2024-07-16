import { useDisclosure } from '@chakra-ui/react'
import React, { createContext, useContext, useState } from 'react'
import * as modals from '@/modals'

/**
 * Opens a modal with the specified name and props.
 *
 * @param {string} [modalName='ConfirmationModal'] - The name of the modal to open. Should be one of the keys in the modals object.
 * @param {object} [props={ onConfirm: () => {} }] - The props to pass to the modal component.
 */
const openModal = (
  modalName = 'ConfirmationModal',
  props = { onConfirm: () => {} },
) => {}

export const ModalContext = createContext({
  openModal,
  closeModal: () => {},
})
export const useModal = () => useContext(ModalContext)

export default function ModalProvider({ children }) {
  const [modal, setModal] = useState('ConfirmationModal')
  const [modalProps, setModalProps] = useState({})
  const { isOpen: isModalOpen, onOpen, onClose: closeModal } = useDisclosure()

  const updateModalProps = (props) => {
    setModalProps((prevModalProps) => ({ ...prevModalProps, ...props }))
  }

  const openModal = (modalName, props) => {
    setModal(modalName)
    setModalProps(props)
    onOpen()
  }
  const ModalComponent = modals[modal]
  return (
    <ModalContext.Provider value={{ openModal, closeModal, updateModalProps }}>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalProps}
      />
      {children}
    </ModalContext.Provider>
  )
}
