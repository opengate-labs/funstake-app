import { ChakraProvider } from '@chakra-ui/react'
import { WalletSelectorProvider } from '@/providers/WalletSelectorProvider'
import { QueryClient } from '@tanstack/react-query'
import ModalProvider from '@/providers/ModalProvider'
import theme from './theme/theme'
import { BrowserRouter } from 'react-router-dom'
import Pages from './pages'
import OpenInTGButton from './components/OpenInTGButton'
import Layout from './components/Layout'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <WalletSelectorProvider>
            <ModalProvider>
              <Layout>
                <Pages />
              </Layout>
              <OpenInTGButton />
            </ModalProvider>
          </WalletSelectorProvider>
        </PersistQueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  )
}

export default App
