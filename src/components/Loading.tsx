import {Center, Spinner} from 'native-base';

export function Loading() {
    return (
        <Center flex={1} bgColor="gray.1000">
            <Center>
                <Spinner color="blue.500" />
            </Center>
        </Center>
    );
}