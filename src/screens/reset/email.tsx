import { Center, Icon, useToast} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

import CreateLogo from '../../assets/createLogo.svg';
import { Button } from '../../components/Button';
import { InputCheck, InputPassword, InputText } from '../../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React from 'react';

const schemaAccount = yup.object({
  email:
    yup.string()
    .required('Informe seu E-mail.')
    .email("E-mail inválido."),
  senha: yup.string()
    .required('Senha é obrigatória.')
    .min(6, 'A senha deve conter no minímo 6 caracteres.')
    .max(12, 'A senha deve ser de 6 a 12 caracteres.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'Use combinação de letras e números.'),
  confirmacaoSenha: yup.string().required('Informe a confirmação de senha.')
     .oneOf([yup.ref('senha'), null], 'As senhas não conferem')
})

export function Account({navigation}) {


  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaAccount)
  });
  
  async function account(data){
    let accountRegister = {
      email: data.email,
      senha: data.senha,
    }
    navigation.navigate('Profile', accountRegister)
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
                keyboardType='email-address'
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
            name='confirmacaoSenha'
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
  
  