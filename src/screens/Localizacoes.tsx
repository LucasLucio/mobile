import {
  Center,
  Text,
  Icon,
  View,
  Box,
  VStack,
  HStack,
  Spacer,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { InputCheck, InputPassword, InputText } from "../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import PinAtivo from "../assets/pin-ativo.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { useEffect, useState } from "react";

const schemaSearch = yup.object({
  pesquisa: yup.string().required("Informe a busca."),
});

export function Localizacoes() {
  const [ultima, setUltima] = useState({});
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSearch),
  });

  useEffect(() => {
    async function getUltima() {
      const tokenValue = await AsyncStorage.getItem('@token');
      const response = await api.get("/localizacao/ultima-atual",
      {
        headers: { Authorization: `Bearer ${tokenValue}` }
      });
      if(response.data != null){
        setUltima(response.data);
      }
    }
    getUltima();
  }, []);



  return (
    <Center flex={1} bgColor="white" padding={8}>
      <View
        style={{
          position: "absolute",
          top: "5%",
          alignSelf: "center",
          width: "100%",
        }}
      >
        <Center>
          <Controller
            control={control}
            name="pesquisa"
            render={({ field: { onChange, value } }) => (
              <InputText
                name="Pesquisar Local"
                InputLeftElement={
                  <Icon
                    as={<FontAwesome name="search" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                    marginLeft={5}
                  />
                }
                InputRightElement={
                  <Icon
                    as={<FontAwesome name="arrow-circle-o-right" />}
                    size={5}
                    mr="2"
                    color="blue.500"
                    marginRight={5}
                  />
                }
                marginTop={19}
                onChangeText={onChange}
                value={value}
                error={
                  errors.pesquisa
                    ? errors.pesquisa.message.toString()
                    : undefined
                }
                maxLength={50}
              />
            )}
          />
          <Box
            borderWidth="2"
            borderRadius={15}
            borderColor="blue.500"
            py={2}
            width="100%"
            marginTop={3}
          >
            <HStack space={[2, 3]} justifyContent="space-between" px={3}>
              <PinAtivo width={50} height={50} />
              <VStack>
                <Text color="coolGray.900" bold>
                </Text>
                <Text color="coolGray.500" bold>
                  Data Expire
                </Text>
              </VStack>
              <Spacer />
              <VStack>
                <Center>
                  <Icon
                    as={<FontAwesome name="trash-o" />}
                    size={5}
                    color="red.500"
                    onPress={() => {console.log('pressionou')}}
                  />
                  <Text 
                    fontSize="xs" 
                    color="red.500" 
                    bold 
                    alignSelf="flex-end"
                    marginTop={3}
                  >
                    Situacao
                  </Text>
                </Center>
              </VStack>
            </HStack>
          </Box>
        </Center>
      </View>
    </Center>
  );
}
