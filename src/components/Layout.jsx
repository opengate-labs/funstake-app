import { Box } from '@chakra-ui/react'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <Box h='100dvh' id='AppLayout' overflowY='scroll'>
      <Header />
      <Box as='main' py={20}>
        {children}
      </Box>
    </Box>
  )
}
