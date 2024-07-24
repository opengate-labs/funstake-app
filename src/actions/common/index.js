import { formatAmount } from '@/utils/near/formatAmount'
import { providers } from 'near-api-js'
import { CONTRACTS, NetworkId } from '@/config'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

const provider = new providers.JsonRpcProvider({
  url: `https://rpc.${NetworkId}.near.org`,
})

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

export const getBalanceOf = async ({
  viewMethod,
  contractId: funStakeContractId,
  accountId,
}) => {
  try {
    const tokenContractId = await getToken({
      viewMethod,
      contractId: funStakeContractId,
    })

    const [{ decimals }, balanceOf] = await Promise.all([
      getMetadata({ viewMethod, contractId: tokenContractId }),
      viewMethod({
        contractId: tokenContractId,
        method: 'ft_balance_of',
        args: {
          account_id: accountId,
        },
      }),
    ])

    return balanceOf ? formatAmount(balanceOf, decimals) : 0
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getBalance = async ({ accountId }) => {
  try {
    const balance = await provider.query({
      request_type: 'view_account',
      finality: 'final',
      account_id: accountId,
    })

    return balance ? formatNearAmount(balance.amount, 5) : 0
  } catch (error) {
    console.error(error)
    return 0
  }
}

export const getMetadata = async ({ viewMethod, contractId }) => {
  try {
    const data = await viewMethod({
      contractId,
      method: 'ft_metadata',
    })

    return data
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

export const getToken = ({ viewMethod, contractId }) => {
  try {
    return viewMethod({
      contractId,
      method: 'get_token',
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getStakeStorageCost = async ({ viewMethod, contractId }) => {
  try {
    const result = await viewMethod({
      contractId,
      method: 'get_stake_storage_cost',
    })

    return result
  } catch (error) {
    console.error(error)
    return 0
  }
}

export const getPlayer = async ({
  viewMethod,
  sessionId,
  address,
  contractId,
}) => {
  try {
    const player = await viewMethod({
      contractId,
      method: 'get_player',
      args: { sessionId, address },
    })

    return player
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getActiveSessions = async ({ viewMethod, coin }) => {
  try {
    const promises = []

    for (const contractId of CONTRACTS[coin]) {
      if (contractId) {
        promises.push(
          viewMethod({
            contractId,
            method: 'get_session',
          }),
        )
      }
    }

    const sessions = await Promise.all(promises)

    return sessions.map((session, index) => {
      return {
        ...session,
        contractId: CONTRACTS[coin][index],
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getSessionWinners = async ({
  viewMethod,
  sessionId,
  contractId,
}) => {
  const result = await viewMethod({
    contractId,
    method: 'get_session_winners',
    args: { sessionId },
  })

  return result
}

export const getPlayerChance = async ({
  viewMethod,
  sessionId,
  accountId,
  contractId,
}) => {
  const result = await viewMethod({
    contractId,
    method: 'get_player_chance',
    args: { sessionId, address: accountId },
  })

  return result
}
