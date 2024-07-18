import { NetworkId } from '@/config'
import * as nearAPI from 'near-api-js'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

const provider = new nearAPI.providers.JsonRpcProvider({
  url: `https://rpc.${NetworkId}.near.org`,
})

export const getBalance = async ({ accountId }) => {
  const balance = await provider.query({
    request_type: 'view_account',
    finality: 'final',
    account_id: accountId,
  })

  return balance ? formatNearAmount(balance.amount, 5) : 0
}

// TODO: move to other actions file
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

// TODO: move to other actions file
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
