import { getPlayerChance, getSessionWinners } from '@/actions/user'
import { VStack, Text, Button, HStack } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import humanizeDuration from '@/utils/etc/humanizeDuration'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useNear } from '@/hooks'
import { useModal } from '@/providers/ModalProvider'
import {
  cashout,
  claim,
  getCurrentSessionAccumulatedReward,
  getPlayer,
  stake,
} from '../actions'

// TODO: simplify mutations
export default function Session({ session, refetch }) {
  const { viewMethod, accountId, callMethod, signIn } = useNear()
  const { openModal, closeModal } = useModal()
  const { data: accumulatedReward } = useQuery({
    queryKey: ['accumulated_reward', session.id],
    queryFn: () =>
      getCurrentSessionAccumulatedReward({
        viewMethod,
        contractId: session.contractId,
      }),
    enabled: !!session,
  })

  const mutation = useMutation({
    mutationFn: ({ amount }) =>
      stake({ callMethod, amount, viewMethod, contractId: session.contractId }),
    onSuccess: (data, { toggleLoading }) => {
      refetch()
      refetchPlayer()
      refetchChance()
      toggleLoading(false)
      closeModal()
    },
  })

  const claimMutation = useMutation({
    mutationFn: () =>
      claim({ callMethod, sessionId, contractId: session.contractId }),
    onSuccess: () => {
      refetchPlayer()
      refetch()
    },
  })

  const cashoutMutation = useMutation({
    mutationFn: () =>
      cashout({ callMethod, sessionId, contractId: session.contractId }),
    onSuccess: (data, toggleLoading) => {
      refetchPlayer()
      refetch()
      refetchChance()
      toggleLoading(false)
      closeModal()
    },
  })

  const onStake = () => {
    if (!accountId) {
      signIn()
      return
    }

    openModal('StakeModal', {
      sessionId,
      onSubmit: async ({ toggleLoading, amount }) => {
        mutation.mutate({ amount, toggleLoading })
      },
    })
  }

  const onClaim = () => {
    if (player?.isClaimed) return

    claimMutation.mutate()
  }

  const onCashout = () => {
    openModal('ConfirmationModal', {
      title: 'Are you sure you want to cashout?',
      message: "After cashout you don't participate in the game anymore.",
      onConfirm: async (toggleLoading) => {
        cashoutMutation.mutate(toggleLoading)
      },
    })
    // Open confirm modal saying that after cashout you don't any more participate in the game
  }
  const sessionId = session?.id

  const isEnded = session?.end < Date.now() * 1000000

  const { data: winners } = useQuery({
    queryKey: ['session_winners', sessionId],
    queryFn: () =>
      getSessionWinners({
        viewMethod,
        sessionId,
        contractId: session.contractId,
      }),
    enabled: !!sessionId,
  })

  const { data: chance, refetch: refetchChance } = useQuery({
    queryKey: ['chance', sessionId, accountId],
    queryFn: () =>
      getPlayerChance({
        viewMethod,
        sessionId,
        accountId,
        contractId: session.contractId,
      }),
    enabled: !!sessionId && !!accountId,
  })

  const { data: player, refetch: refetchPlayer } = useQuery({
    queryKey: ['player', sessionId, accountId],
    queryFn: () =>
      getPlayer({
        viewMethod,
        sessionId,
        address: accountId,
        contractId: session.contractId,
      }),
    enabled: !!sessionId && !!accountId,
  })

  const isWinner = winners?.includes(accountId)
  const players = session?.players?._keys.length

  return (
    <VStack
      boxShadow='base'
      rounded={'md'}
      p={4}
      border={'1px solid'}
      borderColor={'gray.100'}
    >
      <Text fontSize={'x-large'} fontWeight={500}>
        Total Deposit: {formatNearAmount(session.amount)} Near
      </Text>
      {player && (
        <>
          <Text fontSize={'large'} fontWeight={500} color={'green'}>
            My Deposit: {formatNearAmount(player.amount)} Near
          </Text>
          {chance && Number(chance) ? (
            <Text fontSize={'medium'} fontWeight={500} color={'green'}>
              Chance to win: {Number(chance).toFixed(2)} %
            </Text>
          ) : null}
        </>
      )}

      {winners?.length && (
        <Text fontSize={'large'} fontWeight={500} color={'green'}>
          Winners: {winners.join(', ')}
        </Text>
      )}
      <Text>
        Start Date: {new Date(session.start / 1000000).toLocaleString()}
      </Text>
      {isEnded ? (
        <Text>
          End Date: {new Date(session.end / 1000000).toLocaleString()}
        </Text>
      ) : (
        <Text>Duration: {humanizeDuration(session.duration / 1000)}</Text>
      )}

      <Text>Players: {players}</Text>
      {!session.isFinalized && players && (
        <Text color={'green'}>
          Accumulated Reward: {formatNearAmount(accumulatedReward, 6)} Near
        </Text>
      )}

      <Text>Final Reward: {formatNearAmount(session.reward, 6)} Near</Text>

      {isEnded ? (
        <>
          <Button isDisabled w={'full'}>
            Game is ended
          </Button>

          {session.isFinalized && player && (
            <>
              {isWinner && 'You are a winner!'}
              <Button
                w={'full'}
                onClick={onClaim}
                isDisabled={player?.isClaimed}
              >
                {player?.isClaimed ? 'Already Claimed' : 'Claim'}
              </Button>
            </>
          )}
        </>
      ) : (
        <HStack>
          <Button colorScheme={'blue'} onClick={onStake}>
            {player ? 'Stake' : 'Enter the game'}
          </Button>

          {player && (
            <Button variant={'ghost'} onClick={onCashout}>
              Cashout
            </Button>
          )}
        </HStack>
      )}
    </VStack>
  )
}
