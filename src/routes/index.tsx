import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { AppRoutes } from './app.routes';
import { AppExternal } from './app-ext.routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function Routes(){

    const [login, setLogin] = useState(false);
    async function getToken(){
        try {
            const tokenValue = await AsyncStorage.getItem('@token')
            console.log(tokenValue);
            if(tokenValue != null){
                setLogin(true);
            }
        } catch(e) {
            setLogin(false);
        }
    }

    useEffect(() => {
        (async () => {
            await getToken();
        })(),false
    });
    
    return (
        <NavigationContainer>
            {login ? <AppRoutes /> : <AppExternal />}
        </NavigationContainer>
    );
}