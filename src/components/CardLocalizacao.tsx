import {
  Box,
  Button as ButtonNativeBase,
  Center,
  HStack,
  IButtonProps,
  Icon,
  Spacer,
  Text,
  VStack,
} from "native-base";
import PinAtivo from "../assets/pin-ativo.svg";
import PinInativo from "../assets/pin-inativo.svg";
import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";

interface Props {
  nome: string;
  tipo?: number;
  dataCreate: string;
  dataExpira?: string;
  situacao: boolean;
  onDelete: any;
}

export function CardLocAtual({ nome, dataCreate, situacao, onDelete }: Props) {
  return (
    <Box
      borderWidth="2"
      borderRadius={15}
      borderColor="blue.500"
      py={2}
      width="100%"
      marginTop={3}
    >
      <HStack space={[2, 3]} justifyContent="space-between" px={3}>
        {
            situacao ?
                <PinAtivo width={50} height={50} />
            :
                <PinInativo width={50} height={50} />
        }
        
        <VStack>
          <Text color="coolGray.900" bold>
            Ultima {nome}
          </Text>
          <Text color="coolGray.500" bold>
            Enviado em {dayjs(dataCreate).add(3, 'hour').format("DD/MM/YYYY")}
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Center mr={situacao ? 3 : 0}>
            <Icon
              as={<FontAwesome name="trash-o" />}
              size={5}
              color="red.500"
              onPress={onDelete}
            />

            <Text
              fontSize="xs"
              color={situacao ? "blue.500" : "red.500"}
              bold
              alignSelf="flex-end"
              marginTop={3}
            >
              {situacao ? "Ativo" : "Finalizado"}
            </Text>
          </Center>
        </VStack>
      </HStack>
    </Box>
  );
}



export function CardLoc({ nome,tipo, dataCreate, dataExpira, situacao, onDelete }: Props) {
    return (
      <Box
        py={2}
        width="100%"
        marginTop={3}
      >
        <HStack space={[2, 3]} justifyContent="space-between" px={3}>
          {
              situacao ?
                  <PinAtivo width={50} height={50} />
              :
                  <PinInativo width={50} height={50} />
          }
          
          <VStack>
            <Text color="coolGray.900" bold>
              {nome}
            </Text>
            <Text color="coolGray.500" bold>
                {
                    tipo == 1 ?
                        `Enviado em ${dayjs(dataCreate).add(3, 'hour').format("DD/MM/YYYY")}`
                    :
                        `Para ${dayjs(dataExpira).add(3, 'hour').format("DD/MM/YYYY HH:mm")}`
                }
            </Text>
          </VStack>
          <Spacer />
          <VStack>
            <Center
                mr={situacao ? 3 : 0}
            >
              <Icon
                as={<FontAwesome name="trash-o" />}
                size={5}
                color="red.500"
                onPress={onDelete}
              />
  
              <Text
                fontSize="xs"
                color={situacao ? "blue.500" : "red.500"}
                bold
                alignSelf="flex-end"
                marginTop={3}
              >
                {situacao ? "Ativo" : "Finalizado"}
              </Text>
            </Center>
          </VStack>
        </HStack>
      </Box>
    );
  }
