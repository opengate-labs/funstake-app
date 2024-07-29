import { Button, Text, HStack } from '@chakra-ui/react'

export default function SessionActions({
  session,
  accountId,
  player,
  isEnded,
  winners,
  onStake,
  onClaim,
  onCashout,
}) {
  const isWinner = winners?.includes(accountId)

  if (session.isFinalized && player) {
    return (
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
    )
  }

  if ((session.isFinalized && !player) || (isEnded && !session.isFinalized)) {
    return (
      <Button isDisabled w={'full'} borderRadius={'32px'}>
        Game is ended
      </Button>
    )
  }

  if (!isEnded && !session.isFinalized) {
    return (
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
    )
  }

  return null
}
