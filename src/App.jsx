import { ChakraProvider } from '@chakra-ui/react'
import { WalletSelectorProvider } from '@/providers/WalletSelectorProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ModalProvider from '@/providers/ModalProvider'
import theme from './theme/theme'
import { BrowserRouter } from 'react-router-dom'
import Pages from './pages'
import OpenInTGButton from './components/OpenInTGButton'
import Layout from './components/Layout'

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <WalletSelectorProvider>
            <ModalProvider>
              <Layout>
                <Pages />
              </Layout>
              <OpenInTGButton />
            </ModalProvider>
          </WalletSelectorProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  )
}

export default App
