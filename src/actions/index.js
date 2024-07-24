import { COINS } from '@/constants/coins'
import { ONE_YOCTO_DEPOSIT } from '@/constants/nearAmounts'
import {
  calculateReward as calculateRewardNear,
  stake as stakeNear,
} from './near'
import {
  calculateReward as calculateRewardUsdt,
  stake as stakeUsdt,
} from './usdt'

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
