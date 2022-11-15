import React, { useState, useEffect } from 'react';
import { Switch } from 'react-native';
import { Text, View, Button, Platform, StyleSheet} from 'react-native';
import { DataStore } from 'aws-amplify';
import { Infant } from '../../models/index.js';
const Header = () => {

    return(
    <View style={monitorStyle.headerContainer}>
      <Text style={monitorStyle.headerTitle}>Settings</Text>
    </View>
  );
}
const SettingsScreen = () => {

  return(
  <View style={monitorStyle.container}>
    <Header/>
    
  </View>

  );
};

const monitorStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#efd7fc',
  },
  headerContainer: {
    backgroundColor: '#efd7fc',
    bottom: 350
   
    
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

export default SettingsScreen;