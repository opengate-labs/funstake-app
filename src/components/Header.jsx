import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  useColorMode,
} from '@chakra-ui/react'
import { useNear } from '../hooks'
import Logo from '@/icons/Logo'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function Header() {
  const { accountId, signIn, signOut } = useNear()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      align='center'
      w='full'
      justify='space-between'
      px={4}
      py={3}
      borderBottomWidth='1px'
    >
      <Logo textColor={colorMode === 'light' ? '#1A202C' : '#fff'} />
      <Flex align='center'>
        <IconButton mr={2} onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
        {accountId && (
          <Heading mr={2} fontSize='sm'>
            {accountId}
          </Heading>
        )}
        <Button onClick={accountId ? signOut : signIn}>
          {accountId ? 'Disconnect' : 'Connect Wallet'}
        </Button>
      </Flex>
    </Flex>
  )
}
