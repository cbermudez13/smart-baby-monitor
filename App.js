import React, { Component, Fragment } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Switch} from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { DataStore } from '@aws-amplify/datastore';
import { withAuthenticator} from 'aws-amplify-react-native/dist/Auth';
import { AmplifyTheme } from 'aws-amplify-react-native';
import HomeScreen from './src/screens/HomeScreen/index.js';
import Navigation from './src/navigation/index.js';
import TabNavigation from './src/navigation/TabNavigation.js';
import SensorScreen from './src/screens/SensorScreen/index.js';
import MonitorScreen from './src/screens/MonitorScreen/MonitorScreen';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

//Amplify.configure(awsconfig)
Amplify.configure({
    ...awsconfig,
    Analytics: { 
      disabled: true
    }
});
/*await DataStore.save(
  new Infant({
  "Oxygen": "Lorem ipsum dolor sit amet",
  "Humidity": "Lorem ipsum dolor sit amet",
  "BodyTemp": "Lorem ipsum dolor sit amet",
  "isMonitored": true
  })
);*/

function App() {
   //Auth.signOut();
  return (
   /* <View style={styles.container}>
      <StatusBar />
      <HomeScreen />
    </View>*/
    <Fragment>
    <SafeAreaView style={styles.root}/>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#da9afc' }}>
      <TabNavigation/>
   </SafeAreaView>
   </Fragment>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 0,
    backgroundColor: '#efd7fc',
  },
});
const signUpConfig = {
  header: "Sign Up",
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Email",
      key: "username",
      required: true,
      displayOrder: 1,
      type: "string",
    },
    {
      label: "Full name",
      key: "name",
      required: true,
      displayOrder: 2,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 3,
      type: "password",
    },
    {
      label: "Phone #",
      key: "phone_number",
      required: true,
      displayOrder: 4,
      type: "string",
    }
  ],
};

const customTheme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: '#da9afc',
    borderRadius: 5,
  },
  sectionFooterLink: {
		fontSize: 14,
		color: '#da9afc',
		alignItems: 'baseline',
		textAlign: 'center',
	},
  buttonDisabled: {
		backgroundColor: '#da9afc80',
		alignItems: 'center',
		padding: 16,
	},
};

export default withAuthenticator(App, { signUpConfig, theme: customTheme });