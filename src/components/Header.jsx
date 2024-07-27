import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'
import { useNear, useWalletSelector } from '../hooks'
import Logo from '@/icons/Logo'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import Menu from './Menu'

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { accountId, signIn, signOut } = useNear()
  const { colorMode, toggleColorMode } = useColorMode()
  const { inTelegramApp } = useWalletSelector()

  const handleColorModeChange = () => {
    localStorage.setItem('isFirstTimeChangedColorMode', 'true')
    toggleColorMode()
    if (inTelegramApp) {
      window.Telegram.WebApp.setBackgroundColor(
        colorMode !== 'dark' ? '#1f1f1f' : '#F8F8F8',
      )
      window.Telegram.WebApp.setHeaderColor(
        colorMode !== 'dark' ? '#1f1f1f' : '#F8F8F8',
      )
    }
  }

  return (
    <Flex
      zIndex={9}
      align='center'
      w='full'
      justify='space-between'
      px={4}
      py={3}
      borderBottomWidth='1px'
      pos='fixed'
      top={0}
      background={
        colorMode === 'light' ? 'rgb(255 255 255 / 60%)' : '#1719102e'
      }
      backdropFilter='blur(7px)'
    >
      <Link
        to='/'
        onClick={() => {
          if (inTelegramApp) {
            window.Telegram.WebApp.expand()
          }
        }}
      >
        <Logo textColor={colorMode === 'light' ? '#1A202C' : '#fff'} />
      </Link>
      <HStack>
        {accountId ? (
          <Heading mr={2} fontSize='sm'>
            {accountId}
          </Heading>
        ) : (
          <Button onClick={accountId ? signOut : signIn}>Connect Wallet</Button>
        )}
        <IconButton onClick={onOpen}>
          <HamburgerIcon />
        </IconButton>
      </HStack>
      <Menu
        isOpen={isOpen}
        onClose={onClose}
        handleColorModeChange={handleColorModeChange}
      />
    </Flex>
  )
}
