import Header from '@/components/Header'
import { useNear } from '../hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Container, HStack, Text, VStack } from '@chakra-ui/react'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import humanizeDuration from '@/utils/etc/humanizeDuration'
import { getPlayer, getSession } from '@/actions'
import { useModal } from '@/providers/ModalProvider'
import { cashout, claim, stake } from '../actions'
import { getPlayerChance, getSessionWinners } from '@/actions/user'

// TODO:
// STATUSES
// 1. Active
// 2. Finished

export default function Home() {
  // const queryClient = useQueryClient()

  const { viewMethod, accountId, callMethod, signIn } = useNear()
  const { openModal, closeModal } = useModal()

  const { data: session, refetch: refetchSession } = useQuery({
    queryKey: ['current_session'],
    queryFn: () => getSession({ viewMethod }),
  })

  const sessionId = session?.id
  const isEnded = session?.end < Date.now() * 1000000

  const { data: winners, refetch: refetchWinners } = useQuery({
    queryKey: ['session_winners', sessionId],
    queryFn: () => getSessionWinners({ viewMethod, sessionId }),
    enabled: !!sessionId,
  })

  const { data: chance, refetch: refetchChance } = useQuery({
    queryKey: ['chance', sessionId, accountId],
    queryFn: () => getPlayerChance({ viewMethod, sessionId, accountId }),
    enabled: !!sessionId && !!accountId,
  })

  const { data: player, refetch: refetchPlayer } = useQuery({
    queryKey: ['player', sessionId, accountId],
    queryFn: () => getPlayer({ viewMethod, sessionId, address: accountId }),
    enabled: !!sessionId && !!accountId,
  })

  const mutation = useMutation({
    mutationFn: ({ amount }) => stake({ callMethod, amount }),
    onSuccess: (data, { toggleLoading }) => {
      refetchPlayer()
      refetchSession()
      refetchChance()
      toggleLoading(false)
      closeModal()
    },
  })

  const claimMutation = useMutation({
    mutationFn: () => claim({ callMethod, sessionId }),
    onSuccess: () => {
      refetchPlayer()
      refetchSession()
    },
  })

  const cashoutMutation = useMutation({
    mutationFn: () => cashout({ callMethod, sessionId }),
    onSuccess: (toggleLoading) => {
      refetchPlayer()
      refetchSession()
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
      onSubmit: async ({ toggleLoading, amount }) => {
        console.log('amount: ', amount)

        mutation.mutate({ amount, toggleLoading })
      },
    })
  }

  const onClaim = () => {
    if (player.isClaimed) return

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

  console.log('winners: ', winners)
  const isWinner = winners?.includes(accountId)

  return (
    <>
      <Header />
      session: {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
      player: {player && <pre>{JSON.stringify(player, null, 2)}</pre>}
      <Container>
        {session && (
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
                <Text fontSize={'medium'} fontWeight={500} color={'green'}>
                  Chance to win: {chance ? Number(chance).toFixed(2) : 0} %
                </Text>
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
            <Text>Players: {session.players._keys.length}</Text>
            <Text color={'green'}>
              Final Reward: {formatNearAmount(session.reward)} Near
            </Text>

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
                      isDisabled={player.isClaimed}
                    >
                      {player.isClaimed ? 'Already Claimed' : 'Claim'}
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
        )}
      </Container>
    </>
  )
}
