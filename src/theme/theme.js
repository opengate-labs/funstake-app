import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { switchTheme } from './Switch'

const theme = extendTheme({
  semanticTokens: {
    colors: {
      cardBg: {
        default: 'linear-gradient(0deg, #FFFFFF, #F4F4F4)',
        _dark: 'linear-gradient(0deg, #343434, #1f1f1f)',
      },
      cardBorder: {
        default: '#E5E5E5',
        _dark: '#3e3b3b',
      },
      mainGreen: {
        default: '#A0C800',
        _dark: '#DBFE52',
      },
      mainBg: {
        default: '#F8F8F8',
        _dark: '#1f1f1f',
      },
    },
  },
  fonts: {
    heading: `'Oswald', sans-serif`,
    body: `'Oswald', sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('white', '#1f1f1f')(props),
      },
      '*::-webkit-scrollbar': {
        display: 'none',
      },
    }),
  },
  components: {
    Switch: switchTheme,
  },
})

export default theme
