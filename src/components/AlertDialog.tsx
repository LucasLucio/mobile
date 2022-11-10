import { AlertDialog, Box, Button as ButtonNativeBase, IButtonProps, Text, VStack } from 'native-base';
import { IAlertDialogProps } from 'native-base/lib/typescript/components/composites';
import Question from '../assets/alertQuestion.svg';
import Confirm from '../assets/alertConfirm.svg';
import React from 'react';

interface DialogProps extends IAlertDialogProps{
    title: string;
    body: string;
    isOpen: boolean;
    cancelRef: any;
    onFalse: any;
    onTrue: any;
}

interface DialogInformProps extends IAlertDialogProps{
  title: string;
  body: string;
  confirmText: string;
  isOpen: boolean;
  cancelRef: any;
  onConfirm: any;
}


/*
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogBody, setDialogBody] = React.useState('');
  const [dialogType, setDialogType] = React.useState('');
  const dialogRef = React.useRef(null);
  function displayDialog(dialogProps: DialogProps){
    setDialogOpen(true);
    setDialogTitle(dialogProps.Title);
    setDialogBody(dialogProps.Body)
    setDialogType(dialogProps.Type)
  }
  function dialogReturn(res: boolean){
    console.log(res);
  }

*/

export function Dialog({title, body, isOpen, cancelRef, onFalse, onTrue}: DialogProps){  
    return(
        <AlertDialog animationPreset='slide' borderRadius={50} isOpen={isOpen} leastDestructiveRef={cancelRef}>
        <AlertDialog.Content borderRadius={40}>
          <AlertDialog.Header borderBottomWidth={0}></AlertDialog.Header>
          <AlertDialog.Body alignItems='center'> 
                <Box
                  mb={10}
                >
                  <Question/>
                </Box>
                <Text 
                    textAlign='center' 
                    fontSize='xl'
                    color='blue.500'
                    fontWeight={'bold'}
                  >
                    {title}
                  </Text>
                  <Text 
                    textAlign='center' 
                    fontSize='md'
                    color='blue.900'
                    fontWeight={'semibold'}
                  >
                    {body}
                  </Text>
                
          </AlertDialog.Body>
          <AlertDialog.Footer borderTopWidth={0} alignItems='center' justifyContent='center'>
            <ButtonNativeBase.Group space={2} justifyContent='center' alignItems='center'>
              <ButtonNativeBase 
                colorScheme="danger" 
                onPress={onFalse}
                borderRadius='full'
                pl={5}
                pr={5}
                mr={10}
              >
                Nao
              </ButtonNativeBase>
              <ButtonNativeBase 
                colorScheme="success" 
                onPress={onTrue} 
                borderRadius='full'
                pl={5}
                pr={5}
                ml={10}
              >
                  Sim
              </ButtonNativeBase>
            </ButtonNativeBase.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
}



/*
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogConfirmText, setDialogConfirmText] = React.useState('');
  const [dialogBody, setDialogBody] = React.useState('');
  const dialogRef = React.useRef(null);
  function displayDialog(title : string, body: string, confirmText: string){
    setDialogOpen(true);
    setDialogTitle(title);
    setDialogBody(body)
    setDialogConfirmText(confirmText)
  }
  function dialogReturn(res: boolean){
    console.log(res);
  }
*/

export function DialogInform({title, body, confirmText, isOpen, cancelRef, onConfirm, }: DialogInformProps){  
  return(
      <AlertDialog animationPreset='slide' closeOnOverlayClick={true} borderRadius={50} isOpen={isOpen} leastDestructiveRef={cancelRef}>
      <AlertDialog.Content borderRadius={40}>
        <AlertDialog.Header borderBottomWidth={0}></AlertDialog.Header>
        <AlertDialog.Body alignItems='center'> 
              <Box
                mb={10}
              >
                <Confirm/>
              </Box>
              <Text 
                  textAlign='center' 
                  fontSize='xl'
                  color='blue.500'
                  fontWeight={'bold'}
                >
                  {title}
                </Text>
                <Text 
                  textAlign='center' 
                  fontSize='md'
                  color='blue.900'
                  fontWeight={'semibold'}
                >
                  {body}
                </Text>
              
        </AlertDialog.Body>
        <AlertDialog.Footer borderTopWidth={0} alignItems='center' justifyContent='center'>
          <VStack>
            <ButtonNativeBase 
              bg={'blue.500'}
              _pressed={{
                bg: 'blue.400'
              }}
              onPress={onConfirm} 
              borderRadius='full'
              pl={5}
              pr={5}
            >
                {confirmText}
            </ButtonNativeBase>
          </VStack>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}