import NearIcon from '@/components/NearIcon'
import UsdcIcon from '@/components/UsdcIcon'
import UsdtIcon from '@/components/UsdtIcon'

export const COINS = {
  near: 'near',
  usdt: 'usdt',
  usdc: 'usdc',
}

export const COIN_DECIMALS = {
  [COINS.near]: 24,
  [COINS.usdt]: 6,
  [COINS.usdc]: 6,
}

export const COIN_SYMBOLS = {
  [COINS.near]: NearIcon,
  [COINS.usdt]: UsdtIcon,
  [COINS.usdc]: UsdcIcon,
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
  {
    name: 'USDC',
    id: COINS.usdc,
    icon: '/icons/usdc.svg',
    isEnabled: true,
  },
  { name: 'ETH', id: 'eth', icon: '/icons/eth.svg' },
  {
    name: 'wBTC',
    id: 'wbtc',
    icon: '/icons/wbtc.svg',
  },
  {
    name: 'AURORA',
    id: 'aurora',
    icon: '/icons/aurora.svg',
  },
]
