import { Flex, HStack, Text, Tooltip } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import ContractIcon from '@/icons/ContractIcon'
import StatusBadge from './StatusBadge'

export default function SessionHeader({
  session,
  coin,
  contractId,
  yieldPercentage,
  isEnded,
}) {
  const { colorMode } = useColorMode()
  const NEAR_BLOCKS_URL = `${import.meta.env.VITE_APP_NEAR_BLOCKS_BASE_URL}/${contractId}`

  return (
    <HStack
      w='full'
      borderBottomWidth='1px'
      borderColor={'cardBorder'}
      fontWeight='light'
      justifyContent='space-between'
      alignItems={'center'}
      pb={2}
    >
      <Tooltip label='View in Near Blocks'>
        <Flex
          alignItems='center'
          cursor='pointer'
          as={'a'}
          target='_blank'
          href={NEAR_BLOCKS_URL}
          background='cardBorder'
          py={1}
          px={2}
          borderRadius={'36px'}
        >
          <ContractIcon color={colorMode === 'light' ? 'black' : 'white'} />
          <Text mx={2}>
            {coin.toUpperCase()} Pool #{Number(session.id) + 1}{' '}
          </Text>
          <StatusBadge isEnded={isEnded} />
        </Flex>
      </Tooltip>

      {yieldPercentage && (
        <Text color={'mainGreen'}>APY {yieldPercentage}%</Text>
      )}
    </HStack>
  )
}
