import { COINS_LIST } from '@/constants/coins'
import { Navigate, useParams } from 'react-router-dom'

export default function CheckCoinPool({ children }) {
  const { coin } = useParams()
  const isExist = COINS_LIST.find((c) => c.id === coin)

  if (!isExist) {
    return <Navigate to='/' />
  }
  return children
}
