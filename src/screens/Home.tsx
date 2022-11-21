import { Center, Text, Icon, View, useToast, VStack, Overlay } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import  MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Toast } from '../components/Toast';
import { Button } from '../components/Button';
import { DialogInform, Dialog } from '../components/AlertDialog';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Home() {
    const toast = useToast();
    const [origin, setOrigin] = useState(null);
    const [load, setLoad] = useState(false);

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          toast.show({
            render: () => {
              return <Toast text={'O uso do GPS é obrigtório.'} status='error' />;
            },
            placement: 'top'
          });
          return;
        }
  
        let location = await Location.getCurrentPositionAsync(
          {accuracy: 3}
        );
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      })();
    }, []);

    async function enviarLocalizacao(){
      setDialogOpen(false);
      let location = await Location.getCurrentPositionAsync(
        {accuracy: 3}
      );
      const tokenValue = await AsyncStorage.getItem('@token');
      console.log(tokenValue);
      const response = await api.post('/localizacao/localizacao-atual',{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      {
        headers: { Authorization: `Bearer ${tokenValue}` }
      })
        .then(async (response) => {
            setLoad(false);
            //displayDialog('Sucesso', 'Agora você está pronto para conseguir mais fretes.', 'Ir para o Login');
        })
        .catch(async (error) => {
          toast.show({
            render: () => {
              return <Toast text={error.response.data.message} status='error' />;
            },
            placement: 'top'
          });
        });
    }

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogBody, setDialogBody] = useState('');
    const dialogRef = useRef(null);

    function displayDialog(title: string, body: string){
      setDialogOpen(true);
      setDialogTitle(title);
      setDialogBody(body)
    }

    return (
        <Center flex={1} bgColor="gray.100" padding={8}>
           <Dialog
                title={dialogTitle} 
                body={dialogBody}
                cancelRef={dialogRef}
                isOpen={dialogOpen}
                leastDestructiveRef={dialogRef}
                onFalse={() => { setDialogOpen(false); }}
                onTrue={async () => { await enviarLocalizacao() }}
              />
          <View style={styles.container}>

            <MapView
              initialRegion={origin}
              showsUserLocation={true}
              zoomEnabled={true}
              loadingEnabled={true}
              showsPointsOfInterest={false}
              style={styles.map}
              customMapStyle={mapStyle}
            >
            </MapView>
            <View
              style={{
                position: 'absolute',
                bottom: '5%',
                alignSelf: 'center'
              }}
            >
              <Button 
                title='Enviar localização'
                mt={2}
                mb={1}
                onPress={() => {displayDialog(
                  'Enviar',
                  'Deseja realmente enviar sua localização atual ?'
                )}}
              />
              <Button 
                title='Enviar Previsão'
                mt={2}
                mb={1}
                type='SECONDARY'
              />
            </View>
          </View>

        </Center>
    );
  }
  
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      marginTop: 32,
    },
    botoes: {
      elevation:10
    }
  });