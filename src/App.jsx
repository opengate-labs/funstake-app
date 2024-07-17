import { ChakraProvider } from '@chakra-ui/react'
import Home from '@/pages/Home'
import { WalletSelectorProvider } from '@/providers/WalletSelectorProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ModalProvider from '@/providers/ModalProvider'
import theme from './theme/theme'

const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <WalletSelectorProvider>
          <ModalProvider>
            <Home />
          </ModalProvider>
        </WalletSelectorProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
