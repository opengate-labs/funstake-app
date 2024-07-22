import Big from "big.js"
import { ONE_YEAR_TS } from "@/constants/dates"
import { getStorageBalanceOf, getYieldSource } from "../common"

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

export const calculateReward = async ({ viewMethod, accountId, currentTimestamp }) => {
  const now = Big(currentTimestamp)

  console.log("Contract id : ", accountId)
  const yieldSource = await getYieldSource({
    viewMethod,
    contractId: accountId,
  })

  console.log("yieldSource: ", yieldSource)

  const [{ apyValue, lastAccrualTs, accrued }, balanceOf] = await Promise.all([
    getYieldInfo({
      viewMethod,
      yieldSource,
      accountId,
    }),
    getStorageBalanceOf({
      accountId,
      contractId: yieldSource,
      viewMethod,
    }),
  ])

  const result = Big(balanceOf)
    .div(1000)
    .times(apyValue)
    .div(ONE_YEAR_TS)
    .times(now.minus(lastAccrualTs))

  return Big(accrued).plus(result).toString()
}
