import { Checkbox, ICheckboxProps, Icon, IInputProps, Input, Pressable, Text } from "native-base";
import { FontAwesome } from '@expo/vector-icons'
import React from "react";

interface InputProps extends IInputProps {
  name: string;
}

interface CheckProps extends ICheckboxProps {
    name: string;
    value: string;
  }
  
export function InputText({ name, ...rest }: InputProps) {
    return (
        <Input
        w="full"
        h={14}
        m={2}
        rounded='xl'
        focusOutlineColor='blue.500'
        backgroundColor='gray.200'
        placeholder={name}
        {...rest}
        />
    );
}

export function InputPassword({ name , ...rest }: InputProps) {
    const [show, setShow] = React.useState(false);
    return (
        <Input
        w="full"
        h={14}
        m={2}
        rounded='xl'
        focusOutlineColor='blue.500'
        backgroundColor='gray.200'
        type={show ? "text" : "password"}
        placeholder={name}
        InputRightElement={<Pressable onPress={() => setShow(!show)}>
                <Icon as={<FontAwesome name={show ? "eye" : "eye-slash"} />} size={5} mr="5" color="muted.400" />
            </Pressable>}      
        {...rest}
        />
    );
}

export function InputCheck({ name, value,  ...rest } : CheckProps) {
    return (
        <Checkbox
            value={value} 
            accessibilityLabel={name}
            size='md' 
            colorScheme='blue'
            m={2}
            {...rest}
        >
            <Text
                color='blue.500'
                fontWeight='bold'
            >
                {name}
            </Text>
        </Checkbox>
    );
}