import {
  Center,
  Text,
  Icon,
  Button as ButtonNativeBase,
  Box,
  useToast,
  HStack,
  ScrollView,
} from "native-base";

import Pin from "../../assets/pin.svg";
import { Button } from "../../components/Button";
import { InputText } from "../../components/Input";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { ViaCep } from "../../utils/ViaCep";
import axios from "axios";
import { Toast } from "../../components/Toast";
import { api } from "../../services/api";
import { DialogInform } from "../../components/AlertDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

const schemaAccount = yup.object({
  cep: yup.string().required("CEP é obrigatório"),
  numeroEdificio: yup.string().required("Número do edifício é obrigatório."),
});

export function EnderecoEdit({ route, navigation }) {
  let accountEdit = route.params.accountEdit;
  let dados = route.params.dados;
  const toast = useToast();

  const [municipio, setMunicipio] = useState("");
  const [logradouro, setLogradouro] = useState("");

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schemaAccount),
  });

  async function buscaCep(cep) {
    try {
      if (cep.length == 8) {
        axios
          .get(`https://viacep.com.br/ws/${cep}/json`)
          .then((res) => {
            if (res.data.erro == true) {
              toast.show({
                render: () => {
                  return <Toast text={"CEP Inválido"} status="error" />;
                },
                placement: "top",
              });
            } else {
              setMunicipio(res.data.localidade + " - " + res.data.uf);
              setLogradouro(res.data.logradouro);
            }
          })
          .catch((error) => {
            toast.show({
              render: () => {
                return <Toast text={"Falha ao buscar o CEP"} status="error" />;
              },
              placement: "top",
            });
          });
      } else {
        setMunicipio("");
        setLogradouro("");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function endereco(data) {
    let payload = {
      nomeCompleto: accountEdit.nomeCompleto,
      dataNascimento: accountEdit.dataNascimento,
      rg: accountEdit.rg,
      idCelular: dados.pessoa.meioComunicacao[1].id,
      celular: accountEdit.celular,
      genero: accountEdit.genero,
      estadoCivil: accountEdit.estadoCivil,
      cnh: accountEdit.cnh,
      categoria: accountEdit.categoria,
      dataEmissao: accountEdit.dataEmissao,
      dataValidade: accountEdit.dataValidade,
      idEndereco: dados.pessoa.endereco[0].id,
      endereco: {
        cep: data.cep,
        numeroEdificio: data.numeroEdificio
      }

    };

    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api
      .put("/usuario/motorista", payload,{
        headers: { Authorization: `Bearer ${tokenValue}` },
      })
      .then(async (response) => {
        displayDialog(
          "Sucesso",
          "Agora você está pronto para conseguir mais fretes.",
          "Voltar para o Inicio"
        );
      })
      .catch((error) => {
        toast.show({
          render: () => {
            return (
              <Toast
                text={"Ocorreu um erro ao editar seu usuário"}
                status="error"
              />
            );
          },
          placement: "top",
        });
      });
  }

  useEffect(() => {
    if (dados) {
      let endereco = dados.pessoa.endereco[0];
      setValue("cep", endereco.cep);
      setValue("numeroEdificio", endereco.numero);
      setMunicipio(endereco.municipio + " - " + endereco.uf);
      setLogradouro(endereco.logradouro);
    }
  }, []);

  return (
    <Center flex={1} bgColor="white" padding={8}>

      <DialogInform
        title={dialogTitle}
        body={dialogBody}
        cancelRef={dialogRef}
        isOpen={dialogOpen}
        confirmText={dialogConfirmText}
        onConfirm={() => {
          navigation.navigate('home');
        }}
        leastDestructiveRef={dialogRef}
      />

      <Pin height={150} />

      <Controller
        control={control}
        name="cep"
        render={({ field: { onChange, value } }) => (
          <InputText
            name="CEP"
            marginTop={19}
            onChangeText={onChange}
            value={value}
            error={errors.cep ? errors.cep.message.toString() : undefined}
            maxLength={8}
            keyboardType="numeric"
            onEndEditing={async (e: any) => {
              await buscaCep(e.nativeEvent.text);
            }}
          />
        )}
      />

      <InputText
        name="Municipio"
        marginTop={19}
        value={municipio}
        isDisabled={true}
      />

      <InputText
        name="Logradouro"
        marginTop={19}
        value={logradouro}
        isDisabled={true}
      />

      <Controller
        control={control}
        name="numeroEdificio"
        render={({ field: { onChange, value } }) => (
          <InputText
            name="Numero do Edifício"
            marginTop={19}
            onChangeText={onChange}
            value={value}
            error={
              errors.numeroEdificio
                ? errors.numeroEdificio.message.toString()
                : undefined
            }
            maxLength={8}
          />
        )}
      />

      <Button title="Salvar" mt={10} mb={1} onPress={handleSubmit(endereco)} />
    </Center>
  );
}
