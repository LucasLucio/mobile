import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

interface Props extends IButtonProps{
    title: String;
    type?: 'PRIMARY' | 'SECONDARY'
}

export function Button({title, type = 'PRIMARY', ...rest}: Props){
    return(
        <ButtonNativeBase 
            w='full'
            h={14}
            m={15}
            rounded='full'
            fontSize='md'
            bg={type === 'SECONDARY' ? 'blue.900' : 'blue.500'}
            _pressed={{
                bg: type === 'SECONDARY' ? 'blue.800' : 'blue.400'
            }}
            {...rest}
        >
            <Text
                fontSize='md'
                color='white'
            >
                {title}
            </Text>
        </ButtonNativeBase>
    );
}