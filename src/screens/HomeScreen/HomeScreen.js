import React, { useState, useEffect } from 'react';
import { Switch } from 'react-native';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Button
} from 'react-native';
import { DataStore } from 'aws-amplify';
import { Infant } from '../../models/index.js';
import {useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

//import MonitorScreen from '../MonitorScreen/index.js';

const Header = () => (
  <View style={monitorStyle.headerContainer}>
    <Text style={monitorStyle.headerTitle}>Smart Baby Monitor</Text>
  </View>
);
const AddInfantModal = ({ modalVisible, setModalVisible }) => {
  const [name, setName] = useState('');
  const [oxygen, setOxygen] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [bodyTemp, setBodyTemp] = useState(0);
  const [isMonitored, setIsMonitored] = useState(false);
  const toggleSwitch = () => setIsMonitored(previousState => !previousState);
  async function addInfant() {
    await DataStore.save(new Infant({ name, isMonitored, isComplete: false }));
    setModalVisible(false);
    setName('');
    setIsMonitored(false);
  }
/*async function addInfant(){
  await DataStore.save(
        new Infant({
		    "Name": "Isabella",
            "isMonitored": true,
	    })
    );
}*/
  function closeModal() {
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      transparent
      visible={modalVisible}
    >
      <View style={monitorStyle.modalContainer}>
        <View style={monitorStyle.modalInnerContainer}>
          <Pressable onPress={closeModal} style={monitorStyle.modalDismissButton}>
            <Text style={monitorStyle.modalDismissText}>X</Text>
          </Pressable>
          <TextInput
            onChangeText={setName}
            placeholder="Name"
            style={styles.modalInput}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isMonitored ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={setIsMonitored}
          />
          <Pressable onPress={addInfant} style={monitorStyle.buttonContainer}>
            <Text style={monitorStyle.buttonText}>Save new Infant</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const InfantList = () => {
  const [infants, setInfants] = useState([]);

  useEffect(() => {

    //query the initial todolist and subscribe to data updates
    const subscription = DataStore.observeQuery(Infant).subscribe((snapshot) => {
      //isSynced can be used to show a loading spinner when the list is being loaded. 
      const { items, isSynced } = snapshot;
      setInfants(items);
    });

    //unsubscribe to data updates when component is destroyed so that we don’t introduce a memory leak.
    return function cleanup() {
      subscription.unsubscribe();
    }

  }, []);


  async function deleteInfant(Infant) {
    try {
        await DataStore.delete(Infant);
      } catch (e) {
        console.log('Delete failed: $e');
      }
  }

  async function setComplete(updateValue, Infant) {
    //update the todo item with updateValue
    await DataStore.save(
      Infant.copyOf(Infant, updated => {
        updated.isComplete = updateValue
      })
    );
  }

  const renderItem = ({ item }) => (
    <Pressable
      onLongPress={() => {
        deleteInfant(item);
      }}
      onPress={() => {
        setComplete(!item.isComplete, item);
      }}
      style={monitorStyle.infantContainer}
    >
      <Text>
        <Text style={monitorStyle.infantHeading}>{item.name}</Text>
        {`\n${item.description}`}
      </Text>
      <Text
        style={[monitorStyle.checkbox, item.isComplete && monitorStyle.completedCheckbox]}
      >
        {item.isComplete ? '✓' : ''}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={infants}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
    />
  );
};

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const onMonitorPress = () => {
    navigation.navigate('Monitor');
  };
  const onSensorPress = () => {
    navigation.navigate('Sensors');
  };
  const onSettingsPress = () => {
    navigation.navigate('Settings');
  };
  const onStatisticsPress = () => {
    navigation.navigate('Statistics');
  };

  return (
    <>
      <Header />
    {/*<InfantList />*/}  
    {/*Navigate to livestream screen */}
      <Pressable
        onPress={onMonitorPress}
        style={[monitorStyle.buttonContainer, monitorStyle.floatingButton]}
      >
        <Text style={monitorStyle.buttonText}>Monitor{"\n"}Infant</Text>
      </Pressable>
     
     {/*<AddInfantModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}/>*/} 
    </>
  );
};

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

const sensorStyle = StyleSheet.create({
  
  floatingButton: {
    position: 'absolute',
    bottom: 400,
    elevation: 5,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
  
});

export default HomeScreen;