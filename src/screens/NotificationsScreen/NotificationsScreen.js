import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet} from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Header = () => (
  <View style={monitorStyle.headerContainer}>
    <Text style={monitorStyle.headerTitle}>Livestream Monitor</Text>
  </View>
);


const NotificationsScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        <Header/>
      <Text>Your expo push token: {expoPushToken} {'\n'}</Text>
      <Text>Your APN push token: {deviceToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
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

  const monitorStyle = StyleSheet.create({
    headerContainer: {
      backgroundColor: '#efd7fc',
      //paddingTop: Platform.OS === 'ios' ? 50 : 0,
      flex: 1
    },
    headerTitle: {
      color: '#da9afc',
      fontSize: 40,
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


export default NotificationsScreen;
