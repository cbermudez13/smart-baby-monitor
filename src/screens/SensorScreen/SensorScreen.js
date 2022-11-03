import React, {useState,useEffect} from 'react';
import { Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import awsmobile from '../../aws-exports';
import {useNavigation} from '@react-navigation/native';
import { View, StyleSheet, Button, Text } from 'react-native';

Amplify.configure(awsmobile);

var SUB_TOPIC = "esp32/pub";
var PUB_TOPIC = "esp32/sub";

// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: 'us-east-1',
  aws_pubsub_endpoint: 'wss://aoa59ba33x299-ats.iot.us-east-1.amazonaws.com/mqtt',
}));

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info.identityId;
  console.log(cognitoIdentityId);
});

var sensorData; 





const SensorScreen = () => {
  /*
  * Find a way to display sensor data on mobile app
  * data.value.farenheit ---> display farenheit value
  */
  const [tempVal, setTempVal] = useState(1);
  const navigation = useNavigation();

  useEffect(()=> {
    PubSub.subscribe(SUB_TOPIC).subscribe({
      next: data => setTempVal(data.value.Fahrenheit),
      error: error => console.error(error),
      complete: () => console.log('Done'),
    });
  },[])
  return (
    
    <View style={styles.container}>
      
      
      <Button style={[styles.buttons]} title="Go back" onPress={() => navigation.goBack()} />
      <Text style={styles.titleText}>
        Temperature: {tempVal}
     </Text>

    </View>
  );
    
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    bottom: 400,
    elevation: 5,
  },
  baseText: {
    fontFamily: "Cochin"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
    justifyContent: 'center',
    position: 'center',
    bottom: -300,
   
  },
  
});

export default SensorScreen;