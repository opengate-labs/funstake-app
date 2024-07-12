import { Button, Flex, Heading } from '@chakra-ui/react'
import { useNear } from '../hooks'

export default function Header() {
  const { accountId, signIn, signOut } = useNear()

  return (
    <Flex
      align='center'
      w='full'
      justify='space-between'
      px={4}
      py={3}
      borderBottomWidth='1px'
    >
      <Heading fontSize='lg'>FUN-STAKE</Heading>
      <Flex align='center'>
        {accountId && (
          <Heading mr={2} fontSize='sm'>
            {accountId}
          </Heading>
        )}
        <Button size='sm' onClick={accountId ? signOut : signIn}>
          {accountId ? 'Disconnect' : 'Connect Wallet'}
        </Button>
      </Flex>
    </Flex>
  )
}
