import { Container, Wrap } from '@chakra-ui/react'
import { COINS_LIST } from '@/constants/coins'
import { CoinItem } from '@/components/CoinItem'

export default function Home() {
  return (
    <Container>
      <Wrap justify='center' spacing={6}>
        {COINS_LIST.map((coin) => (
          <CoinItem
            key={coin.id}
            isEnabled={coin.isEnabled}
            icon={coin.icon}
            name={coin.name}
            id={coin.id}
          />
        ))}
      </Wrap>
    </Container>
  )
}
