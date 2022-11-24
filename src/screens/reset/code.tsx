import {
  Box,
  Center,
  HStack,
  Icon,
  Spacer,
  Text,
  useToast,
  VStack,
} from "native-base";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../components/Button";

import * as yup from "yup";
import React from "react";
import { InputText } from "../../components/Input";
import { api } from "../../services/api";
import { Toast } from "../../components/Toast";

const schemaCode = yup.object({
  codigo: yup.string().min(6,'Mínimo de 6 dígitos').required("Insira o código recebido"),
});

export function CodeInput({ route, navigation }) {
  let dados = route.params;
  console.log(route.params);

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCode),
  });

  async function enviarNovamente() {
    const response = await api
      .post(`/usuario/solicita-validacao`, {
        idUsuario: dados.pessoa.usuario.id,
        idMeioComunicacao: dados.id,
      })
      .then(async (response) => {
        toast.show({
          render: () => {
            return <Toast text={response.data.message} status="success" />;
          },
          placement: "top",
        });
      })
      .catch((error) => {
        toast.show({
          render: () => {
            return <Toast text={error.response.data.message} status="error" />;
          },
          placement: "top",
        });
      });
  }

  async function codeVerify(data) {
    const response = await api.post(`/usuario/valida-codigo`, {
        idUsuario: dados.pessoa.usuario.id,
        codigo: data.codigo,
      })
      .then(async (response) => {
        let payload = {
          idUsuario: dados.pessoa.usuario.id,
          codigo: data.codigo,
          idCodigo: response.data.idCodigo
        }
        console.log(payload);
        navigation.navigate('Pass', payload);
      })
      .catch((error) => {
        toast.show({
          render: () => {
            return <Toast text={error.response.data.message} status="error" />;
          },
          placement: "top",
        });
      });
  }

  return (
    <Center flex={1} bgColor="white" padding={8}>
      <Text
        textAlign={"center"}
        mb={10}
        mt={10}
        fontWeight="bold"
        color="blue.900"
      >
        O código foi enviado em seu email.
      </Text>

      <Controller
        control={control}
        name="codigo"
        render={({ field: { onChange, value } }) => (
          <InputText
            name=""
            marginTop={19}
            onChangeText={onChange}
            value={value}
            error={errors.codigo ? errors.codigo.message.toString() : undefined}
            autoCapitalize="characters"
            textAlign={'center'}
            maxLength={6}
            
          />
        )}
      />

      <Text
        textAlign={"center"}
        mb={10}
        mt={10}
        fontWeight="bold"
        color="blue.500"
        onPress={enviarNovamente}
      >
        Enviar Novamente
      </Text>

      <Button
        title="Verificar"
        mt={10}
        mb={1}
        onPress={handleSubmit(codeVerify)}
      />
    </Center>
  );
}
