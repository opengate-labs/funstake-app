import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react'
import { useNear } from '../hooks'
import { useQuery } from '@tanstack/react-query'
import { getBalance } from '@/actions/user'
import Big from 'big.js'

export default function StakeModal({
  onSubmit,
  title = 'Stake',
  isOpen,
  onClose,
}) {
  const [isLoading, toggleLoading] = useState(false)
  const { accountId } = useNear()
  const { data: balance } = useQuery({
    queryKey: ['balance', accountId],
    queryFn: () => getBalance({ accountId }),
    enabled: !!accountId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    amount: 0,
  })
  const onFormSubmit = ({ amount }) => {
    toggleLoading(true)
    onSubmit({ amount, toggleLoading })
  }
  const onMax = async () => {
    setValue('amount', balance)
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errors.amount}>
            <FormLabel fontSize={'sm'} fontWeight={600}>
              Balance: {balance}
            </FormLabel>

            <InputGroup>
              <Input
                id='amount'
                placeholder='Amount in Near'
                {...register('amount', {
                  required: 'This is required',
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: 'Must be valid number',
                  },
                  min: {
                    value: '0',
                    message: 'Must be a positive number',
                  },
                  validate: (value) => {
                    const amount = Big(value)
                    const maxAmount = Big(balance)
                    const minAmount = Big(0)

                    if (amount.gt(maxAmount)) {
                      return `Max available deposit is ${maxAmount} near`
                    }

                    if (amount.lte(minAmount)) {
                      return 'Amount must be greater than 0'
                    }

                    return true
                  },
                })}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={onMax}>
                  MAX
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type='submit'
            colorScheme='blue'
            variant='outline'
            mr={3}
            isLoading={isLoading}
          >
            Confirm
          </Button>

          <Button onClick={onClose} isDisabled={isLoading}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
