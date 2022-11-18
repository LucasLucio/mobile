import { Center, Text, Icon, Button as ButtonNativeBase, Box, useToast, HStack, ScrollView} from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { Button } from '../../components/Button';
import { InputText } from '../../components/Input';

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useState } from 'react';

const dayjs = require('dayjs')

const schemaCnh = yup.object({
  cnh: yup.string()
  .required('CNH é obrigatório.'),
  categoria: yup.string().required('Categoria da CNH é obrigatório.'),
  dataEmissao: yup.string(),
  dataValidade: yup.string(),
});

export function Cnh({route, navigation}) {

  let  accountRegister = route.params;
  
  const [dataEmissao, setDataEmissao] = useState(new Date());
  const [dataValidade, setDataValidade] = useState(new Date());

  const onChangeDataEmissao = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDataEmissao(currentDate);
  };
  const onChangeDataValidade = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDataValidade(currentDate);
  };

  const showModeEmissao = (currentMode) => {
    DateTimePickerAndroid.open({
      value: dataEmissao,
      onChange: onChangeDataEmissao,
      mode: currentMode,
      is24Hour: true,
      maximumDate: new Date()
    });
  };

  const showModeValidade = (currentMode) => {
    DateTimePickerAndroid.open({
      value: dataValidade,
      onChange: onChangeDataValidade,
      mode: currentMode,
      is24Hour: true,
      minimumDate: new Date()
    });
  };

  const showDatepickerEmissao = () => {
    showModeEmissao('date');
  };
  const showDatepickerValidade = () => {
    showModeValidade('date');
  };



  const { control, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemaCnh)
  });
  
  async function cnh(data){
    accountRegister.cnh = data.cnh;
    accountRegister.categoria = data.categoria;
    accountRegister.dataEmissao = data.dataEmissao;
    accountRegister.dataValidade = data.dataValidade;

    navigation.navigate('Endereco', accountRegister)
  }

    return (
        <Center flex={1} bgColor="white" padding={8}>
          <Controller
            control={control}
            name='cnh'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='CNH'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.cnh ? errors.cnh.message.toString() : undefined}
                maxLength={15}
                keyboardType='numeric'
                />
            )}
          />

        <Controller
            control={control}
            name='categoria'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Categoria'
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={errors.categoria ? errors.categoria.message.toString() : undefined}
                maxLength={2}
                autoCapitalize='characters'
              />
            )}
          />

          <Controller
            control={control}
            name='dataEmissao'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Data de Emissão'
                onPressIn={showDatepickerEmissao}
                InputRightElement={<Icon as={<FontAwesome name="calendar" />} size={5} mr="2" color="muted.400" marginLeft={5} />}
                marginTop={19}
                onChangeText={onChange}
                value={dayjs(dataEmissao.toLocaleString()).format('DD/MM/YYYY')}
                error={errors.dataEmissao ? errors.dataEmissao.message.toString() : undefined}
              />
            )}
          />

        <Controller
            control={control}
            name='dataValidade'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Data de Validade'
                onPressIn={showDatepickerValidade}
                InputRightElement={<Icon as={<FontAwesome name="calendar" />} size={5} mr="2" color="muted.400" marginLeft={5} />}
                marginTop={19}
                onChangeText={onChange}
                value={dayjs(dataValidade.toLocaleString()).format('DD/MM/YYYY')}
                error={errors.dataValidade ? errors.dataValidade.toString() : undefined}
              />
            )}
          />

          <Button 
            title='Próximo'
            mt={10}
            mb={1}
            onPress={handleSubmit((cnh))}
          />
        </Center>
    );
  }
  
  