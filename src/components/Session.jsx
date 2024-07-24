import { getPlayerChance, getSessionWinners } from '@/actions/user'
import { VStack, Text, Button, HStack, Box } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
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
  // getExpectedFinalReward,
  getPlayer,
  stake,
} from '../actions'
import { Timer } from './Timer'
import { useParams } from 'react-router-dom'
import { formatAmount } from '@/utils/near/formatAmount'
import { COINS } from '@/constants/coinList'

// TODO: simplify mutations
export default function Session({ session, refetch }) {
  const {
    viewMethod,
    accountId,
    callMethod,
    signIn,
    sendMultipleTransactions,
  } = useNear()
  const { coin } = useParams()
  const { openModal, closeModal } = useModal()
  const { data: accumulatedReward } = useQuery({
    queryKey: ['accumulated_reward', session.id, coin],
    queryFn: () =>
      getAccumulatedReward({
        viewMethod,
        sessionContractId: session.contractId,
        coin,
        sessionAmount: session.amount,
      }),
    enabled: !!session,
  })
  // const { data: expectedFinalReward } = useQuery({
  //   queryKey: ['expected_final_reward', session.id],
  //   queryFn: () =>
  //     getExpectedFinalReward({
  //       viewMethod,
  //       accountId: session.contractId,
  //       currentTimestamp: session.end,
  //     }),
  //   enabled: !!session,
  // })

  const stakeMutation = useMutation({
    mutationFn: ({ amount }) =>
      stake({
        callMethod,
        amount,
        viewMethod,
        contractId: session.contractId,
        sessionId: session.id,
        address: accountId,
        coin,
        sendMultipleTransactions,
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
      coin,
      contractId: session.contractId,
      onSubmit: async ({ toggleLoading, amount }) => {
        stakeMutation.mutate({ amount, toggleLoading })
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

  const coinDecimalsMapping = {
    [COINS.near]: 24,
    [COINS.usdt]: 6,
  }

  const coinIconsMapping = {
    [COINS.near]: <NearIcon width='56px' />,
    [COINS.usdt]: 'USDT',
  }

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
                {coin.toUpperCase()} Pool #{Number(session.id) + 1}{' '}
                {isEnded ? '(Ended)' : ''}
              </Text>
              <Text fontSize={'x-large'} fontWeight={500}>
                Total Deposit:{' '}
                {formatAmount(session.amount, coinDecimalsMapping[coin])}{' '}
                {coinIconsMapping[coin]}
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
                  My Deposit:{' '}
                  {formatAmount(player.amount, coinDecimalsMapping[coin])}{' '}
                  {coinIconsMapping[coin]}
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

            {winners?.length ? (
              <Text fontSize={'large'} fontWeight={500} color={'mainGreen'}>
                Winner: {winners.join(', ')}
              </Text>
            ) : null}

            {session.start ? (
              <Text>
                {/* TODO: better date formatting */}
                {/* Start: {format(new Date((BigInt(session.start) / 1000000n)).toString())} */}
                Start: {new Date(session.start / 1000000).toLocaleString()}
              </Text>
            ) : null}

            <Text>Players: {players}</Text>

            {!session.isFinalized && accumulatedReward && players ? (
              <Text>
                Accumulated Prize:{' '}
                <Text as='span' color='mainGreen'>
                  ~
                  {formatAmount(
                    accumulatedReward,
                    coinDecimalsMapping[coin],
                    6,
                  )}{' '}
                  {coinIconsMapping[coin]}
                </Text>
              </Text>
            ) : null}

            {/* {!session.isFinalized && expectedFinalReward && (
              <Text>
                Expected Prize:
                <Text ml={1} as='span' fontWeight='bold' color='mainGreen'>
                  ~{formatNearAmount(expectedFinalReward, 6)}{' '}
                  <NearIcon width='48px' />
                </Text>
              </Text>
            )} */}

            {session?.reward > 0 && (
              <Text>
                Final Reward:{' '}
                {formatAmount(session.reward, coinDecimalsMapping[coin])}{' '}
                {coinIconsMapping[coin]}
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
              {isWinner ? 'You are a winner!' : 'You Lose!'}
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
