import { CONTRACTS } from '@/config'
import { Big } from '@/utils/big'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { ONE_YOCTO_DEPOSIT } from '../hooks'
import { getStakeStorageCost } from './user'

export const getPools = () => {
  return CONTRACTS
}

export const getPool = () => {}

export const getActiveSessions = async ({ viewMethod }) => {
  try {
    const promises = []

    for (const contractId of CONTRACTS) {
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
        contractId: CONTRACTS[index],
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

export const getCurrentSessionAccumulatedReward = async ({
  viewMethod,
  contractId,
}) => {
  const yieldSource = await getYieldSource({ viewMethod, contractId })

  const data = await viewMethod({
    contractId: yieldSource,
    method: 'get_user',
    args: { account_id: contractId },
  })

  return data.accrued
}

export const getYieldSource = async ({ viewMethod, contractId }) => {
  const yieldSource = await viewMethod({
    contractId,
    method: 'get_yield_source',
  })

  return yieldSource
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
