import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast, HStack, ScrollView} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import Truck from '../../assets/truck.svg';
import { Button } from '../../components/Button';
import { InputSelect, InputText, ValueSelect } from '../../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { ViaCep } from '../../utils/ViaCep';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Toast } from '../../components/Toast';
import { api } from '../../services/api';
const viaCep = new ViaCep();

const dayjs = require('dayjs')

const schemaAccount = yup.object({
  cep: yup.string().required('CEP é obrigatório'),
  numeroEdificio: yup.string().required('Número do edifício é obrigatório.'),
})

export function Veiculo({route, navigation}) {

  const [tiposVeiculo, setTiposVeiculo] = useState([])
  let  accountRegister = route.params;
  const toast = useToast();

  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaAccount)
  });
  
  useEffect(() => {
    async function getTiposVeiculo(){
      const response = await api.get('/veiculo/tipo-veiculo');
      var values = [];
      response.data.map(function (value, i){
        values.push({
          name: value.nome,
          value: value.id
        })
      });
      setTiposVeiculo(values);
    }
    
    getTiposVeiculo()
  },[])

  async function veiculo(data){
    accountRegister.endereco = {
      cep: data.cep,
      numeroEdificio: data.numeroEdificio,
    }

    navigation.navigate('Veiculo', accountRegister)
  }
    return (
        <Center flex={1} bgColor="white" padding={8}>

          <Truck 
            height={150}
          />

          <HStack>
            <Controller
              control={control}
              name='placa'
              render={ ({field: {onChange, value}}) => (
                <InputText
                  name='Placa'
                  marginTop={19}
                  onChangeText={onChange}
                  value={value}
                  error={errors.placa ? errors.placa.message.toString() : undefined}
                  maxLength={7}
                  size='60%'
                  autoCapitalize='characters'
                />
              )}
            />
            <Controller
              control={control}
              name='eixos'
              render={ ({field: {onChange, value}}) => (
                <InputText
                  name='Eixos'
                  marginTop={19}
                  onChangeText={onChange}
                  value={value}
                  error={errors.eixos ? errors.eixos.message.toString() : undefined}
                  maxLength={8}
                  size='40%'
                  keyboardType='numeric'
                />
              )}
            />
          </HStack>

          <Controller
              control={control}
              name='tipoVeiculo'
              render={ ({field: {onChange, value}}) => (
                <InputSelect
                  size='100%'
                  name='Tipo de Veiculo'
                  marginTop={19}
                  onValueChange={onChange}
                  selectedValue={value}
                  values={tiposVeiculo}
                  error={errors.genero ? errors.genero.message.toString() : undefined}
                />
              )}
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
            onPress={handleSubmit((veiculo))}
          />
        </Center>
    );
  }
  
  