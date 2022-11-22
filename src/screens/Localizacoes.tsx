import {
  Center,
  Text,
  Icon,
  View,
  Box,
  VStack,
  HStack,
  Spacer,
  FlatList,
  ScrollView,
  useToast,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { InputCheck, InputPassword, InputText } from "../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { useEffect, useRef, useState } from "react";
import { CardLoc, CardLocAtual } from "../components/CardLocalizacao";
import { Toast } from "../components/Toast";
import { RefreshControl } from "react-native";
import { Dialog, DialogInform } from "../components/AlertDialog";

const schemaSearch = yup.object({
  pesquisa: yup.string(),
});

interface Ultima {
  id?: number;
  tipoLocalizacao?: number;
  localNome?: string;
  dataCriacao?: string;
  dataExpiracao?: string;
  ativo?: boolean;
  situacao?: boolean;
}

export function Localizacoes({navigation}) {
  const ultimaLoc: Ultima = {};
  const locs: Ultima[] = [];
  const [ultima, setUltima] = useState(ultimaLoc);
  const [localizacoes, setLocalizacoes] = useState(locs);
  const [refreshing, setRefreshing] = useState(false);
  const [idLoc, setIdLoc] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBody, setDialogBody] = useState("");
  const dialogRef = useRef(null);

  
  const [dialogInfOpen, setDialogInfOpen] = useState(false);
  const [dialogInfTitle, setDialogInfTitle] = useState("");
  const [dialogInfBody, setDialogInfBody] = useState("");
  const [dialogInfConfirmText, setDialogInfConfirmText] = useState("");
  const dialogInfRef = useRef(null);

  function displayDialogInf(title: string, body: string, confirmText: string) {
    setDialogInfOpen(true);
    setDialogInfTitle(title);
    setDialogInfBody(body);
    setDialogInfConfirmText(confirmText);
  }

  function displayDialog(title: string, body: string) {
    setDialogOpen(true);
    setDialogTitle(title);
    setDialogBody(body);
  }

  const onRefresh = () => {
    setRefreshing(true);
    getUltima();
    getLocalizacoes();
  };

  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSearch),
  });

  async function getUltima() {
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.get("/localizacao/ultima-atual", {
      headers: { Authorization: `Bearer ${tokenValue}` },
    });
    if (response.data != null) {
      setUltima(response.data);
    }
  }

  useEffect(() => {
    getUltima();
  }, []);

  async function getLocalizacoes() {
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.get("/localizacao/todas-localizacoes", {
      headers: { Authorization: `Bearer ${tokenValue}` },
    });
    if (response.data != null) {
      setLocalizacoes(response.data);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getLocalizacoes();
  }, []);

  async function buscaLocalizacoes(data) {
    if (data.pesquisa == "" || data.pesquisa == undefined) {
      toast.show({
        render: () => {
          return (
            <Toast text={"Informe um valor para a pesquisa."} status="error" />
          );
        },
        placement: "top",
      });
      return;
    }
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api.get(
      `/localizacao/busca-nome-local/${data.pesquisa}`,
      {
        headers: { Authorization: `Bearer ${tokenValue}` },
      }
    );
    if (response.data != null) {
      setLocalizacoes(response.data);
    }
  }

  function perguntaExcluir(id) {
    displayDialog("Excluir", "Deseja realmente excluir essa informação?");
    setIdLoc(id);
  }

  async function excluir(id) {
    const tokenValue = await AsyncStorage.getItem("@token");
    const response = await api
      .delete(`/localizacao/${id}`, {
        headers: { Authorization: `Bearer ${tokenValue}` },
      })
      .then(async (response) => {
        displayDialogInf(
          "Excluido",
          "A localização foi excluída com sucesso",
          "Voltar"
        );
      })
      .catch(async (error) => {
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
          await excluir(idLoc);
        }}
      />
      <DialogInform
        title={dialogInfTitle}
        body={dialogInfBody}
        cancelRef={dialogInfRef}
        isOpen={dialogInfOpen}
        confirmText={dialogInfConfirmText}
        onConfirm={() => {
          setDialogInfOpen(false);
          setDialogOpen(false);
          onRefresh();
        }}
        leastDestructiveRef={dialogInfRef}
      />
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
                    as={<FontAwesome name="check" />}
                    size={5}
                    mr="2"
                    color="blue.500"
                    marginRight={5}
                    onPress={handleSubmit(buscaLocalizacoes)}
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
          {ultima.id != undefined ? (
            <CardLocAtual
              nome={ultima.localNome}
              dataCreate={ultima.dataCriacao}
              onDelete={async () => {
                await perguntaExcluir(ultima.id);
              }}
              situacao={ultima.situacao}
            />
          ) : (
            <Text>Você ainda não possui localização atual</Text>
          )}
        </Center>
      </View>
      <FlatList
        data={localizacoes}
        width="full"
        style={{
          position: "relative",
          bottom: "4%",
        }}
        marginTop={"63%"}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <CardLoc
            nome={item.localNome}
            tipo={item.tipoLocalizacao}
            dataCreate={item.dataCriacao}
            dataExpira={item.dataExpiracao}
            onDelete={async () => {
              await perguntaExcluir(item.id);
            }}
            situacao={item.situacao}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Center>
  );
}
