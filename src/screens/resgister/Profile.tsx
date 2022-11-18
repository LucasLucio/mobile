import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast, HStack, ScrollView} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import Motorista from '../../assets/motorista.svg';
import { Button } from '../../components/Button';
import { InputSelect, InputText } from '../../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useState } from 'react';

const dayjs = require('dayjs')

const schemaAccount = yup.object({
  nomeCompleto: yup.string().required('Nome Completo é obrigatório.'),
  cpf: yup.string()
      .required('CPF é obrigatório.')
      .min(11, 'CPF contém no mínimo 11 caracteres.')
      .max(11, 'CPF contém no máximo 11 caracteres.'),
  dataNascimento: yup.string(),
  rg: yup.string()
      .required('RG é obrigatório.')
      .min(8, 'RG contém no mínimo 6 caracteres.')
      .max(20, 'RG contém no máximo 20 caracteres.'),
  celular: yup.string()
      .required('Seu número de celular é obrigatório.'),
  genero: yup.number().required('Gênero é obrigatório'),
  estadoCivil: yup.number().required('Estado Civil é obrigatório.'),
})

export function Profile({route, navigation}) {

  let  accountRegister = route.params;
  
  const [dataNascimento, setDate] = useState(maiorIdade());

  function maiorIdade(){
    const dia = new Date().getUTCDate();
    const mes = new Date().getMonth();
    const ano = new Date().getFullYear() - 18;
    const date = new Date(ano, mes, dia)
    return date;
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: dataNascimento,
      onChange: onChangeDate,
      mode: currentMode,
      is24Hour: true,
      maximumDate: maiorIdade()
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };



  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaAccount)
  });
  
  async function profile(data){
    accountRegister.cpf = data.cpf;
    accountRegister.dataNascimento = data.dataNascimento;
    accountRegister.rg = data.rg;
    accountRegister.celular = data.celular;
    accountRegister.genero = data.genero;
    accountRegister.estadoCivil = data.estadoCivil;

    navigation.navigate('Cnh', accountRegister)
  }

    return (
      <ScrollView 
        w='full' 
        h="80"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Center flex={1} bgColor="white" padding={8}>

            <Motorista 
            height={150}
            />

          <Controller
            control={control}
            name='nomeCompleto'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Nome Completo'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.nomeCompleto ? errors.nomeCompleto.message.toString() : undefined}
              />
            )}
          />

        <Controller
            control={control}
            name='cpf'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='CPF'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.cpf ? errors.cpf.message.toString() : undefined}
                maxLength={11}
                keyboardType='numeric'
              />
            )}
          />

          <Controller
            control={control}
            name='dataNascimento'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Data de Nascimento'
                onPressIn={showDatepicker}
                InputRightElement={<Icon as={<FontAwesome name="calendar" />} size={5} mr="2" color="muted.400" marginLeft={5} />}
                marginTop={19}
                onChangeText={onChange}
                value={dayjs(dataNascimento.toLocaleString()).format('DD/MM/YYYY')}
                error={errors.dataNascimento ? errors.dataNascimento.message.toString() : undefined}
              />
            )}
          />

          <Controller
            control={control}
            name='rg'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='RG'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.rg ? errors.rg.message.toString() : undefined}
                maxLength={20}
              />
            )}
          />

          <Controller
            control={control}
            name='celular'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Numero de Celular'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.celular ? errors.celular.message.toString() : undefined}
                maxLength={12}
                keyboardType='phone-pad'
              />
            )}
          />

          <HStack
          >
            <Controller
              control={control}
              name='genero'
              render={ ({field: {onChange, value}}) => (
                <InputSelect
                  size='50%'
                  name='Gênero'
                  marginTop={19}
                  onValueChange={onChange}
                  selectedValue={value}
                  values={[
                    {
                      name: 'Masculino',
                      value: 1
                    },
                    {
                      name: 'Feminino',
                      value: 2
                    }
                  ]}
                  error={errors.genero ? errors.genero.message.toString() : undefined}
                />
              )}
            />

            <Controller
              control={control}
              name='estadoCivil'
              render={ ({field: {onChange, value}}) => (
                <InputSelect
                  size='50%'
                  name='Esdato Cívil'
                  marginTop={19}
                  onValueChange={onChange}
                  selectedValue={value}
                  values={[
                    {
                      name: 'Solteiro(a)',
                      value: 1
                    },
                    {
                      name: 'Casado(a)',
                      value: 2
                    },
                    {
                      name: 'Divorciado(a)',
                      value: 3
                    },
                    {
                      name: 'Viúvo(a)',
                      value: 4
                    }

                  ]}
                  error={errors.estadoCivil ? errors.estadoCivil.message.toString() : undefined}
                />
              )}
            />
          </HStack>

          <Button 
            title='Próximo'
            mt={10}
            mb={1}
            onPress={handleSubmit((profile))}
          />
        </Center>
        </ScrollView>
    );
  }
  
  