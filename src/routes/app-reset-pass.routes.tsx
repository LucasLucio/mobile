
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { AppRoutes } from './app.routes';
import { Account } from '../screens/resgister/Account';
import { Profile } from '../screens/resgister/Profile';
import { Cnh } from '../screens/resgister/Cnh';
import { Endereco } from '../screens/resgister/Endereco';
import { Veiculo } from '../screens/resgister/Veiculo';
import { AppExternal } from './app-ext.routes';

const Stack = createStackNavigator();

export function AppReset() {
  return (
    <Stack.Navigator  
      screenOptions={{
        headerShown: true,
        headerStyle: {
          shadowColor: 'white'
        }
      }}
    >
      <Stack.Screen name="Account" component={Account} options={{ title: '', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Seus Dados', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="Cnh" component={Cnh} options={{ title: 'Seus Dados', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="Endereco" component={Endereco} options={{ title: 'Seu Endereco', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="Veiculo" component={Veiculo} options={{ title: 'Seu Veículo', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="LoginReturn" component={AppExternal} options={{ 
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
}