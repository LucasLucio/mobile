import { Alert, HStack, Text, VStack } from 'native-base';

interface Props{
    text: string;
    status: 'success' | 'error' | 'info' | 'warning';
}

export function Toast({text, status}: Props){
    let prefix = '';
    switch (status) {
        case 'success':
            prefix = 'Sucesso, deu tudo certo.'
            break;
        case 'error':
            prefix = 'Erro, ocoreu um problema.'
            break;
        case 'info':
            prefix = 'Informação.'
            break;
        case 'warning':
            prefix = 'Aviso, leia com atenção.'
            break;
    
        default:
            break;
    }
    return(
            <Alert 
                borderRadius='full' 
                w="100%" 
                mt={5}
                status={status} 
                variant='solid' 
                colorScheme={status}
                pl={10}
                pr={10}
            >
            <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" color='white' />
                    <Text fontSize="md" color="white" >
                        {prefix} {text}
                    </Text>
                </HStack>
            </HStack>
            </VStack>
            </Alert>
    );
}
