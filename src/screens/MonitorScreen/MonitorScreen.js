import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import {useNavigation} from '@react-navigation/native';

const MonitorScreen = () => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://b-5c274045.kinesisvideo.us-east-1.amazonaws.com/hls/v1/getHLSMasterPlaylist.m3u8?SessionToken=CiCsKHjYbNqs2SFDJ_P4oUZdQQ6vy2rrd_sVz7svRvaA0hIQPMuITLaB6ldAz9ZvO7wVBxoZbkLyFR7K4N3jErSeZF5zKg6sS7_oDbccnCIgwOkKq8jPD7ydd3uitbnjB3K5opGrlJT8DiH9HdFhH2M~',
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MonitorScreen;
