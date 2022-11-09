import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/index.js';
import MonitorScreen from '../screens/MonitorScreen/index.js';
import SensorScreen from '../screens/SensorScreen/index.js';
import SettingsScreen from '../screens/SettingsScreen/index.js';
import StatisticsScreen from '../screens/StatisticsScreen/index.js';
import NotificationsScreen from '../screens/NotificationsScreen/index.js';

const Tab = createBottomTabNavigator();
const TabNavigation = () => {
  return (
    <NavigationContainer>
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Tab.Screen name="Monitor" component={MonitorScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Sensors" component={SensorScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Statistics" component={StatisticsScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Notifications" component={NotificationsScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigation;