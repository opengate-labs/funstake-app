import { CONTRACTS, NEAR_CONTRACTS } from '@/config'
import { ONE_YOCTO_DEPOSIT } from '../hooks'
import { COINS } from '@/constants/coinList'
import {
  calculateReward as calculateRewardNear,
  stake as stakeNear,
} from './near'
import {
  calculateReward as calculateRewardUsdt,
  stake as stakeUsdt,
} from './usdt'

// TODO: move to better place
const CONTRACT_ACTIONS = {
  [COINS.near]: {
    calculateReward: calculateRewardNear,
    stake: stakeNear,
  },
  [COINS.usdt]: {
    calculateReward: calculateRewardUsdt,
    stake: stakeUsdt,
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

export const getAccumulatedReward = async ({
  viewMethod,
  sessionContractId,
  coin,
  sessionAmount,
}) => {
  const currentTimestamp = Date.now() * 1e6

  return CONTRACT_ACTIONS[coin].calculateReward({
    viewMethod,
    currentTimestamp,
    sessionContractId,
    sessionAmount,
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
  coin,
  sendMultipleTransactions,
}) => {
  return CONTRACT_ACTIONS[coin].stake({
    amount,
    sessionId,
    address,
    contractId,
    viewMethod,
    callMethod,
    sendMultipleTransactions,
  })
}

export const claim = async ({ callMethod, sessionId, contractId }) => {
  const result = await callMethod({
    contractId,
    method: 'claim',
    args: {
      sessionId,
    },
    gas: '150000000000000', //TODO: move to constants
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
    gas: '210000000000000', //TODO: move to constants
  })

  console.log('Cashout action result: ', result)

  return result
}
