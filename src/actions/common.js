export const getStorageBalanceOf = async ({
  viewMethod,
  contractId,
  accountId,
}) => {
  try {
    const balanceOf = await viewMethod({
      contractId,
      method: 'storage_balance_of',
      args: { account_id: accountId },
    })

    return balanceOf
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getYieldSource = async ({ viewMethod, contractId }) => {
  try {
    const yieldSource = await viewMethod({
      contractId,
      method: 'get_yield_source',
    })

    return yieldSource
  } catch (error) {
    console.error(error)
    return null
  }
}
