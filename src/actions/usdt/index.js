import Big from 'big.js'
import { getMetadata, getToken, getYieldSource } from '../common'
import { THIRTY_TGAS, THREE_HUNDRED_TGAS } from '@/constants/nearAmounts'
import { ONE_YOCTO_DEPOSIT } from '@/hooks/useNear'
import { parseAmount } from '@/utils/near/parseAmount'

export const calculateReward = async ({
  viewMethod,
  sessionContractId,
  sessionAmount,
}) => {
  const yieldSourceContractId = await getYieldSource({
    viewMethod,
    contractId: sessionContractId,
  })
  const tokenAccountId = await getToken({
    viewMethod,
    contractId: sessionContractId,
  })

  const yieldBalanceData = await viewMethod({
    contractId: yieldSourceContractId,
    method: 'get_account_all_positions',
    args: { account_id: sessionContractId },
  })

  const suppliedTokens = yieldBalanceData.supplied
  const suppliedCoin = suppliedTokens?.find(
    (token) => token.token_id === tokenAccountId,
  )
  const suppliedCoinBalance = suppliedCoin
    ? BigInt(suppliedCoin.balance) / BigInt(10 ** 12)
    : BigInt(0)

  return Big(suppliedCoinBalance).minus(sessionAmount).toString()
}

export const stake = async ({
  address,
  contractId,
  viewMethod,
  callMethod,
  sendMultipleTransactions,
  amount,
}) => {
  try {
    const tokenContractId = await getToken({ viewMethod, contractId })
    const { decimals } = await getMetadata({
      viewMethod,
      contractId: tokenContractId,
    })
    const isPlayerDepositted = await getStorageDeposit({
      address,
      viewMethod,
      contractId,
    })

    const storageDepositRequired = !isPlayerDepositted

    if (storageDepositRequired) {
      const transactions = [
        {
          contractId: contractId,
          method: 'storage_deposit',
          gas: THIRTY_TGAS,
          deposit: BigInt(2500000000000000000000),
        },
        {
          contractId: tokenContractId,
          method: 'ft_transfer_call',
          args: {
            receiver_id: contractId,
            amount: parseAmount(amount, decimals),
            msg: '',
          },
          deposit: ONE_YOCTO_DEPOSIT,
          gas: THREE_HUNDRED_TGAS,
        },
      ]

      await sendMultipleTransactions({ transactions })
    } else {
      const result = await callMethod({
        contractId: tokenContractId,
        method: 'ft_transfer_call',
        args: {
          receiver_id: contractId,
          amount: parseAmount(amount, decimals),
          msg: '',
        },
        deposit: ONE_YOCTO_DEPOSIT,
        gas: THREE_HUNDRED_TGAS,
      })

      return result
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getStorageDeposit = async ({
  contractId,
  address,
  viewMethod,
}) => {
  try {
    const isDepositted = await viewMethod({
      contractId,
      method: 'get_storage_deposit',
      args: { address },
    })

    return isDepositted
  } catch (error) {
    console.error(error)
    return null
  }
}
