import { Center, Text, Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../hooks/useAuth'

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { InputCheck, InputPassword, InputText } from '../components/Input';


export function Perfil() {
    const { login, user } = useAuth();
    return (
        <Center flex={1} bgColor="gray.100" padding={8}>
          <Text
            color='blue.500'
            fontWeight={'bold'}
          >
            Localizações
          </Text>


        </Center>
    );
  }
  
  