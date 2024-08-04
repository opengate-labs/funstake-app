import { COINS_LIST } from '@/constants/coins'
import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

export default function CheckCoinPool({ children }) {
  const { coin } = useParams()
  const isExist = COINS_LIST.find((c) => c.id === coin)

  useEffect(() => {
    if (isExist) {
      const isTelegram = !!window.Telegram?.WebApp.initData
      if (isTelegram) {
        window.Telegram.WebApp.BackButton.show()
      }
    }
  }, [isExist])
  if (!isExist) {
    return <Navigate to='/' />
  }
  return children
}
