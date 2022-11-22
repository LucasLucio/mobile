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
import React, { useEffect, useState } from 'react';
import { Keyboard, RefreshControl } from 'react-native';
import { Toast } from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';

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

export function ProfileEdit({route, navigation}) {

  const [dataNascimento, setDate] = useState(maiorIdade());
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getUsuario();
  };

  let aux: object = {};
  const [dados, setDados] = useState(aux);

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
    Keyboard.dismiss();
  };

  const { control, handleSubmit, formState: {errors}, setValue } = useForm({
    resolver: yupResolver(schemaAccount)
  });
  
  async function getUsuario() {
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.get("/usuario/motorista", {
      headers: { Authorization: `Bearer ${tokenValue}` },
    });
    if (response.data != null) {
      setValue("nomeCompleto", response.data.pessoa.nome); 
      setValue("cpf", response.data.pessoa.cpfCnpj); 
      setValue("dataNascimento", response.data.pessoa.pessoaFisica.dataNascimento); 
      setValue("rg", response.data.pessoa.pessoaFisica.rg); 
      setValue("celular", response.data.pessoa.meioComunicacao[1].numero); 
      setValue("genero", response.data.pessoa.pessoaFisica.genero.toString()); 
      setValue("estadoCivil", response.data.pessoa.pessoaFisica.estadoCivil.toString()); 
      setDate(new Date(response.data.pessoa.pessoaFisica.dataNascimento))
      setDados(response.data);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function carregaDados() {
      await getUsuario();
    }
    carregaDados();
  }, []);


  async function profile(data){
    let accountEdit = {
      nomeCompleto: data.nomeCompleto,
      dataNascimento: dayjs(dataNascimento.toLocaleString()).format('DD/MM/YYYY'),
      rg: data.rg,
      celular: data.celular,
      genero: data.genero,
      estadoCivil: data.estadoCivil,
    }
    navigation.navigate('CnhEdit', {accountEdit, dados})
  }

    return (
      <ScrollView 
        w='full' 
        h="80"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Center flex={1} bgColor="white" padding={8}
          style={{
            bottom: '5%'
          }}
          mt={10}
        >

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
                isDisabled={true}
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
  
  