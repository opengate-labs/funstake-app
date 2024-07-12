import { NetworkId, WALLETS_PREFIX } from '@/config'

export const finalizeAuthWithHereWallet = ({ accountId }) => {
  if (!accountId) {
    throw new Error("Can't finalize Auth, No accountId provided")
  }

  const hereWalletPrefix = WALLETS_PREFIX['here-wallet']
  const hereWalletStorage = JSON.parse(localStorage.getItem(hereWalletPrefix))
  const accessKey = hereWalletStorage[NetworkId].accounts[accountId]

  localStorage.setItem(
    `${hereWalletPrefix}${accountId}:${NetworkId}`,
    accessKey,
  )
}
