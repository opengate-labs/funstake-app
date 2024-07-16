import { NetworkId, Contract as contractId } from '@/config'
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

export const getSessionWinners = async ({ viewMethod, sessionId }) => {
  const result = await viewMethod({
    contractId,
    method: 'get_session_winners',
    args: { sessionId },
  })

  return result
}

export const getPlayerChance = async ({ viewMethod, sessionId, accountId }) => {
  const result = await viewMethod({
    contractId,
    method: 'get_player_chance',
    args: { sessionId, address: accountId },
  })

  console.log('getPlayerChance result: ', result)

  return result
}

// export const getPlayerTicketsRange = async ({ viewMethod, accountId, sessionId }) => {
//   const ticketsRange = await viewMethod({
//     contractId,
//     method: 'get_player_tickets_range',
// args: {
//   address: accountId,
// sessionId
// }
//   })

//   return balance ? formatNearAmount(balance.amount, 5) : 0
// }
