import { Flex, Text } from '@chakra-ui/react'
import { useTimer } from 'react-timer-hook'

export function Timer({ expiryTimestamp, ...props }) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
  })

  return (
    <Flex fontSize='26px'>
      <Text color='mainGreen' {...props}>
        {days && <span>{days} Days </span>}
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </Text>
    </Flex>
  )
}
