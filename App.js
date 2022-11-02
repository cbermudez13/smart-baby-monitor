import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Switch} from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { DataStore } from '@aws-amplify/datastore';
import { withAuthenticator} from 'aws-amplify-react-native/dist/Auth';
import { AmplifyTheme } from 'aws-amplify-react-native';
import HomeScreen from './src/screens/HomeScreen/index.js';
import Navigation from './src/navigation';
import SensorScreen from './src/screens/SensorScreen/index.js';
import MonitorScreen from './src/screens/MonitorScreen/MonitorScreen';

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
    <SafeAreaView style={styles.root}>
    <Navigation />
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
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
    backgroundColor: '#b278de',
    borderRadius: 5,
  },
  sectionFooterLink: {
		fontSize: 14,
		color: '#b278de',
		alignItems: 'baseline',
		textAlign: 'center',
	},
  buttonDisabled: {
		backgroundColor: '#b278de80',
		alignItems: 'center',
		padding: 16,
	},
};

export default withAuthenticator(App, { signUpConfig, theme: customTheme });