import { Image, useColorMode } from '@chakra-ui/react'

export default function NearIcon({ width = '62px' }) {
  const { colorMode } = useColorMode()
  return (
    <Image
      display='inline'
      src={
        colorMode === 'light' ? '/near-logo-dark.svg' : '/near-logo-light.svg'
      }
      alt='NEAR Protocol'
      w={width}
    />
  )
}
