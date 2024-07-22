import {
  Button,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import { useNear } from '../hooks'
import Logo from '@/icons/Logo'
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import MobileMenu from './MobileMenu'

const w = window.innerWidth
export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
      <Link to='/'>
        <Logo textColor={colorMode === 'light' ? '#1A202C' : '#fff'} />
      </Link>
      <Flex align='center'>
        {accountId && w < 500 ? (
          <>
            <IconButton onClick={onOpen}>
              <HamburgerIcon />
            </IconButton>
            <MobileMenu isOpen={isOpen} onClose={onClose} />
          </>
        ) : (
          <>
            {' '}
            <IconButton mr={2} onClick={toggleColorMode} borderRadius='36px'>
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
          </>
        )}
      </Flex>
    </Flex>
  )
}
