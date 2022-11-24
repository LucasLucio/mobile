
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { AppRoutes } from './app.routes';
import { Account } from '../screens/resgister/Account';
import { AppRegister } from './app-register.routes';
import { Email } from '../screens/reset/email';
import { CodeInput } from '../screens/reset/code';
import { Pass } from '../screens/reset/pass';

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
      <Stack.Screen name="EmailVerify" component={Email}/>
      <Stack.Screen name="CodeInput" component={CodeInput} />
      <Stack.Screen name="Pass" component={Pass} />
    </Stack.Navigator>
  );
}