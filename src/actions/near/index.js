import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { Big } from '@/utils/big'
import {
  getPlayer,
  getStakeStorageCost,
  getYieldSource,
} from '@/actions/common'

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

export const calculateReward = async ({
  viewMethod,
  sessionContractId,
  // currentTimestamp,
}) => {
  // const now = Big(currentTimestamp)

  console.log('Contract id : ', sessionContractId)
  const yieldSource = await getYieldSource({
    viewMethod,
    contractId: sessionContractId,
  })

  console.log('yieldSource: ', yieldSource)

  const [{ accrued } /*, balanceOf */] = await Promise.all([
    getYieldInfo({
      viewMethod,
      yieldSource,
      accountId: sessionContractId,
    }),
    // getStorageBalanceOf({
    //   accountId: sessionContractId,
    //   contractId: yieldSource,
    //   viewMethod,
    // }),
  ])

  // TODO: Postponed dynamic calculation of expected rewards
  // const result = Big(balanceOf)
  //   .div(1000)
  //   .times(apyValue)
  //   .div(ONE_YEAR_TS)
  //   .times(now.minus(lastAccrualTs))

  // return Big(accrued).plus(result).toString()
  return accrued.toString()
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
