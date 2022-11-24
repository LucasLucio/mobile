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

import { FontAwesome } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Unlock from "../../assets/unlock.svg";
import { Button } from "../../components/Button";

import * as yup from "yup";
import React from "react";
import { InputPassword, InputText } from "../../components/Input";
import { api } from "../../services/api";
import { Toast } from "../../components/Toast";
import { DialogInform } from "../../components/AlertDialog";
import { StackActions } from "@react-navigation/native";

const schemaCode = yup.object({
  senha: yup
    .string()
    .required("Senha é obrigatória.")
    .min(6, "A senha deve conter no minímo 6 caracteres.")
    .max(12, "A senha deve ser de 6 a 12 caracteres.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      "Use combinação de letras e números."
    ),
  confirmacaoSenha: yup
    .string()
    .required("Informe a confirmação de senha.")
    .oneOf([yup.ref("senha"), null], "As senhas não conferem"),
});

export function Pass({ route, navigation }) {
  let dados = route.params;
  console.log(dados);
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCode),
  });

  async function resetSenha(data) {
    const response = await api
      .put(`/usuario/redefinir-senha`, {
        idUsuario: dados.idUsuario,
        codigo: dados.codigo,
        idCodigo: dados.idCodigo,
        senha: data.senha,
      })
      .then(async (response) => {
        displayDialog('Sucesso', 'Agora já pode voltar a usar sua conta normalmente', 'Ir para o Login');
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
      <Unlock width={"50%"} height={"40%"} />

      <DialogInform
        title={dialogTitle}
        body={dialogBody}
        cancelRef={dialogRef}
        isOpen={dialogOpen}
        confirmText={dialogConfirmText}
        onConfirm={() => {
          navigation.dispatch(StackActions.popToTop());
        }}
        leastDestructiveRef={dialogRef}
      />

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
        name="senha"
        render={({ field: { onChange, value } }) => (
          <InputPassword
            name="Senha"
            InputLeftElement={
              <Icon
                as={<FontAwesome name="lock" />}
                size={5}
                ml="2"
                color="muted.400"
                marginLeft={5}
              />
            }
            onChangeText={onChange}
            value={value}
            error={errors.senha ? errors.senha.message.toString() : undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmacaoSenha"
        render={({ field: { onChange, value } }) => (
          <InputPassword
            name="Confirme sua senha"
            InputLeftElement={
              <Icon
                as={<FontAwesome name="lock" />}
                size={5}
                ml="2"
                color="muted.400"
                marginLeft={5}
              />
            }
            onChangeText={onChange}
            value={value}
            error={
              errors.confirmacaoSenha
                ? errors.confirmacaoSenha.message.toString()
                : undefined
            }
          />
        )}
      />
      <Button
        title="Confirmar"
        mt={10}
        mb={1}
        onPress={handleSubmit(resetSenha)}
      />
    </Center>
  );
}
