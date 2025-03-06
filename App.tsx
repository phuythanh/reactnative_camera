import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import CameraListScreen from './screens/CameraListScreen';
import CameraViewScreen from './screens/CameraViewScreen';
import MultiCameraViewScreen from './screens/MultiCameraViewScreen';
import { Camera } from './screens/cameraStorage';

export type RootStackParamList = {
  CameraListScreen: undefined;
  CameraViewScreen: { camera: Camera };
  MultiCameraViewScreen: { selectedCameras: Camera[] };
};
export type CameraViewScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraViewScreen'>;
export type MultiCameraViewScreenProps = NativeStackScreenProps<RootStackParamList, 'MultiCameraViewScreen'>;
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CameraListScreen">
        <Stack.Screen name="CameraListScreen" component={CameraListScreen} options={{ title: 'Cameras' }} />
        <Stack.Screen name="CameraViewScreen" component={CameraViewScreen} options={{ title: 'Camera View' }} />
        <Stack.Screen name="MultiCameraViewScreen" component={MultiCameraViewScreen} options={{ title: 'Multi Camera View' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
