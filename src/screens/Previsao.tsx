import { Center, Icon, ScrollView, Text, useToast } from "native-base";
import { useAuth } from "../hooks/useAuth";

import { Button } from "../components/Button";
import { InputSelect, InputText } from "../components/Input";
import { DialogInform } from "../components/AlertDialog";
import Relogio from "../assets/relogio.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Toast } from "../components/Toast";
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';

dayjs.extend(utc)
dayjs.extend(timezone)


const schemaPrevisao = yup.object({
  municipio: yup.number().required("Município é obrigatório.")
});


export function Previsao({navigation}) {

  const [uf, setUf] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const toast = useToast();

  const [dataPrevisao, setDataPrevisao] = useState(dayjs(new Date()).add(1,'hour').toDate());
  const showModeDatePrevisao = (currentMode) => {
    DateTimePickerAndroid.open({
      value: dataPrevisao,
      onChange: onChangeDataPrevisao,
      mode: currentMode,
      is24Hour: true,
      minimumDate: dayjs(new Date()).add(1,'hour').toDate()
    });
  };

  const onChangeDataPrevisao = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDataPrevisao(currentDate);
  };

  const showDatepickerPrevisao = () => {
    showModeDatePrevisao('date');
  };


  const [horaPrevisao, setHoraPrevisao] = useState(dayjs(new Date()).add(1,'hour').toDate());
  const showModeTimePrevisao = (currentMode) => {
    DateTimePickerAndroid.open({
      value: horaPrevisao,
      onChange: onChangeTimePrevisao,
      mode: currentMode,
      is24Hour: true,
      minimumDate: dayjs(new Date()).add(1,'hour').toDate()
    });
  };

  const onChangeTimePrevisao = (event, selectedDate) => {
    const currentDate = selectedDate;
    setHoraPrevisao(currentDate);
  };

  const showTimepickerPrevisao = () => {
    showModeTimePrevisao('time');
  };


  useEffect(() => {
    async function getUf() {
      const tokenValue = await AsyncStorage.getItem('@token');
      const response = await api.get("/localizacao/listar-estados",
      {
        headers: { Authorization: `Bearer ${tokenValue}` }
      });
      var values = [];
      response.data.map(function (value, i) {
        values.push({
          name: value.nome,
          value: value.id,
        });
      });
      setUf(values);
    }

    getUf();
  }, []);


  async function getMunicipios(idEstado) {
    if (idEstado == undefined) {
      toast.show({
        render: () => {
          return <Toast text={"Informe um Estado"} status="warning" />;
        },
        placement: "top",
      });
    } else {
      const tokenValue = await AsyncStorage.getItem('@token');
      const response = await api.get(`/localizacao/listar-municipios/${idEstado}`,
      {
        headers: { Authorization: `Bearer ${tokenValue}` }
      });
      var values = [];
      response.data.map(function (value, i) {
        values.push({
          name: value.nome,
          value: value.id,
        });
      });
      setMunicipios(values);
    }
  }

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


  async function previsao(data) {
    const dataPrevista = (
      new Date(
      dataPrevisao.getFullYear(),
      dataPrevisao.getMonth(),
      dataPrevisao.getDate(),
      horaPrevisao.getHours() - 3,
      horaPrevisao.getMinutes(),
      ).toISOString())
      const payload = {
        dataPrevista: dataPrevista,
        municipioId: data.municipio
      }
    const tokenValue = await AsyncStorage.getItem('@token');
    const response = await api.post('/localizacao/localizacao-previsao',payload,
    {
      headers: { Authorization: `Bearer ${tokenValue}` }
    })
    .then(async (response) => {
      console.log(response.data);
      //displayDialog('Enviado', 'Sua previsão foi enviada você pode ver ela em Localizações', 'Ir para o Localizações');
      toast.show({
        render: () => {
          return <Toast text={'Sua previsão foi enviada você pode ver ela em Localizações'} status='success' />;
        },
        placement: 'top'
      });
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


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaPrevisao),
  });
  return (
    <Center flex={1} bgColor="white" padding={8}>
      <DialogInform
        title={dialogTitle}
        body={dialogBody}
        cancelRef={dialogRef}
        isOpen={dialogOpen}
        confirmText={dialogConfirmText}
        onConfirm={() => {
          navigation.navigate('localizacoes');
        }}
        leastDestructiveRef={dialogRef}
      />
      <ScrollView
        w="full"
        h="full"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Center flex={1} bgColor="white" pt={10}>
          <Text
            color={'blue.900'}
            fontSize='lg'
            fontWeight={'bold'}
            mb={10}
          >
            Nova Previsao
          </Text>
          <Relogio height={150} />

          <Controller
            control={control}
            name="uf"
            render={({ field: { onChange, value } }) => (
              <InputSelect
                size="100%"
                name="Estado"
                marginTop={19}
                onValueChange={onChange}
                selectedValue={value}
                values={uf}
                error={
                  errors.uf
                    ? errors.uf.message.toString()
                    : undefined
                }
              />
            )}
          />

          <Controller
            control={control}
            name="municipio"
            render={({ field: { onChange, value } }) => (
              <InputSelect
                size="100%"
                name="Municipio"
                marginTop={19}
                onValueChange={onChange}
                selectedValue={value}
                values={municipios}
                error={
                  errors.municipio
                    ? errors.municipio.message.toString()
                    : undefined
                }
                onOpen={async () => {
                  await getMunicipios(control._formValues.uf);
                }}
              />
            )}
          />


          <Controller
            control={control}
            name='dataPrevista'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Quando que vai estar lá?'
                onPressIn={showDatepickerPrevisao}
                InputRightElement={<Icon as={<FontAwesome name="calendar" />} size={5} mr="2" color="muted.400" marginLeft={5} />}
                marginTop={19}
                onChangeText={onChange}
                value={dayjs(dataPrevisao.toLocaleString()).format('DD/MM/YYYY')}
                error={errors.dataPrevista ? errors.dataPrevista.toString() : undefined}
              />
            )}
          />

          <Controller
            control={control}
            name='horaPrevista'
            render={ ({field: {onChange, value}}) => (
              <InputText
                name='Qual horário?'
                onPressIn={showTimepickerPrevisao}
                InputRightElement={<Icon as={<FontAwesome name="clock-o" />} size={5} mr="2" color="muted.400" marginLeft={5} />}
                marginTop={19}
                onChangeText={onChange}
                value={dayjs(horaPrevisao.toLocaleString()).format('HH:mm')}
                error={errors.horaPrevista ? errors.horaPrevista.toString() : undefined}
              />
            )}
          />
          
          <Button
            title="Enviar"
            mt={10}
            mb={1}
            onPress={handleSubmit(previsao)}
          />
        </Center>
      </ScrollView>
    </Center>
  );
}
