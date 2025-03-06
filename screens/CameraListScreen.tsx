import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the navigation types
type RootStackParamList = {
  CameraList: undefined;
  MultiCameraView: { cameras: { name: string; url: string }[] };
};

type Props = NativeStackScreenProps<RootStackParamList, 'CameraList'>;

const CameraListScreen: React.FC<Props> = ({ navigation }) => {
  const [cameras, setCameras] = useState<{ name: string; url: string }[]>([]);
  const [newCamera, setNewCamera] = useState({ name: '', url: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    const storedCameras = await AsyncStorage.getItem('cameras');
    if (storedCameras) {
      setCameras(JSON.parse(storedCameras));
    }
  };

  const saveCameras = async (updatedCameras: { name: string; url: string }[]) => {
    setCameras(updatedCameras);
    await AsyncStorage.setItem('cameras', JSON.stringify(updatedCameras));
  };

  const addCamera = async () => {
    if (!newCamera.name || !newCamera.url) {
      Alert.alert('Error', 'Please enter both name and URL');
      return;
    }
    const updatedCameras = [...cameras, newCamera];
    await saveCameras(updatedCameras);
    setNewCamera({ name: '', url: '' });
  };

  const editCamera = (index: number) => {
    setNewCamera(cameras[index]);
    setEditingIndex(index);
  };

  const updateCamera = async () => {
    if (editingIndex === null) return;
    if (!newCamera.name || !newCamera.url) {
      Alert.alert('Error', 'Please enter both name and URL');
      return;
    }
    const updatedCameras = [...cameras];
    updatedCameras[editingIndex] = newCamera;
    await saveCameras(updatedCameras);
    setNewCamera({ name: '', url: '' });
    setEditingIndex(null);
  };

  const deleteCamera = async (index: number) => {
    Alert.alert('Delete Camera', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: async () => {
          const updatedCameras = cameras.filter((_, i) => i !== index);
          await saveCameras(updatedCameras);
        } 
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingIndex !== null ? 'Edit Camera' : 'Add a Camera'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Camera Name"
        value={newCamera.name}
        onChangeText={(text) => setNewCamera({ ...newCamera, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="RTSP URL"
        value={newCamera.url}
        onChangeText={(text) => setNewCamera({ ...newCamera, url: text })}
      />
      {editingIndex !== null ? (
        <TouchableOpacity style={styles.updateButton} onPress={updateCamera}>
          <Text style={styles.buttonText}>Update Camera</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={addCamera}>
          <Text style={styles.buttonText}>Add Camera</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={cameras}
        keyExtractor={(item) => item.url}
        renderItem={({ item, index }) => (
          <View style={styles.cameraItem}>
            <Text style={styles.cameraText}>{item.name}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => editCamera(index)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCamera(index)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => navigation.navigate('MultiCameraView', { cameras })}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  addButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center' },
  updateButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  cameraItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  cameraText: { fontSize: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  editButton: { backgroundColor: '#ffc107', padding: 8, borderRadius: 5 },
  deleteButton: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
  viewButton: { backgroundColor: '#007BFF', padding: 8, borderRadius: 5 },
});

export default CameraListScreen;
