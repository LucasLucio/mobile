import { Center, Text, Icon, Box, HStack, VStack, Spacer, useToast } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

import Usuario from "../assets/usuario.svg";
import { Button } from "../components/Button";
import { InputCheck, InputPassword, InputText } from "../components/Input";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { CommonActions, StackActions } from "@react-navigation/native";
import { Dialog } from "../components/AlertDialog";
import { Toast } from "../components/Toast";

export function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dados, setDados] = useState({});
  async function getUsuario() {
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.get("/usuario/motorista", {
      headers: { Authorization: `Bearer ${tokenValue}` },
    });
    if (response.data != null) {
      setNome(response.data.pessoa.nome);
      setEmail(response.data.email);
      setDados(response.data);
    }
  }


  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBody, setDialogBody] = useState("");
  const dialogRef = useRef(null);
  function displayDialog(title: string, body: string) {
    setDialogOpen(true);
    setDialogTitle(title);
    setDialogBody(body);
  }


  useEffect(() => {
    getUsuario();
  }, [getUsuario]);

  const toast = useToast();

  async function sair(){
    try {
      await AsyncStorage.clear();
      navigation.dispatch(StackActions.popToTop());
    } catch(e) {
      toast.show({
        render: () => {
          return <Toast text={'Erro ao sair do aplicativo.'} status="error" />;
        },
        placement: "top",
      });
    }
  }



  return (
    <Center flex={1} bgColor="white" padding={8}>
      <Dialog
        title={dialogTitle}
        body={dialogBody}
        cancelRef={dialogRef}
        isOpen={dialogOpen}
        leastDestructiveRef={dialogRef}
        onFalse={() => {
          setDialogOpen(false);
        }}
        onTrue={async () => {
          await sair();
        }}
      />
      <Usuario height={150} />
      <Text color={"blue.900"} fontSize="lg" bold>
        {nome}
      </Text>
      <Text color={"blue.900"} fontWeight="semibold">
        {email}
      </Text>
      <Box py={2} width="100%" marginTop={3}>
        <HStack space={[2, 3]} justifyContent="space-between" px={3}>
          <Icon
            as={<FontAwesome name="user-o" />}
            size={7}
            mr="2"
            color="gray.500"
            marginLeft={5}
            onPress={() => {
              //navigation.navigate("edit");
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: "edit" }
                  ],
                })
              );
            }}
          />

          <VStack>
            <Text
              color="gray.700"
              fontWeight={"semibold"}
              fontSize="lg"
              onPress={() => {
                //navigation.navigate("edit");
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      { name: "edit" }
                    ],
                  })
                );
              }}
            >
              Editar Perfil
            </Text>
          </VStack>
          <Spacer />
        </HStack>
      </Box>
      <Box py={2} width="100%" marginTop={3}>
        <HStack space={[2, 3]} justifyContent="space-between" px={3}>
          <Icon
            as={<FontAwesome name="truck" />}
            size={7}
            mr="2"
            color="gray.500"
            marginLeft={5}
          />

          <VStack>
            <Text 
              color="gray.700"
              fontWeight={"semibold"} 
              fontSize="lg"
              onPress={() => {
                //navigation.navigate("edit");
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      { name: "veiculo" }
                    ],
                  })
                );
              }}
            >
              Meu Veículo
            </Text>
          </VStack>
          <Spacer />
        </HStack>
      </Box>
      <Box py={2} width="100%" marginTop={3}>
        <HStack space={[2, 3]} justifyContent="space-between" px={3}>
          <Icon
            as={<FontAwesome name="power-off" />}
            size={7}
            mr="2"
            color="red.500"
            marginLeft={5}
          />

          <VStack>
            <Text 
              color="red.500" 
              fontWeight={"semibold"} 
              fontSize="lg"
              onPress={() => {
                displayDialog('Sair','Deseja realmente sair do aplicativo?');
              }}
            >
              Sair
            </Text>
          </VStack>
          <Spacer />
        </HStack>
      </Box>
    </Center>
  );
}
