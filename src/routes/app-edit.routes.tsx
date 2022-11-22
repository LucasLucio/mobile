
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './app.routes';
import { ProfileEdit } from '../screens/edit/ProfileEdit';
import { CnhEdit } from '../screens/edit/CnhEdit';
import { EnderecoEdit } from '../screens/edit/EnderecoEdit';

const Stack = createStackNavigator();

export function AppEdit() {
  return (
    <Stack.Navigator  
      screenOptions={{
        headerShown: true,
        headerStyle: {
          shadowColor: 'white'
        }
      }}
    >
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ title: 'Seus Dados', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="CnhEdit" component={CnhEdit} options={{ title: 'Seus Dados', headerTintColor: '#232D42' }}/>
      <Stack.Screen name="EnderecoEdit" component={EnderecoEdit} options={{ title: 'Seu Endereco', headerTintColor: '#232D42' }}/>
    </Stack.Navigator>
  );
}