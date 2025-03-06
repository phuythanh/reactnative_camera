import AsyncStorage from '@react-native-async-storage/async-storage';

export type Camera = {
  host: string;
  port: number;
  deviceName: string;
  username: string;
  password?: string;
};

const CAMERA_STORAGE_KEY = 'cameraList';

// Default camera configuration
export const DEFAULT_CAMERA: Camera = {
  host: 'maugiaohungngan1.ddns.net',
  port: 20247,
  deviceName: 'tt2',
  username: 'khoinguyen',
  password: '', // No password required
};

// Load cameras from AsyncStorage
export const loadCameras = async (): Promise<Camera[]> => {
  const data = await AsyncStorage.getItem(CAMERA_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Save cameras to AsyncStorage
export const saveCameras = async (cameras: Camera[]) => {
  await AsyncStorage.setItem(CAMERA_STORAGE_KEY, JSON.stringify(cameras));
};

// Ensure the default camera is added
export const initializeDefaultCamera = async (): Promise<Camera[]> => {
  const cameras = await loadCameras();
  if (cameras.length === 0) {
    await saveCameras([DEFAULT_CAMERA]);
    return [DEFAULT_CAMERA]; // Return updated camera list
  }
  return cameras;
};
