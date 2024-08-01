import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { Big } from '@/utils/big'
import {
  getPlayer,
  getStakeStorageCost,
  getStorageBalanceOf,
  getYieldSource,
} from '@/actions/common'
import { ONE_YEAR_TS } from '@/constants/dates'

export const getYieldPercentage = async ({
  viewMethod,
  yieldSourceContractId,
  sessionContractId,
}) => {
  try {
    const { apyValue } = await getYieldInfo({
      viewMethod,
      yieldSource: yieldSourceContractId,
      accountId: sessionContractId,
    })

    return apyValue / 100
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getYieldInfo = async ({ viewMethod, yieldSource, accountId }) => {
  try {
    const data = await viewMethod({
      contractId: yieldSource,
      method: 'get_user',
      args: { account_id: accountId },
    })

    return {
      apyValue: data.apy_value,
      lastAccrualTs: data.last_accrual_ts,
      accrued: data.accrued,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getAccumulatedReward = async ({
  viewMethod,
  sessionContractId,
}) => {
  const yieldSource = await getYieldSource({
    viewMethod,
    contractId: sessionContractId,
  })

  const { accrued } = await getYieldInfo({
    viewMethod,
    yieldSource,
    accountId: sessionContractId,
  })

  return accrued.toString()
}

export const getExpectedReward = async ({
  viewMethod,
  sessionContractId,
  sessionEnd,
}) => {
  const yieldSource = await getYieldSource({
    viewMethod,
    contractId: sessionContractId,
  })
  const [{ accrued, lastAccrualTs, apyValue }, balanceOf] = await Promise.all([
    getYieldInfo({
      viewMethod,
      yieldSource,
      accountId: sessionContractId,
    }),
    getStorageBalanceOf({
      accountId: sessionContractId,
      contractId: yieldSource,
      viewMethod,
    }),
  ])

  const timeLeftFromLastAccrual = sessionEnd - lastAccrualTs
  const years = timeLeftFromLastAccrual / ONE_YEAR_TS

  const expectedAdditionalReward = Big(balanceOf)
    .times(apyValue)
    .div(10000)
    .times(years)

  const totalExpectedReward = Big(accrued).plus(expectedAdditionalReward)

  return totalExpectedReward.round().toString()
}

export const stake = async ({
  sessionId,
  address,
  contractId,
  viewMethod,
  callMethod,
  amount,
}) => {
  try {
    const player = await getPlayer({
      sessionId,
      address,
      contractId,
      viewMethod,
    })

    const storageCost = player
      ? Big(0)
      : await getStakeStorageCost({ viewMethod, contractId })

    const deposit = Big(parseNearAmount(amount)).plus(storageCost)

    const result = await callMethod({
      contractId,
      method: 'stake',
      deposit: deposit.toString(),
      gas: '130000000000000', //TODO: move to constants
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
