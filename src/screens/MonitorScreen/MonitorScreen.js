import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import {useNavigation} from '@react-navigation/native';
import { KinesisVideoArchivedMediaClient, GetHLSStreamingSessionURLCommand  } from "@aws-sdk/client-kinesis-video-archived-media";



/*for sample video for test: https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4 */


//Test with live stream

const MonitorScreen = () => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const navigation = useNavigation();

  const getURL = async () => {

    const accessKeyId = 'AKIAW5OOD6O2MI4G6H5V';
    const secretAccessKey = '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';
    const region = 'us-east-1';
    const streamName = 'LiveRekognitionVideoAnalysisBlog';
    const streamARN = 'arn:aws:kinesisvideo:us-east-1:475563029428:stream/LiveRekognitionVideoAnalysisBlog/1661882647679';
    const playbackMode = 'LIVE';

    const options = {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    };
    const params = {
      StreamARN: streamARN,
      StreamName: streamName,
      PlaybackMode: playbackMode
    };

    const client = new KinesisVideoArchivedMediaClient(options);
    const command = new GetHLSStreamingSessionURLCommand(params);

    try {
      const data = await client.send(command);
      console.log('data: ', data);
     
    } catch (err) {
      console.log("Custom Error", err);
    }
  };

  const URL = getURL();

{/* uri: URL,*/}
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        
        source={{
          
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.container}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
      <View style={styles.buttons}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
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
    width: 430,
    height: 350,
    bottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    bottom: 400,
    elevation: 5,
  },
});

export default MonitorScreen;
