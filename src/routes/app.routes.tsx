import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Home} from '../screens/Home';
import {Perfil} from '../screens/Perfil';
import {Localizacoes} from '../screens/Localizacoes';
import {House, User, MapPinLine} from 'phosphor-react-native'
import { useTheme } from 'native-base';
import { Header } from '@react-navigation/stack';
import { Previsao } from '../screens/Previsao';
import { Profile } from '../screens/resgister/Profile';
import { ProfileEdit } from '../screens/edit/ProfileEdit';
import { AppEdit } from './app-edit.routes';
import { VeiculoEdit } from '../screens/edit/VeiculoEdit';
import { AppExternal } from './app-ext.routes';

const {Navigator, Screen} = createBottomTabNavigator();

export function AppRoutes(){
    const {colors} = useTheme();
    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.blue[500],
            tabBarStyle: {
                position: 'absolute',
                height: 65
            },
            tabBarItemStyle: {
                position: 'relative',
            },
            tabBarShowLabel: false
        }}>
            <Screen 
                name='home'
                component={Home}
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <House color={color} size={35}/>
                }}
            />
            <Screen 
                name='localizacoes'
                component={Localizacoes}
                options={{
                    tabBarIcon: ({ color }) => <MapPinLine color={color} size={35}/>
                }}
            />
            <Screen 
                name='perfil'
                component={Perfil}
                options={{
                    tabBarIcon: ({ color }) => <User color={color} size={35}/>
                }}
            />
            <Screen 
                name='previsao'
                component={Previsao}

                options={{
                    title: '',
                    tabBarButton: () => null,
                }}
            />
            <Screen 
                name='edit'
                component={AppEdit}

                options={{
                    title: '',
                    tabBarButton: () => null,
                }}
            />
            <Screen 
                name='veiculo'
                component={VeiculoEdit}

                options={{
                    title: '',
                    tabBarButton: () => null,
                }}
            />
            <Screen 
                name='login'
                component={AppExternal}

                options={{
                    title: '',
                    tabBarButton: () => null,
                }}
            />
        </Navigator>
    );
}