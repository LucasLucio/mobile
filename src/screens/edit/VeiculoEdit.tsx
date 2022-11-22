import {
  Center,
  Text,
  Icon,
  Button as ButtonNativeBase,
  Box,
  useToast,
  HStack,
  ScrollView,
  VStack,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import Truck from "../../assets/truck.svg";
import { Button } from "../../components/Button";
import { InputSelect, InputText, ValueSelect } from "../../components/Input";



import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { ViaCep } from "../../utils/ViaCep";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Toast } from "../../components/Toast";
import { api } from "../../services/api";
import { Loading } from "../../components/Loading";
import { DialogInform } from "../../components/AlertDialog";
const viaCep = new ViaCep();

const dayjs = require("dayjs");

const schemaAccount = yup.object({
  placa: yup.string().required('Placa do veículo é obrigatório.'),
  eixos: yup.number()
      .required('Quantidade de eixos é obrigatório.')
      .min(3, 'A quantidade de eixos deve ser no mínimo 3.')
      .max(9, 'A quantidade de eixos deve ser no máximo 9.'),
  tipoVeiculo: yup.number().required('O Tipo de veículo é obrigatório.'),
  tipoCarroceria: yup.number().required('O Tipo de carroceria é obrigatório.'),
  capacidade: yup.number()
      .required('A capacidade em toneladas é obrigatório.')
      .min(10, 'A capacidade do veículo deve estar acima de 10 toneladas.')
      .max(50, 'A capacidade do veículo deve estar entre 10 e 50 toneladas.'),
  rntrc: yup.string()
      .required('RNTRC é Obrigatório.')
      .min(10, 'RNTRC muito pequeno.')
      .max(25, 'Quantidade máxima para RNTRC ultrapassada'),
  categoria: yup.string().required('Categoria da RNTRC é obrigatório'),
});

