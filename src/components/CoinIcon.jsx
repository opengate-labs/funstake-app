import { Box, Flex, Image, Text, useColorMode } from '@chakra-ui/react'

export default function CoinIcon({ coin, width = '62px', withName = false }) {
  const { colorMode } = useColorMode()
  const src = `/icons/${coin}.svg`

  if (withName) {
    return (
      <Box display='inline-block'>
        <Flex
          alignItems='center'
          background={colorMode === 'dark' ? 'transparent' : '#1f1f1f'}
          px={1}
          borderRadius='10px'
        >
          <Image
            display='inline'
            userSelect={'none'}
            draggable={false}
            src={src}
            alt={`${coin} Coin`}
            w={width}
            mr={1}
          />
          <Text as='span' color={'#DBFE52'}>
            {coin.toUpperCase()}
          </Text>
        </Flex>
      </Box>
    )
  }
  return (
    <Image
      display='inline'
      userSelect={'none'}
      draggable={false}
      src={src}
      alt={`${coin} Coin`}
      w={width}
    />
  )
}
