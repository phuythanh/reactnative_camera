import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  loadCameras,
  saveCameras,
  DEFAULT_CAMERA,
  Camera,
} from './cameraStorage';
import {RootStackParamList} from '../App';

// Define navigation type
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CameraListScreen'
>;

const CameraListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [newCamera, setNewCamera] = useState<Camera>({
    host: '',
    port: 0,
    deviceName: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    const fetchCameras = async () => {
      const storedCameras = await loadCameras();
      if (storedCameras.length === 0) {
        await saveCameras([DEFAULT_CAMERA]);
        setCameras([DEFAULT_CAMERA]);
      } else {
        setCameras(storedCameras);
      }
    };
    fetchCameras();
  }, []);

  const toggleSelectCamera = (camera: Camera) => {
    setSelectedCameras(prevSelected =>
      prevSelected.some(c => c.deviceName === camera.deviceName)
        ? prevSelected.filter(c => c.deviceName !== camera.deviceName)
        : [...prevSelected, camera],
    );
  };

  const addCamera = () => {
    if (
      !newCamera.host ||
      !newCamera.port ||
      !newCamera.deviceName ||
      !newCamera.username
    ) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }

    const updatedCameras = [...cameras, newCamera];
    saveCameras(updatedCameras);
    setCameras(updatedCameras);
    setNewCamera({
      host: '',
      port: 0,
      deviceName: '',
      username: '',
      password: '',
    });
  };

  const deleteCamera = (deviceName: string) => {
    const updatedCameras = cameras.filter(
      camera => camera.deviceName !== deviceName,
    );
    saveCameras(updatedCameras);
    setCameras(updatedCameras);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Cameras</Text>

      <FlatList
        data={cameras}
        keyExtractor={item => item.deviceName}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => toggleSelectCamera(item)}
            onLongPress={() => deleteCamera(item.deviceName)}
            style={[
              styles.cameraItem,
              selectedCameras.some(c => c.deviceName === item.deviceName) &&
                styles.selectedCamera,
            ]}>
            <Text style={styles.cameraText}>{item.deviceName}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Add New Camera Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add New Camera</Text>
        <TextInput
          placeholder="Host"
          value={newCamera.host}
          onChangeText={text => setNewCamera({...newCamera, host: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Port"
          keyboardType="numeric"
          value={newCamera.port ? String(newCamera.port) : ''}
          onChangeText={text =>
            setNewCamera({...newCamera, port: Number(text)})
          }
          style={styles.input}
        />
        <TextInput
          placeholder="Device Name"
          value={newCamera.deviceName}
          onChangeText={text => setNewCamera({...newCamera, deviceName: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={newCamera.username}
          onChangeText={text => setNewCamera({...newCamera, username: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Password (Optional)"
          secureTextEntry
          value={newCamera.password}
          onChangeText={text => setNewCamera({...newCamera, password: text})}
          style={styles.input}
        />
        <TouchableOpacity onPress={addCamera} style={styles.addButton}>
          <Text style={styles.buttonText}>Add Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Navigate to Multi-Camera View */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MultiCameraViewScreen', {selectedCameras})
        }
        style={styles.viewButton}>
        <Text style={styles.buttonText}>View Selected Cameras</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'gray',
  },
  selectedCamera: {
    backgroundColor: 'green',
  },
  cameraText: {
    color: 'white',
  },
  form: {
    marginTop: 20,
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    marginBottom: 5,
    padding: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  viewButton: {
    backgroundColor: 'blue',
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
