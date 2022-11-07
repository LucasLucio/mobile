import { Center, Text, Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../hooks/useAuth'

import Logo from '../assets/logo.svg';
import { Button } from '../components/button';
import { InputCheck, InputPassword, InputText } from '../components/Input';


export function SignIn() {
    const { login, user } = useAuth();
    return (
        <Center flex={1} bgColor="gray.100" padding={8}>
          <Logo 
            width={500}
            height={80}
          />
          <InputText
            name='Email'
            InputLeftElement={<Icon as={<FontAwesome name="envelope" />} size={5} ml="2" color="muted.400" marginLeft={5} />}
            marginTop={19}
          />
          <InputPassword
            name='Email'
            InputLeftElement={<Icon as={<FontAwesome name="lock" />} size={5} ml="2" color="muted.400" marginLeft={5} />}
          />
          <InputCheck 
            name='Acesso Fácil'
            value='lembrar'
          />
          <Button 
            title='Acessar'
            mt={10}
            mb={1}
            onPress={login}
          />
          <Button 
            title='Cadastrar'
            type='SECONDARY'
          />
          <Text
            color='blue.500'
            fontWeight={'bold'}
          >
            Esqueceu sua senha?
          </Text>


        </Center>
    );
  }
  
  