import { VStack } from '@chakra-ui/react'
import SessionHeader from './SessionHeader'
import SessionDetails from './SessionDetails'
import SessionActions from './SessionActions'
import { useSessionData } from '@/hooks/useSessionData'
import { usePlayerData } from '@/hooks/usePlayerData'
import { useParams } from 'react-router-dom'
import { useNear } from '@/hooks/useNear'

export default function Session({ session, refetch }) {
  const { contractId } = session
  const { coin } = useParams()
  const { accountId } = useNear()
  const { accumulatedReward, winners, yieldPercentage, isEnded, expectedReward } =
    useSessionData({ session, coin })

  const { player, chance, onStake, onClaim, onCashout } = usePlayerData({
    session,
    refetch,
    coin,
  })

  return (
    <VStack
      mt={8}
      rounded={'md'}
      p={4}
      border={'1px solid'}
      borderColor={'cardBorder'}
      background='cardBg'
      borderRadius={'36px'}
    >
      <SessionHeader
        session={session}
        coin={coin}
        contractId={contractId}
        yieldPercentage={yieldPercentage}
        isEnded={isEnded}
      />

      <SessionDetails
        session={session}
        player={player}
        chance={chance}
        winners={winners}
        accumulatedReward={accumulatedReward}
        expectedReward={expectedReward}
        coin={coin}
      />

      <SessionActions
        accountId={accountId}
        session={session}
        player={player}
        isEnded={isEnded}
        winners={winners}
        onStake={onStake}
        onClaim={onClaim}
        onCashout={onCashout}
      />
    </VStack>
  )
}
