import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import CreateLogo from '../../assets/createLogo.svg';
import { Button } from '../../components/Button';
import { InputCheck, InputPassword, InputText } from '../../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../../services/api';
import React from 'react';
import { Dialog, DialogInform } from '../../components/AlertDialog';
import { Toast } from '../../components/Toast';
import { AppRoutes } from '../../routes/app.routes';
import { Routes } from '../../routes';

const schemaAccount = yup.object({
  email:
    yup.string()
    .required('Informe seu E-mail.')
    .email("E-mail inválido."),
  senha:
    yup.string()
    .required('Informa a Senha.'),
  confirmacaoSenha: yup.string()
     .oneOf([yup.ref('senha'), null], 'As senhas não conferem')
})

export function Account({navigation}) {

  const toast = useToast();

  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaAccount)
  });
  
  async function account(data){
    navigation.navigate('Profile', data)
  }

    return (
        <Center flex={1} bgColor="white" padding={8}>

            <CreateLogo 
            width={800}
            height={90}
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
            name='confrimacaoSenha'
            render={ ({field: {onChange, value}}) => (
              <InputPassword
                name='Confirmação de Senha'
                InputLeftElement={<Icon as={<FontAwesome name="lock" />} size={5} ml="2" color="muted.400" marginLeft={5} />}
                onChangeText={onChange}
                value={value}
                error={errors.confirmacaoSenha ? errors.confirmacaoSenha.message.toString() : undefined}
              />
            )}
          />

          <Button 
            title='Próximo'
            mt={10}
            mb={1}
            onPress={handleSubmit(account)}
          />
        </Center>
    );
  }
  
  