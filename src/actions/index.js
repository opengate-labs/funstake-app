import { Contract as contractId } from '@/config'
import { BigDecimal } from '@/utils/big'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { ONE_YOCTO_DEPOSIT } from '../hooks'

export const getPools = () => {}

export const getPool = () => {}

export const getSessions = async ({ viewMethod }) => {
  const sessions = await viewMethod({
    contractId,
    method: 'sessions',
  })

  return sessions
}

export const getSession = ({ viewMethod, sessionId }) => {
  const session = viewMethod({
    contractId,
    method: 'get_session',
    args: { sessionId },
  })

  return session
}

export const getPlayers = () => {}

export const getPlayer = async ({ viewMethod, sessionId, address }) => {
  const player = await viewMethod({
    contractId,
    method: 'get_player',
    args: { sessionId, address },
  })

  return player
}

export const stake = async ({ callMethod, amount }) => {
  const result = await callMethod({
    contractId,
    method: 'stake',
    deposit: parseNearAmount(amount),
    gas: '80000000000000', //TODO: move to constants
  })

  console.log('Stake action result: ', result)

  return result
}

export const unstake = () => {}

export const claim = async ({ callMethod, sessionId }) => {
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

export const cashout = async ({ callMethod, sessionId }) => {
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
