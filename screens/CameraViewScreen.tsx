import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';

import {RouteProp} from '@react-navigation/native';
import {Camera} from './cameraStorage';

type CameraViewScreenProps = {
  route: RouteProp<{CameraViewScreen: {camera: Camera}}, 'CameraViewScreen'>;
};

const CameraViewScreen: React.FC<CameraViewScreenProps> = ({route}) => {
  const {camera} = route.params;

  // Generate RTSP URL (Modify this according to your camera's streaming URL format)
  const rtspUrl = `rtsp://${camera.username}@${camera.host}:${camera.port}/live`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viewing Camera: {camera.deviceName}</Text>
      <VLCPlayer
        style={styles.video}
        source={{uri: rtspUrl}}
        autoplay={true}
        resizeMode="contain"
        onError={(e) => console.log(`Error loading camera ${camera.deviceName}:`, e)}
        onEnd={() => console.log(`Stream ended for ${camera.deviceName}, retrying...`)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {color: 'white', fontSize: 18, marginBottom: 10},
  video: {width: '100%', height: '80%'},
});

export default CameraViewScreen;
