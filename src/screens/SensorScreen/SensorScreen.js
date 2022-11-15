import React, {useState,useEffect,useRef} from 'react';
import { Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import awsmobile from '../../aws-exports';
import {useNavigation} from '@react-navigation/native';
import { View, StyleSheet, Button, Text } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Amplify.configure(awsmobile);

var SUB_TOPIC_BODY_TEMP = "esp32/pub";
var SUB_TOPIC_ROOM_TEMP = "home/RPI4";
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


const Header = () => (
  <View style={monitorStyle.headerContainer}>
    <Text style={monitorStyle.headerTitle}>Sensors</Text>
  </View>
);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const SensorScreen = () => {
  /*
  * Find a way to display sensor data on mobile app
  * data.value.farenheit ---> display farenheit value
  */

  const [expoPushToken, setExpoPushToken] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [bodyTempVal, setBodyTempVal] = useState(1);
  const [heartRateVal, setHeartRateVal] = useState(1);
  const [roomTempVal, setRoomTempVal] = useState(1);

  const tempVal = 100;

  const navigation = useNavigation();

  useEffect(()=> {
    PubSub.subscribe(SUB_TOPIC_BODY_TEMP).subscribe({
      next: data => setBodyTempVal(data.value.Fahrenheit),
      error: error => console.error(error),
      complete: () => console.log('Done'),
    });
    PubSub.subscribe(SUB_TOPIC_BODY_TEMP).subscribe({
      next: data => setHeartRateVal(data.value.BPM),
      error: error => console.error(error),
      complete: () => console.log('Done'),
    });
    PubSub.subscribe(SUB_TOPIC_ROOM_TEMP).subscribe({
     // next: data => setTempVal(data.value),
      next: data => setRoomTempVal(data.value),
      error: error => console.error(error),
      complete: () => console.log('Done'),
    });
  },[])

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    registerNativeDeviceNotificationsAsync().then(deviceToken => setDeviceToken(deviceToken));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  (async () => {
    if(heartRateVal > 200){
      await sendBPMPushNotification(expoPushToken,heartRateVal);
    }
    
  })();
  
  (async () => {
    if(bodyTempVal > 200){
      await sendBodyTempPushNotification(expoPushToken,bodyTempVal);
    }
    
  })();

  (async () => {
    if(roomTempVal > 200){
      await sendRoomTempPushNotification(expoPushToken,roomTempVal);
    }
    
  })();

  return (
    
    <View style={styles.container}>
      <Header/>
      <Text style={styles.titleText}>
        Heart Rate: {heartRateVal} bpm {"\n"}{"\n"}
        Oxygen level: 50% {"\n"}{"\n"}
        Body temperature: {bodyTempVal}  {"\n"}{"\n"}
        Room Temperature: 70 {"\n"}{"\n"}
        Humidity: 30 {"\n"}{"\n"}

     </Text>

    </View>
  );
    
}

async function sendBPMPushNotification(expoPushToken, heartRateVal) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Heart Rate Notification',
    body: 'Heart rate is at '+ heartRateVal+ ' BPM. Check on infant immediately!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
async function sendBodyTempPushNotification(expoPushToken, bodyTempVal) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Body Temperature Notification',
    body: 'Body Temperature is at ' + bodyTempVal +' Farenheit. Check on infant immediately!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
async function sendRoomTempPushNotification(expoPushToken, roomTempVal) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Room Temperature Notification',
    body: 'Room Temperature is at ' + roomTempVal +' Farenheit. Check for safe room temperature!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async function registerNativeDeviceNotificationsAsync() {
    let deviceToken;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
      console.log(deviceToken);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return deviceToken;
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    backgroundColor: '#efd7fc',
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
    bottom: -200,
   
  },
  
});

const monitorStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#efd7fc',
  },
  headerContainer: {
    backgroundColor: '#efd7fc',
    bottom: 0
   
    
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

export default SensorScreen;