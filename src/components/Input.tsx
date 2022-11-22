import {
  Checkbox,
  CheckIcon,
  FormControl,
  ICheckboxProps,
  Icon,
  IInputProps,
  Input,
  ISelectProps,
  Pressable,
  Select,
  Text,
  WarningOutlineIcon,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";

interface InputProps extends IInputProps {
  name: string;
  error?: string;
  size?: string | '100%';
}

interface CheckProps extends ICheckboxProps {
  name: string;
  value: string;
  error?: string | undefined;
}
export interface ValueSelect {
    name: string;
    value: number | string;
}
export interface SelectProps extends ISelectProps {
    name: string;
    values: ValueSelect[];
    error?: string | undefined;
    size: string;
}

export function InputText({ name, error, size, ...rest }: InputProps) {
  return (
    <FormControl isInvalid={error ? true : false} w={size}>
      <Input
        w="96%"
        h={14}
        m={2}
        rounded="xl"
        focusOutlineColor="blue.500"
        invalidOutlineColor="red.500"
        backgroundColor="gray.200"
        placeholder={name}
        isInvalid={error ? true : false}
        {...rest}
      />
      <FormControl.ErrorMessage
        ml={5}
        mt={-1}
        mb={2}
        leftIcon={<WarningOutlineIcon size="xs" />}
      >
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
        w="96%"
        h={14}
        m={2}
        rounded="xl"
        focusOutlineColor="blue.500"
        backgroundColor="gray.200"
        type={show ? "text" : "password"}
        placeholder={name}
        InputRightElement={
          <Pressable onPress={() => setShow(!show)}>
            <Icon
              as={<FontAwesome name={show ? "eye" : "eye-slash"} />}
              size={5}
              mr="5"
              color="muted.400"
            />
          </Pressable>
        }
        isInvalid={error ? true : false}
        {...rest}
      />
      <FormControl.ErrorMessage
        ml={5}
        mt={-1}
        mb={2}
        leftIcon={<WarningOutlineIcon size="xs" />}
      >
        {error}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

export function InputCheck({ name, value, ...rest }: CheckProps) {
  return (
    <Checkbox
      value={value}
      accessibilityLabel={name}
      size="md"
      colorScheme="blue"
      m={2}
      {...rest}
    >
      <Text color="blue.500" fontWeight="bold">
        {name}
      </Text>
    </Checkbox>
  );
}

export function InputSelect({ name, values, error, size, ...rest }: SelectProps) {
  return (
    <FormControl
     isInvalid={error ? true : false}
     w={size}
     >
      <Select
        h={14}
        m={2}
        w='100%'
        rounded="xl"
        backgroundColor="gray.200"
        placeholder={name}
        accessibilityLabel="Clique e Escolha"
        _selectedItem={{
          endIcon: <CheckIcon size={5} />,
        }}
        {...rest}
      >
        {values.map(function (value :ValueSelect, i){
            return (<Select.Item  label={value.name} value={`${value.value}`} key={`${value.value}`} />);
        })}
      </Select>
      <FormControl.ErrorMessage
        ml={5}
        mt={-1}
        mb={2}
        leftIcon={<WarningOutlineIcon size="xs" />}
      >
        {error}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
