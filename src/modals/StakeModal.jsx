import { getBalance, getBalanceOf } from '@/actions/common'
import { COINS } from '@/constants/coins'
import { useNear } from '@/hooks'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Big from 'big.js'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function StakeModal({
  onSubmit,
  title = 'Stake',
  isOpen,
  onClose,
  coin,
  contractId: funStakeContractId,
}) {
  const [isLoading, toggleLoading] = useState(false)
  const { accountId, viewMethod } = useNear()
  const isFtToken = coin !== COINS.near

  const { data: balance } = useQuery({
    queryKey: ['balance', accountId, coin],
    queryFn: () => {
      if (isFtToken) {
        return getBalanceOf({
          viewMethod,
          accountId,
          contractId: funStakeContractId,
        })
      }

      return getBalance({ accountId })
    },
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
    setValue('amount', balance.replace(/,/g, ''))
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        as={'form'}
        onSubmit={handleSubmit(onFormSubmit)}
        background='mainBg'
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errors.amount}>
            <FormLabel fontSize={'sm'} fontWeight={600}>
              Balance: {balance} {coin.toUpperCase()}
            </FormLabel>

            <InputGroup>
              <Input
                id='amount'
                placeholder={`Amount in ${coin.toUpperCase()}`}
                _focus={{ borderColor: 'mainGreen' }}
                _focusVisible={{ borderColor: 'mainGreen' }}
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
                    const maxAmount = Big(balance.replace(/,/g, ''))
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
            mr={3}
            variant='outline'
            onClick={onClose}
            isDisabled={isLoading}
          >
            Close
          </Button>
          <Button type='submit' isLoading={isLoading} color='mainGreen'>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
