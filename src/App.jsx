import { ChakraProvider, theme } from '@chakra-ui/react'
import Home from '@/pages/Home'
import { WalletSelectorProvider } from '@/providers/WalletSelectorProvider'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <WalletSelectorProvider>
        <Home />
      </WalletSelectorProvider>
    </ChakraProvider>
  )
}

export default App
