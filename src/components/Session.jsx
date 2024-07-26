import {
  cashout,
  claim,
  getAccumulatedReward,
  getYieldPercentage,
  stake,
} from '@/actions'
import { getPlayer, getPlayerChance, getSessionWinners } from '@/actions/common'
import { COIN_DECIMALS, COIN_SYMBOLS } from '@/constants/coins'
import { useNear } from '@/hooks'
import { useModal } from '@/providers/ModalProvider'
import { formatAmount } from '@/utils/near/formatAmount'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Timer } from './Timer'

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

  const { data: yieldPercentage } = useQuery({
    queryKey: ['yield_percentage', sessionId, coin],
    queryFn: () =>
      getYieldPercentage({
        viewMethod,
        sessionContractId: session.contractId,
        coin,
      }),
    enabled: !!sessionId && !!coin,
  })

  const isWinner = winners?.includes(accountId)
  const players = session?.players?._keys.length
  const CoinIcon = COIN_SYMBOLS[coin]
  const coinDecimal = COIN_DECIMALS[coin]

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
              <HStack
                w='full'
                borderBottomWidth='1px'
                borderColor={'cardBorder'}
                fontWeight='light'
                justifyContent='space-between'
                alignItems={'center'}
              >
                <Text pb={1}>
                  {coin.toUpperCase()} Pool #{Number(session.id) + 1}{' '}
                  {isEnded ? '(Ended)' : ''}
                </Text>

                {yieldPercentage && (
                  <Text color={'mainGreen'}>APY {yieldPercentage}%</Text>
                )}
              </HStack>
              <Text fontSize={'x-large'} fontWeight={500}>
                Total Deposit: {formatAmount(session.amount, coinDecimal)}{' '}
                <CoinIcon />
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
                  My Deposit: {formatAmount(player.amount, coinDecimal)}{' '}
                  <CoinIcon />
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
                  ~{formatAmount(accumulatedReward, coinDecimal, 6)}{' '}
                  <CoinIcon width='48px' />
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
                Final Reward: {formatAmount(session.reward, coinDecimal)}{' '}
                <CoinIcon />
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {session.isFinalized && player && (
        <>
          {isWinner ? (
            <Text>
              You are a winner!{' '}
              <Text fontSize={24} as='span'>
                &#127881;
              </Text>
            </Text>
          ) : (
            'You Lose!'
          )}
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

      {((session.isFinalized && !player) ||
        (isEnded && !session.isFinalized)) && (
        <Button isDisabled w={'full'} borderRadius={'32px'}>
          Game is ended
        </Button>
      )}

      {!isEnded && !session.isFinalized && (
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
