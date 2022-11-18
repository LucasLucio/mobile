import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast, HStack, ScrollView} from 'native-base';

import Pin from '../../assets/pin.svg';
import { Button } from '../../components/Button';
import { InputText } from '../../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useState } from 'react';
import { ViaCep } from '../../utils/ViaCep';
import axios from 'axios';
import { Toast } from '../../components/Toast';

const schemaAccount = yup.object({
  cep: yup.string().required('CEP é obrigatório'),
  numeroEdificio: yup.string().required('Número do edifício é obrigatório.'),
})

export function Endereco({route, navigation}) {

  let  accountRegister = route.params;
  const toast = useToast();

  const [municipio, setMunicipio] = useState('');
  const [logradouro, setLogradouro] = useState('');

  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaAccount)
  });
  
  async function buscaCep(cep){
    try {            
      if(cep.length == 8){
        axios.get(
            `https://viacep.com.br/ws/${cep}/json`,
          ).then((res) => {
            if(res.data.erro == true){
              toast.show({
                render: () => {
                  return <Toast text={'CEP Inválido'} status='error' />;
                },
                placement: 'top'
              });
            }else{
              setMunicipio(res.data.localidade + ' - ' + res.data.uf);         
              setLogradouro(res.data.logradouro); 
            }
                 
          }).catch((error)=>{
            toast.show({
              render: () => {
                return <Toast text={'Falha ao buscar o CEP'} status='error' />;
              },
              placement: 'top'
            });
          });
      }else{
        setMunicipio('');         
        setLogradouro('');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function endereco(data){
    accountRegister.endereco = {
      cep: data.cep,
      numeroEdificio: data.numeroEdificio,
    }

    navigation.navigate('Veiculo', accountRegister)
  }

    return (
        <Center flex={1} bgColor="white" padding={8}>

          <Pin 
            height={150}
          />

          <Controller
            control={control}
            name='cep'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='CEP'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.cep ? errors.cep.message.toString() : undefined}
                maxLength={8}
                onEndEditing={async (e: any) => 
                  {
                    await buscaCep(e.nativeEvent.text)
                  }
                }
              />
            )}
          />

          <InputText
            name='Municipio'
            marginTop={19}
            value={municipio}
            isDisabled={true}
          />

          <InputText
            name='Logradouro'
            marginTop={19}
            value={logradouro}
            isDisabled={true}
          />

          <Controller
            control={control}
            name='numeroEdificio'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Numero do Edifício'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.numeroEdificio ? errors.numeroEdificio.message.toString() : undefined}
                maxLength={8}
              />
            )}
          />

          <Button 
            title='Próximo'
            mt={10}
            mb={1}
            onPress={handleSubmit((endereco))}
          />
        </Center>
    );
  }
  
  