import {
  Box,
  Text,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Accordion,
} from '@chakra-ui/react'
import { COIN_SYMBOLS, COIN_DECIMALS } from '@/constants/coins'
import { formatAmount } from '@/utils/near/formatAmount'
import FormattedDate from './FormattedDate'
import Timer from './Timer'

export default function SessionDetails({
  session,
  player,
  chance,
  winners,
  accumulatedReward,
  coin,
}) {
  const CoinIcon = COIN_SYMBOLS[coin]
  const coinDecimal = COIN_DECIMALS[coin]
  const isEnded = session.end < Date.now() * 1000000

  return (
    <Accordion allowToggle w='full' reduceMotion>
      <AccordionItem
        w='full'
        borderTopWidth={0}
        borderBottomWidth={'0 !important'}
      >
        <AccordionButton w='full' _hover={{}}>
          <Box as='span' flex='1' textAlign='left'>
            <Text fontSize={'x-large'} fontWeight={500}>
              Total Deposit: {formatAmount(session.amount, coinDecimal, 3)}{' '}
              <CoinIcon />
            </Text>
            {isEnded ? (
              <Text>
                Ended At: <FormattedDate date={session.end} />
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
                <Text fontSize={'medium'} fontWeight={500} color={'mainGreen'}>
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

          {session.start && (
            <Text>
              Started: <FormattedDate date={session.start} />
            </Text>
          )}

          <Text>Players: {session.players?._keys.length}</Text>

          {!session.isFinalized &&
          accumulatedReward &&
          session.players?._keys.length ? (
            <Text>
              Accumulated Prize:{' '}
              <Text as='span' color='mainGreen'>
                ~{formatAmount(accumulatedReward, coinDecimal, 6)}{' '}
                <CoinIcon width='48px' />
              </Text>
            </Text>
          ) : null}

          {session?.reward > 0 && (
            <Text>
              Final Reward: {formatAmount(session.reward, coinDecimal, 6)}{' '}
              <CoinIcon width='48px' />
            </Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
