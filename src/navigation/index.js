import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen/index.js';
import MonitorScreen from '../screens/MonitorScreen/index.js';
import SensorScreen from '../screens/SensorScreen/index.js';
import SettingsScreen from '../screens/SettingsScreen/index.js';
import StatisticsScreen from '../screens/StatisticsScreen/index.js';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Monitor" component={MonitorScreen} />
        <Stack.Screen name="Sensors" component={SensorScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
