import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const MultiCameraViewScreen = ({ route }:any) => {
  const { cameras } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={cameras}
        keyExtractor={(item) => item.url}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.videoContainer}>
            <Video source={{ uri: item.url }} style={styles.video} resizeMode="cover" controls />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { flex: 1, aspectRatio: 1 },
  video: { width: '100%', height: '100%' },
});

export default MultiCameraViewScreen;
