import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Switch} from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { DataStore } from '@aws-amplify/datastore';
import Home from './src/Home';
Amplify.configure(awsconfig)

/*await DataStore.save(
  new Infant({
  "Oxygen": "Lorem ipsum dolor sit amet",
  "Humidity": "Lorem ipsum dolor sit amet",
  "BodyTemp": "Lorem ipsum dolor sit amet",
  "isMonitored": true
  })
);*/

export default function App() {
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
