import { Flex, Image } from '@chakra-ui/react'
import { useWalletSelector } from '../hooks'

export default function OpenInTGButton() {
  const { inTelegramApp } = useWalletSelector()
  if (inTelegramApp) {
    return null
  }
  return (
    <Flex
      pos='fixed'
      bottom={0}
      background='#009eeb'
      textAlign='center'
      w='full'
      color={'white'}
      py={4}
      justify='center'
      align='center'
      as={'a'}
      href='https://t.me/funstake_bot'
      target='_blank'
      fontWeight='bold'
    >
      Open in Telegram Mini App <Image src='/tg.svg' h={6} ml={2} />
    </Flex>
  )
}
