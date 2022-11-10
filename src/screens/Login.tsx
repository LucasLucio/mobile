import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast} from 'native-base';
import { FontAwesome } from '@expo/vector-icons'

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { InputCheck, InputPassword, InputText } from '../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../services/api';
import React from 'react';
import { Dialog, DialogInform } from '../components/AlertDialog';
import { ToastError } from '../components/Toast';

const schemaLogin = yup.object({
  email:
    yup.string()
    .required('Informe seu E-mail.')
    .email("E-mail inválido."),
  senha:
    yup.string()
    .required('Informa a Senha.')
})

export function Login() {

  const toast = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogConfirmText, setDialogConfirmText] = React.useState('');
  const [dialogBody, setDialogBody] = React.useState('');
  const dialogRef = React.useRef(null);
  function displayDialog(title : string, body: string, confirmText: string){
    setDialogOpen(true);
    setDialogTitle(title);
    setDialogBody(body)
    setDialogConfirmText(confirmText)
  }
  function dialogReturn(res: boolean){
    console.log(res);
  }




  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaLogin)
  });
  
  async function login(data){
    //const response = await api.post('/auth/user',data);

    displayDialog('AAAAAAAA', 'AAAAAAA', 'AAAAAAAAA');
    toast.show({
      render: () => {
        return <ToastError text='Teste' status='success' />;
      },
      placement: 'top'
    });
  }

    return (
        <Center flex={1} bgColor="white" padding={8}>

          <DialogInform title={dialogTitle} body={dialogBody} confirmText={dialogConfirmText} isOpen={dialogOpen} cancelRef={dialogRef} onConfirm={() => dialogReturn(true)} leastDestructiveRef={dialogRef}/>
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

          <InputCheck 
            name='Acesso Fácil'
            value='lembrar'
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
  
  