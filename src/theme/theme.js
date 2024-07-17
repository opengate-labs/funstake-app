import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  semanticTokens: {
    colors: {
      cardBg: {
        default: 'linear-gradient(0deg, #FFFFFF, #F4F4F4)',
        _dark: 'linear-gradient(0deg, #343434, #111308)',
      },
      cardBorder: {
        default: '#E5E5E5',
        _dark: '#585858',
      },
      mainGreen: {
        default: '#A0C800',
        _dark: '#DBFE52',
      },
    },
  },
  fonts: {
    heading: `'Oswald', sans-serif`,
    body: `'Oswald', sans-serif`,
  },
})

export default theme
