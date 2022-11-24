import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { InputCheck, InputPassword, InputText } from '../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../services/api';
import React from 'react';
import { Dialog, DialogInform } from '../components/AlertDialog';
import { Toast } from '../components/Toast';
import { AppRoutes } from '../routes/app.routes';
import { Routes } from '../routes';

const schemaLogin = yup.object({
  email:
    yup.string()
    .required('Informe seu E-mail.')
    .email("E-mail inválido."),
  senha:
    yup.string()
    .required('Informa a Senha.')
})

export function Login({navigation}) {

  const toast = useToast();

  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaLogin)
  });
  
  async function login(data){
    const response = await api.post('/auth/user',data)
    .then(async (response) => {
      if(data.lembrar === true){
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@login', jsonValue);
      }
      await AsyncStorage.setItem('@token', response.data.token);
      navigation.navigate('AppRoutes');
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

  async function redefinirBuscaEmail(email: string){
    if(email == '' || email == undefined){
      toast.show({
        render: () => {
          return <Toast text={'Informe um email'} status='error' />;
        },
        placement: 'top'
      });
    }
    const response = await api.get(`/usuario/meios-recuperacao/${email}`)
    .then(async (response) => {
      if(response.data){
        console.log(response.data);
        let meios = response.data;
        navigation.navigate('EmailVerify', meios);
      }
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

    return (
        <Center flex={1} bgColor="white" padding={8}>
          <Logo 
            width={500}
            height={80}
          />
          <Controller
            control={control}
            name='email'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Email'
                InputLeftElement={<Icon as={<FontAwesome name="envelope" />} size={5} ml="2" color="muted.400" marginLeft={5} />}
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.email ? errors.email.message.toString() : undefined}
                autoCapitalize='none'
              />
            )}
          />

          <Controller
            control={control}
            name='senha'
            render={ ({field: {onChange, value}}) => (
              <InputPassword
                name='Senha'
                InputLeftElement={<Icon as={<FontAwesome name="lock" />} size={5} ml="2" color="muted.400" marginLeft={5} />}
                onChangeText={onChange}
                value={value}
                error={errors.senha ? errors.senha.message.toString() : undefined}
              />
            )}
          />

          <Controller
            control={control}
            name='lembrar'
            render={ ({field: {onChange, value}}) => (
              <InputCheck 
                name='Acesso Fácil'
                value='lembrar'
                onChange={onChange}
              />
            )}
          />


          <Button 
            title='Acessar'
            mt={10}
            mb={1}
            onPress={handleSubmit(login)}
          />
          <Button 
            title='Cadastrar'
            type='SECONDARY'
            onPress={() => {navigation.navigate('AppRegister')}}
          />
          <Text
            color='blue.500'
            fontWeight={'bold'}
            onPress={async () => {
              await redefinirBuscaEmail(control._formValues.email); 
            }}
          >
            Esqueceu sua senha?
          </Text>
        </Center>
    );
  }
  
  