import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

export default function ConfirmationModal({
  onConfirm,
  title = 'By Clicking Confirm Item will be deleted',
  message = 'Are you sure you want to proceed?',
  isOpen,
  onClose,
}) {
  const [isLoading, toggleLoading] = useState(false)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message}</ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            variant='outline'
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
          >
            Close
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => {
              toggleLoading(true)
              onConfirm(toggleLoading)
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
