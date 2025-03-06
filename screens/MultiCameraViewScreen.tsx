import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {loadCameras, Camera} from './cameraStorage';
import {VLCPlayer} from 'react-native-vlc-media-player';
import {RootStackParamList} from '../App';

// Define route prop type
type MultiCameraViewScreenRouteProp = RouteProp<
  RootStackParamList,
  'MultiCameraViewScreen'
>;

const MultiCameraViewScreen = () => {
  const route = useRoute<MultiCameraViewScreenRouteProp>();
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const fetchCameras = async () => {
      if (route.params?.selectedCameras?.length) {
        setCameras(route.params.selectedCameras);
      } else {
        const storedCameras = await loadCameras();
        setCameras(storedCameras);
      }
    };
    fetchCameras();
  }, [route.params?.selectedCameras]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Multi-Camera View</Text>
      {cameras.length === 0 ? (
        <Text style={styles.noCameraText}>No cameras selected.</Text>
      ) : (
        cameras.map(camera => (
          <View key={camera.deviceName} style={styles.cameraContainer}>
            <Text style={styles.cameraTitle}>{camera.deviceName}</Text>
            <VLCPlayer
              style={styles.videoPlayer}
              source={{
                uri: `rtsp://${camera.username}:${camera.password}@${camera.host}:${camera.port}/live`,
              }}
              resizeMode="contain"
              autoplay={true}
              autoAspectRatio={true}
              onError={e =>
                console.log(`Error loading camera ${camera.deviceName}:`, e)
              }
              onEnd={() =>
                console.log(
                  `Stream ended for ${camera.deviceName}, retrying...`,
                )
              }
            />
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default MultiCameraViewScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noCameraText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  cameraContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoPlayer: {
    width: 300,
    height: 200,
    backgroundColor: 'black',
  },
});
