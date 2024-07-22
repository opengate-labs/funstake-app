import { COINS } from "@/constants/coinList"

export const NetworkId = import.meta.env.VITE_APP_NETWORK_ID

export const NEAR_CONTRACTS = import.meta.env.VITE_APP_NEAR_CONTRACT_IDS.split(' ')
export const USDT_CONTRACTS = import.meta.env.VITE_APP_USDT_CONTRACT_IDS.split(' ')

export const CONTRACTS = {
  [COINS.near]: NEAR_CONTRACTS,
  [COINS.usdt]: USDT_CONTRACTS,
}

export const WALLETS_PREFIX = {
  'meteor-wallet': '_meteor_wallet',
  'my-near-wallet': 'near-api-js:keystore:',
  'here-wallet': 'herewallet:keystore',
}
