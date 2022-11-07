import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    gray: {
      950: '#09090A',
      900: '#121214',
      800: '#202024',
      600: '#323238',
      300: '#8D8D99',
      200: '#ececec',
      100: '#EEEEEE',
    },
    green: {
      500: '#62A053'
    },
    blue: {
        900: '#232D42',
        800: '#343d4f',
        500: '#3A57E8',
        400: '#536ded',
        300: '#c4ccf8',

    },
    yellow: {
      500: '#F7DD43',
      600: '#BBA317',
    },
    red: {
      500: '#BC0000',
    },
    white: '#FFFFFF'
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
    medium: 'Roboto_500Medium'
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  sizes: {
    14: 56
  }
});