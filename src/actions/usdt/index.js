import { getYieldSource } from "../common"

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
