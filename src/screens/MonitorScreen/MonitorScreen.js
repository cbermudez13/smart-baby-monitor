import React, {useState,useEffect} from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import {useNavigation} from '@react-navigation/native';
import { KinesisVideoArchivedMedia } from "@aws-sdk/client-kinesis-video-archived-media";



/*for sample video for test: https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4 */


const MonitorScreen = () => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const navigation = useNavigation();
  const [url, setUrl] = useState(1);
  
  useEffect(() => {
    const getURL = async () => {

     


      const accessKeyId = '';
      const secretAccessKey = '';
      const region = '';
      const streamName = '';
      const streamARN = '';
      const playbackMode = 'LIVE';
      const endpoint = '';
  
      const credentials = {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      };
    
      const options = {
        credentials: credentials,
        endpoint: endpoint,
        region: region,
      };
      const params = {
        StreamARN: streamARN,
        PlaybackMode: playbackMode
      };
  
      const client = new KinesisVideoArchivedMedia(options);
  
  
      try {
       // const data = await client.send(command);
        const data = await client.getHLSStreamingSessionURL(params);
        setUrl(data.HLSStreamingSessionURL); 
      
     
      } catch (err) {
        console.log("Custom Error", err);
      }
    
    };
    getURL();
  }, []);


{/* uri: URL,*/}
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        
        source={{
          //uri: url,
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
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
