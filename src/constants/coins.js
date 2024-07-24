import NearIcon from '@/components/NearIcon'
import UsdtIcon from '@/components/UsdtIcon'

export const COINS = {
  near: 'near',
  usdt: 'usdt',
}

export const COIN_DECIMALS = {
  [COINS.near]: 24,
  [COINS.usdt]: 6,
}

export const COIN_SYMBOLS = {
  [COINS.near]: NearIcon,
  [COINS.usdt]: UsdtIcon,
}

export const COINS_LIST = [
  {
    name: 'NEAR',
    id: COINS.near,
    icon: '/icons/near.svg',
    isEnabled: true,
  },
  {
    name: 'USDT',
    id: COINS.usdt,
    icon: '/icons/usdt.svg',
    isEnabled: true,
  },
  { name: 'ETH', id: 'eth', icon: '/icons/eth.svg' },
  {
    name: 'wBTC',
    id: 'wbtc',
    icon: '/icons/wbtc.svg',
  },

  {
    name: 'USDC',
    id: 'usdc',
    icon: '/icons/usdc.svg',
  },
  {
    name: 'AURORA',
    id: 'aurora',
    icon: '/icons/aurora.svg',
  },
]
