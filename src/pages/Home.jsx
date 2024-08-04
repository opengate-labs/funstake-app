import { Container, Wrap } from '@chakra-ui/react'
import { COINS_LIST } from '@/constants/coins'
import { CoinItem } from '@/components/CoinItem'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const isTelegram = !!window.Telegram?.WebApp.initData
    if (isTelegram) {
      window.Telegram.WebApp.BackButton.hide()
    }
  }, [])
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
