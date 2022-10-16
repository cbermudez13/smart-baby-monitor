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
} from 'react-native';
import { DataStore } from 'aws-amplify';
import { Infant } from '../../models/index.js';

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>My Infant List</Text>
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
      <View style={styles.modalContainer}>
        <View style={styles.modalInnerContainer}>
          <Pressable onPress={closeModal} style={styles.modalDismissButton}>
            <Text style={styles.modalDismissText}>X</Text>
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
          <Pressable onPress={addInfant} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Save new Infant</Text>
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
      style={styles.infantContainer}
    >
      <Text>
        <Text style={styles.infantHeading}>{item.name}</Text>
        {`\n${item.description}`}
      </Text>
      <Text
        style={[styles.checkbox, item.isComplete && styles.completedCheckbox]}
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

const MonitorScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Header />
      <InfantList />
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={[styles.buttonContainer, styles.floatingButton]}
      >
        <Text style={styles.buttonText}>+ Add Infant</Text>
      </Pressable>
      <AddInfantModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#4696ec',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
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
    color: '#fff',
    fontWeight: '600',
    padding: 16,
  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#4696ec',
    borderRadius: 99,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 44,
    elevation: 6,
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