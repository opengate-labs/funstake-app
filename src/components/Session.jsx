import { getPlayerChance, getSessionWinners } from '@/actions/user'
import { VStack, Text, Button, HStack, Box, Flex } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import humanizeDuration from '@/utils/etc/humanizeDuration'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useNear } from '@/hooks'
import { useModal } from '@/providers/ModalProvider'
import NearIcon from '@/components/NearIcon'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import {
  cashout,
  claim,
  getAccumulatedReward,
  getExpectedFinalReward,
  getPlayer,
  stake,
} from '../actions'
import { Timer } from './Timer'

// TODO: simplify mutations
export default function Session({ session, refetch, index }) {
  const { viewMethod, accountId, callMethod, signIn } = useNear()
  const { openModal, closeModal } = useModal()
  const { data: accumulatedReward } = useQuery({
    queryKey: ['accumulated_reward', session.id],
    queryFn: () =>
      getAccumulatedReward({
        viewMethod,
        accountId: session.contractId,
      }),
    enabled: !!session,
  })
  const { data: expectedFinalReward } = useQuery({
    queryKey: ['expected_final_reward', session.id],
    queryFn: () =>
      getExpectedFinalReward({
        viewMethod,
        accountId: session.contractId,
        currentTimestamp: session.end,
      }),
    enabled: !!session,
  })

  const mutation = useMutation({
    mutationFn: ({ amount }) =>
      stake({
        callMethod,
        amount,
        viewMethod,
        contractId: session.contractId,
        sessionId: session.id,
        address: accountId,
      }),
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
  console.log(new Date(session.end / 1000000))
  return (
    <VStack
      mt={8}
      // boxShadow='base'
      rounded={'md'}
      p={4}
      border={'1px solid'}
      borderColor={'cardBorder'}
      background='cardBg'
      borderRadius={'36px'}
    >
      <Accordion allowToggle w='full'>
        <AccordionItem
          w='full'
          borderTopWidth={0}
          borderBottomWidth={'0 !important'}
        >
          <AccordionButton w='full' _hover={{}}>
            <Box as='span' flex='1' textAlign='left'>
              <Text
                w='full'
                borderBottomWidth='1px'
                pb={1}
                borderColor={'cardBorder'}
                fontWeight='light'
              >
                Near Pool #{Number(session.id) + 1} {isEnded ? '(Ended)' : ''}
              </Text>
              <Text fontSize={'x-large'} fontWeight={500}>
                Total Deposit: {formatNearAmount(session.amount)} <NearIcon />
              </Text>
              {isEnded ? (
                <Text>
                  End Date: {new Date(session.end / 1000000).toLocaleString()}
                </Text>
              ) : (
                <Timer expiryTimestamp={session.end / 1000000} />
              )}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {player && (
              <>
                <Text fontSize={'large'} fontWeight={500} color={'mainGreen'}>
                  My Deposit: {formatNearAmount(player.amount)}{' '}
                  <NearIcon width='56px' />
                </Text>
                {chance && Number(chance) ? (
                  <Text
                    fontSize={'medium'}
                    fontWeight={500}
                    color={'mainGreen'}
                  >
                    Chance to win: {Number(chance).toFixed(2)} %
                  </Text>
                ) : null}
              </>
            )}

            {winners?.length && (
              <Text fontSize={'large'} fontWeight={500} color={'mainGreen'}>
                Winner: {winners.join(', ')}
              </Text>
            )}

            <Text>
              Start Date: {new Date(session.start / 1000000).toLocaleString()}
            </Text>

            <Text>Players: {players}</Text>

            {!session.isFinalized && accumulatedReward && (
              <Text>
                Accumulated Prize:{' '}
                <Text as='span' color='mainGreen'>
                  ~{formatNearAmount(accumulatedReward, 6)}{' '}
                  <NearIcon width='48px' />
                </Text>
              </Text>
            )}

            {!session.isFinalized && expectedFinalReward && (
              <Text>
                Expected Prize:
                <Text ml={1} as='span' fontWeight='bold' color='mainGreen'>
                  ~{formatNearAmount(expectedFinalReward, 6)}{' '}
                  <NearIcon width='48px' />
                </Text>
              </Text>
            )}

            {session?.reward > 0 && (
              <Text>
                Final Reward: {formatNearAmount(session.reward, 6)}{' '}
                <NearIcon width='48px' />
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {isEnded ? (
        <>
          <Button isDisabled w={'full'} borderRadius={'32px'}>
            Game is ended
          </Button>

          {session.isFinalized && player && (
            <>
              {isWinner && 'You are a winner!'}
              <Button
                borderRadius={'32px'}
                w={'full'}
                onClick={onClaim}
                isDisabled={player?.isClaimed}
              >
                {player.isClaimed ? 'Already Claimed' : 'Claim'}
              </Button>
            </>
          )}
        </>
      ) : (
        <HStack w={'full'}>
          <Button
            onClick={onStake}
            w={'full'}
            borderRadius={'32px'}
            color='mainGreen'
            py={6}
          >
            {player ? 'Stake More' : 'Enter the game'}
          </Button>

          {player && (
            <Button
              variant={'ghost'}
              onClick={onCashout}
              p={6}
              borderRadius={'32px'}
            >
              Cash out
            </Button>
          )}
        </HStack>
      )}
    </VStack>
  )
}
