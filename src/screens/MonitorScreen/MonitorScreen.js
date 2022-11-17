import React, {useState,useEffect} from 'react';
import { View, StyleSheet, Button, Pressable, Text} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import {useNavigation} from '@react-navigation/native';
import { KinesisVideoArchivedMedia } from "@aws-sdk/client-kinesis-video-archived-media";



/*for sample video for test: https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4 */
const Header = () => (
  <View style={monitorStyle.headerContainer}>
    <Text style={monitorStyle.headerTitle}>Livestream Monitor</Text>
  </View>
);

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

  return (
    
    <View style={styles.container}>
      <Header/>
      <Video
        ref={video}
        style={styles.video}
        
        source={{
          uri: url
         // uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttonContainer}>
        <Button
          color="#841584"
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
          
        />
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#efd7fc',
  },
  video: {
    alignSelf: 'center',
    width: 430,
    height: 350,
    bottom: 160,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    bottom: 400,
    elevation: 5,
  },
  buttonText: {
    color: '#ffe6f7',
    fontWeight: '300',
    padding: 50,
    fontSize: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#da9afc',
    width: 100,
    height: 40,
    bottom: 100,
    borderRadius: 200,
    paddingHorizontal: 8,
  },
});
const monitorStyle = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#efd7fc',
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    bottom: 160,
  },
  headerTitle: {
    color: '#da9afc',
    fontSize: 30,
    fontWeight: '700',
    paddingVertical: 16,
    textAlign: 'center',
  },
  infantContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 4,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  infantHeading: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkbox: {
    borderRadius: 2,
    borderWidth: 2,
    fontWeight: '700',
    height: 20,
    marginLeft: 'auto',
    textAlign: 'center',
    width: 20,
  },
  completedCheckbox: {
    backgroundColor: '#000',
    color: '#fff',
  },
  buttonText: {
    color: '#ffe6f7',
    fontWeight: '800',
    padding: 50,
    fontSize: 35,
    textAlign: 'center',
    bottom: -30,


  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#da9afc',
    width: 250,
    height: 250,
    borderRadius: 200,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 300,
    elevation: 5,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: 'auto',
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default MonitorScreen;
