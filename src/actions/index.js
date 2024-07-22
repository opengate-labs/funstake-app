import { CONTRACTS, NEAR_CONTRACTS } from '@/config'
import { Big } from '@/utils/big'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { ONE_YOCTO_DEPOSIT } from '../hooks'
import { getStakeStorageCost } from './user'
import { ONE_YEAR_TS } from '@/constants/dates'
import { COINS } from '@/constants/coinList'
import { calculateReward as calculateRewardNear } from './near'
import { calculateReward as calculateRewardUsdt } from './usdt'

// TODO: move to better place
const CONTRACT_ACTIONS = {
  [COINS.near]: {
    calculateReward: calculateRewardNear,
  },
  [COINS.usdt]: {
    calculateReward: calculateRewardUsdt,
  },
}

export const getPools = () => {
  return NEAR_CONTRACTS
}

export const getPool = () => {}

export const getActiveSessions = async ({ viewMethod, coin }) => {
  try {
    const promises = []

    for (const contractId of CONTRACTS[coin]) {
      promises.push(
        viewMethod({
          contractId,
          method: 'get_session',
        }),
      )
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

export const getSessions = async ({ viewMethod, contractId }) => {
  const sessions = await viewMethod({
    contractId,
    method: 'sessions',
  })

  return sessions
}

export const getSession = ({ viewMethod, sessionId, contractId }) => {
  const session = viewMethod({
    contractId,
    method: 'get_session',
    args: { sessionId },
  })

  return session
}

export const getExpectedFinalReward = async ({
  viewMethod,
  accountId,
  currentTimestamp,
}) => {
  // TODO: for near atm
  return calculateRewardNear({ viewMethod, accountId, currentTimestamp })
}

export const getAccumulatedReward = async ({ viewMethod, accountId, coin }) => {
  console.log("In -> getAccumulatedReward")
  const currentTimestamp = Date.now() * 1e6
  console.log(CONTRACT_ACTIONS, coin, CONTRACT_ACTIONS[coin])
  return CONTRACT_ACTIONS[coin].calculateReward({
    viewMethod,
    accountId,
    currentTimestamp,
  })
}

export const getPlayers = () => {}

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

export const stake = async ({
  address,
  callMethod,
  amount,
  viewMethod,
  contractId,
  sessionId,
}) => {
  const player = await getPlayer({ sessionId, address, contractId, viewMethod })
  let storageCost = Big(0)

  if (!player) {
    storageCost = Big(
      (await getStakeStorageCost({ viewMethod, contractId })) || 0,
    )
  }

  const deposit = Big(parseNearAmount(amount)).plus(storageCost)

  const result = await callMethod({
    contractId,
    method: 'stake',
    deposit: deposit.toString(),
    gas: '130000000000000', //TODO: move to constants
  })

  console.log('Stake action result: ', result)

  return result
}

export const unstake = () => {}

export const claim = async ({ callMethod, sessionId, contractId }) => {
  const result = await callMethod({
    contractId,
    method: 'claim',
    args: {
      sessionId,
    },
    gas: '50000000000000', //TODO: move to constants
  })

  console.log('Claim action result: ', result)

  return result
}

export const cashout = async ({ callMethod, sessionId, contractId }) => {
  const result = await callMethod({
    contractId,
    method: 'cashout',
    deposit: ONE_YOCTO_DEPOSIT,
    args: {
      sessionId,
    },
    gas: '80000000000000', //TODO: move to constants
  })

  console.log('Cashout action result: ', result)

  return result
}
