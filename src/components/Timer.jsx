import { Flex, Text } from '@chakra-ui/react'
import { useTimer } from 'react-timer-hook'

export function Timer({ expiryTimestamp, ...props }) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
  })

  return (
    <Flex fontSize='26px'>
      <Text color='mainGreen' {...props}>
        Until End{' '}
        {days ? (
          <span>
            {days} Day{days > 1 && 's'}{' '}
          </span>
        ) : null}
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </Text>
    </Flex>
  )
}
