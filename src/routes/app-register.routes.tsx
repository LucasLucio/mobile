
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { AppRoutes } from './app.routes';
import { Account } from '../screens/resgister/Account';
import { Profile } from '../screens/resgister/Profile';

const Stack = createStackNavigator();

export function AppRegister() {
  return (
    <Stack.Navigator  
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          shadowColor: 'white'
        }
      }}
    >
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}