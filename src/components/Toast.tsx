import { Alert, Box, Button as ButtonNativeBase, CloseIcon, HStack, IButtonProps, Icon, IconButton, ScrollView, Stack, Text, VStack } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

interface Props{
    text: String;
    status: 'success' | 'error' | 'info' | 'warning';
}

export function ToastError({text, status}: Props){
    return(
        <Box alignItems='center'>
            <Alert 
                borderRadius='full' 
                w="90%" 
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
                <Text fontSize="md" color="white" marginRight={5}>
                    {text}
                </Text>
                </HStack>
            </HStack>
            </VStack>
            </Alert>
        </Box>
    );
}
