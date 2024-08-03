import { useQuery } from '@tanstack/react-query'
import { getAccumulatedReward, getYieldPercentage } from '@/actions'
import { useNear } from './useNear'
import { getSessionWinners } from '@/actions/common'
import { getExpectedReward } from '../actions'

export function useSessionData({ session, coin }) {
  const { contractId, id: sessionId, end, isFinalized } = session

  const { viewMethod } = useNear()

  const { data: accumulatedReward } = useQuery({
    queryKey: ['accumulated_reward', contractId, sessionId, coin],
    refetchInterval: 10000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      getAccumulatedReward({
        viewMethod,
        sessionContractId: contractId,
        coin,
        sessionAmount: session.amount,
      }),
    enabled: !!session && !isFinalized,
  })

  const { data: expectedReward } = useQuery({
    queryKey: ['expected_reward', contractId, sessionId, coin],
    refetchInterval: 10000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      getExpectedReward({
        viewMethod,
        sessionContractId: contractId,
        coin,
        sessionAmount: session.amount,
        sessionEnd: session.end,
      }),
    enabled: !!session && !isFinalized,
  })

  const { data: winners } = useQuery({
    queryKey: ['session_winners', contractId, sessionId, coin],
    queryFn: () =>
      getSessionWinners({
        viewMethod,
        sessionId,
        contractId,
      }),
    enabled: !!sessionId && isFinalized,
  })

  const { data: yieldPercentage } = useQuery({
    queryKey: ['yield_percentage', contractId, sessionId, coin],
    queryFn: () =>
      getYieldPercentage({
        viewMethod,
        sessionContractId: contractId,
        coin,
      }),
    enabled: !!sessionId && !!coin,
  })

  const isEnded = end < Date.now() * 1000000

  return {
    accumulatedReward,
    winners,
    yieldPercentage,
    isEnded,
    expectedReward,
  }
}
