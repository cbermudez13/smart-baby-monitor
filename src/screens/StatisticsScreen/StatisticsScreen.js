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

const StatisticsScreen = () => {

  return(
    
  <View>
    <Text>Statistics of my Infant</Text>
  </View>

  );
};

export default StatisticsScreen;