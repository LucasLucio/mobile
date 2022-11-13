import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { AppRoutes } from './app.routes';
import { AppExternal } from './app-ext.routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Routes(){
    return (
        <NavigationContainer>
            {false ? <AppRoutes /> : <AppExternal />}
        </NavigationContainer>
    );
}