import { Flex, useColorMode, Image, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const CoinItem = ({ isEnabled, icon, name, id }) => {
  const { colorMode } = useColorMode()

  return (
    <Flex
      w='200px'
      h='200px'
      align='center'
      justify='space-between'
      borderWidth='1px'
      borderColor='cardBorder'
      p={4}
      borderRadius={10}
      cursor={isEnabled ? 'pointer' : 'not-allowed'}
      opacity={isEnabled ? 1 : 0.5}
      flexDir='column'
      as={Link}
      to={`/p/${id}`}
    >
      <Flex
        align='center'
        background={colorMode === 'light' ? '#19202D' : 'transparent'}
        p={2}
        borderRadius={'100%'}
        mb={2}
      >
        <Image src={icon} alt={name} width='32px' />
      </Flex>
      <Heading
        color={colorMode === 'light' ? '#19202D' : '#DBFE52'}
        fontSize='4xl'
      >
        {name} <br />
        Pools
      </Heading>
    </Flex>
  )
}