export function VeiculoEdit({ route, navigation }) {
  const [tiposVeiculo, setTiposVeiculo] = useState([]);
  const [tiposCarroceria, setTiposCarroceria] = useState([]);
  const [load, setLoad] = useState(false);

  
  const [idVeiculo, setIdVeiculo] = useState(0);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schemaAccount),
  });

  async function getTiposCarroceria(idVeiculo: string) {

    if (idVeiculo == undefined && idVeiculo != '') {
      toast.show({
        render: () => {
          return <Toast text={"Informe um tipo de veículo"} status="warning" />;
        },
        placement: "top",
      });
    } else {
      const response = await api.get(`/veiculo/tipo-carroceria/${idVeiculo}`);
      var values = [];
      response.data.map(function (value, i) {
        values.push({
          name: value.tipoCarroceria.nome,
          value: value.tipoCarroceria.id,
        });
      });
      setTiposCarroceria(values);
    }
  }

  useEffect(() => {
    async function getTiposVeiculo() {
      const response = await api.get("/veiculo/tipo-veiculo");
      var values = [];
      response.data.map(function (value, i) {
        values.push({
          name: value.nome,
          value: value.id,
        });
      });
      setTiposVeiculo(values);
    }

    getTiposVeiculo();
    getTiposCarroceria('');
    getVeiculo();
  }, []);

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
    navigation.navigate('home');
  }

  async function getVeiculo() {
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.get("/veiculo", {
      headers: { Authorization: `Bearer ${tokenValue}` },
    });
    if (response.data != null) {
      setValue("placa", response.data.placa); 
      setValue("eixos", response.data.quantidadeEixo.toString()); 
      setValue("tipoVeiculo", response.data.tipoVeiculo.id.toString()); 
      setValue("tipoCarroceria", response.data.tipoCarroceria.id.toString()); 
      setValue("capacidade", response.data.capacidade.toString()); 
      setValue("rntrc", response.data.rntrc); 
      setValue("categoria", response.data.categoria.toString()); 
      setIdVeiculo(parseInt(response.data.id));
    }
  }

  async function veiculo(data) {
    setLoad(true);
    const payload = {
      idVeiculo: idVeiculo,
      placa: data.placa,
      eixos: data.eixos,
      tipoVeiculo: data.tipoVeiculo,
      tipoCarroceria: data.tipoCarroceria,
      capacidade: data.capacidade,
      rntrc: data.rntrc,
      categoria: data.categoria,
    }
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.put('/veiculo',payload,{
      headers: { Authorization: `Bearer ${tokenValue}` },
    })
    .then(async (response) => {
      setLoad(false);
      displayDialog('Sucesso', 'Dados do veíulo alterado', 'Voltar');
    })
    .catch((error) => {
      setLoad(false);
      console.log(error.response.data)
      toast.show({
        render: () => {
          return <Toast text={"Ocorreu um erro ao editar o veículo"} status='error' />;
        },
        placement: 'top'
      });
      
    });
  }
  return (
    <Center>
      {load ? 
        <Center>
          <Loading />  
        </Center>
      :
      <ScrollView
        w="full"
        h="full"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >  
            <Center 
              flex={1} 
              bgColor="white"
              padding={8}
              style={{
                bottom: '5%'
              }}
              mt={20}
            >
              <DialogInform 
                title={dialogTitle} 
                body={dialogBody}
                cancelRef={dialogRef}
                isOpen={dialogOpen}
                confirmText={dialogConfirmText}
                onConfirm={() => {dialogReturn(true)}}
                leastDestructiveRef={dialogRef}
              />
              <Truck height={150} />

              <HStack>
                <Controller
                  control={control}
                  name="placa"
                  render={({ field: { onChange, value } }) => (
                    <InputText
                      name="Placa"
                      marginTop={19}
                      onChangeText={onChange}
                      value={value}
                      error={
                        errors.placa ? errors.placa.message.toString() : undefined
                      }
                      maxLength={7}
                      size="60%"
                      autoCapitalize="characters"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="eixos"
                  render={({ field: { onChange, value } }) => (
                    <InputText
                      name="Eixos"
                      marginTop={19}
                      onChangeText={onChange}
                      value={value}
                      error={
                        errors.eixos ? errors.eixos.message.toString() : undefined
                      }
                      maxLength={8}
                      size="38%"
                      keyboardType="numeric"
                    />
                  )}
                />
              </HStack>

              <Controller
                control={control}
                name="tipoVeiculo"
                render={({ field: { onChange, value } }) => (
                  <InputSelect
                    size="100%"
                    name="Tipo de Veiculo"
                    marginTop={19}
                    onValueChange={onChange}
                    selectedValue={value}
                    values={tiposVeiculo}
                    error={
                      errors.tipoVeiculo
                        ? errors.tipoVeiculo.message.toString()
                        : undefined
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="tipoCarroceria"
                render={({ field: { onChange, value } }) => (
                  <InputSelect
                    size="100%"
                    name="Carroceria"
                    marginTop={19}
                    onValueChange={onChange}
                    selectedValue={value}
                    values={tiposCarroceria}
                    error={
                      errors.tipoCarroceria
                        ? errors.tipoCarroceria.message.toString()
                        : undefined
                    }
                    onOpen={async () => {
                      await getTiposCarroceria(control._formValues.tipoVeiculo); 
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="capacidade"
                render={({ field: { onChange, value } }) => (
                  <InputText
                    name="capacidade (Toneladas)"
                    marginTop={19}
                    onChangeText={onChange}
                    value={value}
                    error={
                      errors.capacidade
                        ? errors.capacidade.message.toString()
                        : undefined
                    }
                    maxLength={3}
                    keyboardType="numeric"
                    size="100%"
                  />
                )}
              />
              <Controller
                control={control}
                name="rntrc"
                render={({ field: { onChange, value } }) => (
                  <InputText
                    name="RNTRC"
                    marginTop={19}
                    onChangeText={onChange}
                    value={value}
                    error={errors.rntrc ? errors.rntrc.message.toString() : undefined}
                    maxLength={25}
                    keyboardType="numeric"
                    size="100%"
                  />
                )}
              />

              <Controller
                control={control}
                name="categoria"
                render={({ field: { onChange, value } }) => (
                  <InputSelect
                    size="100%"
                    name="Categoria RNTRC"
                    marginTop={19}
                    onValueChange={onChange}
                    selectedValue={value}
                    values={[
                      {
                        name: "Empresas de Transporte de Cargas",
                        value: "ETC",
                      },
                      {
                        name: "Cooperativa de Transporte de Cargas",
                        value: "CTC",
                      },
                      {
                        name: "Transportador Autônomo de Carga",
                        value: "TAC",
                      },
                    ]}
                    error={
                      errors.categoria
                        ? errors.categoria.message.toString()
                        : undefined
                    }
                  />
                )}
              />

              <Button
                title="Finalizar"
                mt={10}
                mb={1}
                onPress={handleSubmit(veiculo)}
              />
            </Center>
      </ScrollView>
      }
  </Center>
  );
}
