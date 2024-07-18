export const NetworkId = import.meta.env.VITE_APP_NETWORK_ID
export const CONTRACTS = import.meta.env.VITE_APP_CONTRACT_IDS.split(' ')

export const WALLETS_PREFIX = {
  'meteor-wallet': '_meteor_wallet',
  'my-near-wallet': 'near-api-js:keystore:',
  'here-wallet': 'herewallet:keystore',
}
