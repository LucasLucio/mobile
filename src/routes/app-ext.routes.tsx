
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { AppRoutes } from './app.routes';
import { Account } from '../screens/resgister/Account';
import { AppRegister } from './app-register.routes';
import { AppReset } from './app-reset-pass.routes';

const Stack = createStackNavigator();

export function AppExternal() {
  return (
    <Stack.Navigator  
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AppRoutes" component={AppRoutes} />
      <Stack.Screen name="AppRegister" component={AppRegister} />
      <Stack.Screen name="AppReset" component={AppReset} />
    </Stack.Navigator>
  );
}