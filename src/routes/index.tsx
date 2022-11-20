import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { AppRoutes } from './app.routes';
import { AppExternal } from './app-ext.routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export function Routes(){

    const [login, setLogin] = useState(async () => {
        await getToken();
    });
    async function getToken(){
        try {
            const tokenValue = await AsyncStorage.getItem('@token')
            return tokenValue != null ? true : false;
        } catch(e) {
          return false;
        }
      }
    
    return (
        <NavigationContainer>
            {login ? <AppRoutes /> : <AppExternal />}
        </NavigationContainer>
    );
}