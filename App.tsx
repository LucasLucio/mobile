import { NativeBaseProvider, StatusBar } from 'native-base';
import {useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold} from '@expo-google-fonts/roboto'

import { THEME } from './src/styles/theme'

import { Loading } from './src/components/Loading';
import { AuthContextProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';
import { Login } from './src/screens/Login';

export default function App() {

  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_500Medium, Roboto_700Bold})

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar 
          barStyle='dark-content'
          backgroundColor='transparent'
          translucent
        />
        {
          fontsLoaded ? <Login /> : <Loading />
        }
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

