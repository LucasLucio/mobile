import { Checkbox, FormControl, ICheckboxProps, Icon, IInputProps, Input, Pressable, Text, WarningOutlineIcon } from "native-base";
import { FontAwesome } from '@expo/vector-icons'
import React from "react";

interface InputProps extends IInputProps {
  name: string;
  error?: string ;
}

interface CheckProps extends ICheckboxProps {
    name: string;
    value: string;
    error?: string | undefined;
  }
  
export function InputText({ name, error, ...rest }: InputProps) {
    return (
        <FormControl isInvalid={error ? true : false}>
            <Input
                w="full"
                h={14}
                m={2}
                rounded='xl'
                focusOutlineColor='blue.500'
                invalidOutlineColor='red.500'
                backgroundColor='gray.200'
                placeholder={name}
                isInvalid={error ? true : false}
                {...rest}
            />
            <FormControl.ErrorMessage ml={5} mt={-1} mb={2} leftIcon={<WarningOutlineIcon size="xs" />}>
                {error}
            </FormControl.ErrorMessage>
      </FormControl>
    );
}

export function InputPassword({ name, error, ...rest }: InputProps) {
    const [show, setShow] = React.useState(false);
    return (
        <FormControl isInvalid={error ? true : false}>
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
                isInvalid={error ? true : false}
                {...rest}
            />
            <FormControl.ErrorMessage ml={5} mt={-1} mb={2} leftIcon={<WarningOutlineIcon size="xs" />}>
                {error}
            </FormControl.ErrorMessage>
      </FormControl>
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