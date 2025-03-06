import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';

import CameraListScreen from './screens/CameraListScreen';
import MultiCameraViewScreen from './screens/MultiCameraViewScreen';
import { Platform } from 'react-native';

export type RootStackParamList = {
  CameraList: undefined;
  MultiCameraView: { cameras: CameraInfo[] };
};

export interface CameraInfo {
  name: string;
  url: string;
}

const Stack = createStackNavigator<RootStackParamList>();
const isTV = Platform.isTV;
const App = () => {
  useEffect(() => {
    const setOrientation = async () => {
      if (isTV) {
        Orientation.lockToPortrait(); // Lock to Portrait for Xiaomi TV Box
      }
    };

    setOrientation();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CameraList" component={CameraListScreen} options={{ title: 'Select Cameras' }} />
        <Stack.Screen name="MultiCameraView" component={MultiCameraViewScreen} options={{ title: 'Multi View' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
