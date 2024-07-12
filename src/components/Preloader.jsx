import { AbsoluteCenter, Box, Spinner } from '@chakra-ui/react'

export const Preloader = () => {
  return (
    <Box
      zIndex={11}
      w={'100%'}
      h={'100%'}
      left={0}
      top={0}
      position={'fixed'}
      bg={'white'}
    >
      <AbsoluteCenter>
        <Spinner size={'xl'} />
      </AbsoluteCenter>
    </Box>
  )
}
