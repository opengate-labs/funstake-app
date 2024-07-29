import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  Button,
  Switch,
  useColorMode,
  VStack,
  Box,
  Flex,
} from '@chakra-ui/react'
import { useNear } from '../hooks'
import { BsTwitterX } from 'react-icons/bs'
import { IoWalletSharp } from 'react-icons/io5'

const w = window.innerWidth
export default function Menu({ isOpen, onClose, handleColorModeChange }) {
  const { accountId, signOut, signIn } = useNear()
  const { colorMode } = useColorMode()

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement={w > 768 ? 'right' : 'bottom'}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent background='mainBg'>
          <DrawerHeader
            display='flex'
            justifyContent={accountId ? 'space-between' : 'center'}
          >
            {accountId && <Text>{accountId}</Text>}
            <Button
              onClick={accountId ? signOut : signIn}
              w={accountId ? 'auto' : 'full'}
            >
              {accountId ? (
                'Disconnect'
              ) : (
                <Flex align='center'>
                  <Text mr={2}>Connect Wallet</Text>
                  <IoWalletSharp />
                </Flex>
              )}
            </Button>
          </DrawerHeader>

          <DrawerBody
            display='flex'
            flexDir='column'
            justifyContent='space-between'
            pt={8}
          >
            <VStack spacing={6}>
              <Switch
                w={'full'}
                mb={4}
                cursor='pointer'
                onChange={handleColorModeChange}
                isChecked={colorMode === 'dark'}
                value={colorMode === 'dark'}
              >
                Toggle Dark Mode
              </Switch>
              <VStack w='full'>
                <Button
                  w='full'
                  as='a'
                  href='https://docs.funstake.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  display='flex'
                  alignItems='center'
                  variant={'outline'}
                >
                  <Text>Docs</Text>
                </Button>
                <Button
                  w='full'
                  as='a'
                  href='https://x.com/funstake'
                  target='_blank'
                  rel='noopener noreferrer'
                  display='flex'
                  alignItems='center'
                  variant={'outline'}
                >
                  <Text mr={2}>Join us on Twitter</Text>
                  <BsTwitterX />
                </Button>
              </VStack>
            </VStack>
            <Text fontSize='small' color='gray.500' mt={8} opacity='0.7'>
              Using Telegram Bot API v{window.Telegram?.WebApp.version}
            </Text>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
