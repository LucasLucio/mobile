import { Box, Center, HStack, Icon, Spacer, Text, useToast, VStack } from "native-base";

import Lock from "../../assets/lock.svg";
import Mail from "../../assets/mail.svg";
import { Button } from "../../components/Button";

import * as yup from "yup";
import React from "react";
import { api } from "../../services/api";
import { Toast } from "../../components/Toast";

export function Email({ route, navigation }) {
  let dados = route.params;

  const toast = useToast();

  async function enviar(){
    const response = await api.post(`/usuario/solicita-validacao`,{
        idUsuario: dados.pessoa.usuario.id,
        idMeioComunicacao: dados.id
    }).then(async (response) => {
      toast.show({
        render: () => {
          return <Toast text={response.data.message} status='success' />;
        },
        placement: 'top'
      });
        navigation.navigate('CodeInput', dados);
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

  return (
    <Center flex={1} bgColor="white" padding={8}>
      <Lock width={"50%"} height={"40%"} />

      <Text
        textAlign={"center"}
        mb={10}
        mt={10}
        fontWeight="bold"
        color="blue.900"
      >
        Verifique e confirme o email para o envio do código para a criação de
        uma nova senha.
      </Text>

      <Box
        borderRadius={15}
        py={2}
        width="100%"
        marginTop={3}
        backgroundColor='blue.100'
      >
        <HStack space={[2, 3]} justifyContent="space-between" px={3}>
            <Mail width={50} height={50} />
          <VStack>
            <Text color="coolGray.500" bold>
              Email Cadastrado
            </Text>
            <Text color="coolGray.900" bold>
              {dados.email}
            </Text>
          </VStack>
          <Spacer />
        </HStack>
      </Box>

      <Button title="Enviar" mt={10} mb={1} onPress={enviar} />
    </Center>
  );
}
