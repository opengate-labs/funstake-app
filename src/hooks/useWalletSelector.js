import { useContext } from 'react'
import { WalletSelectorContext } from '@/providers/WalletSelectorProvider'

export const useWalletSelector = () => {
  const context = useContext(WalletSelectorContext)

  if (!context) {
    throw new Error(
      'useWalletSelector must be used within a WalletSelectorContextProvider',
    )
  }

  return context
}
