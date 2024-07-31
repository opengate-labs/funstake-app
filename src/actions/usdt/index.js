import { getMetadata, getToken, getYieldSource } from '@/actions/common'
import { ONE_YEAR_TS } from '@/constants/dates'
import {
  ONE_YOCTO_DEPOSIT,
  THIRTY_TGAS,
  THREE_HUNDRED_TGAS,
} from '@/constants/nearAmounts'
import { Big } from '@/utils/big'
import { parseAmount } from '@/utils/near/parseAmount'

export const getYieldPercentage = async ({
  viewMethod,
  yieldSourceContractId,
  sessionContractId,
}) => {
  try {
    const tokenAccountId = await getToken({
      viewMethod,
      contractId: sessionContractId,
    })

    const { apy } = await getAccountCoinPosition({
      yieldSourceContractId,
      accountId: sessionContractId,
      viewMethod,
      tokenAccountId,
    })

    return apy
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getAccumulatedReward = async ({
  viewMethod,
  sessionContractId,
  sessionAmount,
}) => {
  const [yieldSourceContractId, tokenAccountId] = await Promise.all([
    await getYieldSource({
      viewMethod,
      contractId: sessionContractId,
    }),
    getToken({
      viewMethod,
      contractId: sessionContractId,
    }),
  ])

  const { balance } = await getAccountCoinPosition({
    yieldSourceContractId,
    accountId: sessionContractId,
    viewMethod,
    tokenAccountId,
  })

  return Big(balance).minus(sessionAmount).toString()
}

export const getExpectedReward = async ({
  viewMethod,
  sessionContractId,
  sessionAmount,
  sessionEnd,
}) => {
  const sessionTimeLeft = Big(sessionEnd)
    .minus(+new Date() * 1e6)
    .toString()

  const accumulatedReward = await getAccumulatedReward({
    viewMethod,
    sessionContractId,
    sessionAmount,
  })

  const yieldSourceContractId = await getYieldSource({
    viewMethod,
    contractId: sessionContractId,
  })

  const APY = await getYieldPercentage({
    viewMethod,
    yieldSourceContractId,
    sessionContractId,
  })

  const expectedReward = calculateExpectedReward({
    accumulatedReward,
    currentDeposit: sessionAmount,
    timeLeftInNanoseconds: sessionTimeLeft,
    APY,
  })

  return expectedReward
}

function calculateExpectedReward({
  accumulatedReward,
  currentDeposit,
  timeLeftInNanoseconds,
  APY,
}) {
  // Convert timeLeft from nanoseconds to years
  const years = Number(timeLeftInNanoseconds) / Number(ONE_YEAR_TS)

  // Calculate the reward
  const reward = currentDeposit * (APY / 100) * years

  return Big(accumulatedReward).plus(reward).round().toString()
}

export const getAccountCoinPosition = async ({
  viewMethod,
  yieldSourceContractId,
  accountId,
  tokenAccountId,
}) => {
  try {
    const accountAllPositions = await viewMethod({
      contractId: yieldSourceContractId,
      method: 'get_account_all_positions',
      args: { account_id: accountId },
    })

    const suppliedTokens = accountAllPositions.supplied
    const suppliedCoin = suppliedTokens
      ? suppliedTokens.find((token) => token.token_id === tokenAccountId)
      : null

    const suppliedCoinBalance = suppliedCoin
      ? BigInt(suppliedCoin.balance) / BigInt(10 ** 12)
      : BigInt(0)

    console.log('suppliedCoin: ', suppliedCoin)
    return {
      balance: suppliedCoinBalance,
      apy: suppliedCoin ? formatBurrowAPY(suppliedCoin.apr) : 0,
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

function formatBurrowAPY(apy) {
  const formattedAPY = Big(apy).times(100).toFixed(2)

  if (parseFloat(formattedAPY) < 0.1) {
    return '< 0.1'
  }

  return formattedAPY
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
