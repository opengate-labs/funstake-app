import { useParams } from 'react-router-dom'

export default function PoolSinge() {
  const { coin, id } = useParams()
  return (
    <div>
      PoolSinge: {coin} {id}
    </div>
  )
}
