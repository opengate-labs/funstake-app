import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Button,
  Switch,
  useColorMode,
} from '@chakra-ui/react'
import { useNear } from '../hooks'

export default function MobileMenu({ isOpen, onClose }) {
  const { accountId, signIn, signOut } = useNear()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Drawer isOpen={isOpen} placement='bottom' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent background='mainBg'>
          <DrawerHeader display='flex' justifyContent='space-between'>
            <Text>{accountId}</Text>
            <Button onClick={signOut}>Disconnect</Button>
          </DrawerHeader>

          <DrawerBody>
            <Switch
              cursor='pointer'
              onChange={toggleColorMode}
              isChecked={colorMode === 'dark'}
            >
              Toggle Dark Mode
            </Switch>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
