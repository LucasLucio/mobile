import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { AppRoutes } from './app.routes';
import { AppExternal } from './app-ext.routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from 'native-base';
import { Toast } from '../components/Toast';

export function Routes(){

    const toast = useToast();

    const [login, setLogin] = useState(false);
    async function getToken(){
        try {
            const loginValue = await AsyncStorage.getItem('@login');
            let dadoslogin = JSON.parse(loginValue);
            if(dadoslogin.lembrar === true){
                await refreshLogin(dadoslogin.email, dadoslogin.senha);
            }
        } catch(e) {
            setLogin(false);
        }
    }

    async function refreshLogin(email: string, senha: string){
        const data = {
            email: email,
            senha: senha
        }
        const response = await api.post('/auth/user',data)
        .then(async (response) => {
            setLogin(true);
            console.log(response.data.token);
        })
        .catch((error) => {
          toast.show({
            render: () => {
              return <Toast text={error.response.data.message} status='error' />;
            },
            placement: 'top'
          });
        });
        
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