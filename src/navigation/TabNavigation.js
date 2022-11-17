import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
    <Tab.Navigator
      screenOptions={({route})=>({
        tabBarIcon: ({focused,size,colour}) => {
          let iconName;
          if(route.name == 'Home'){
            iconName = focused ? 'home-variant':'home-variant-outline';
          }else if(route.name == 'Monitor'){
            iconName = focused ? 'baby-face':'baby-face-outline';
          }else if(route.name == 'Sensors'){
            iconName = focused ? 'heart-pulse':'heart-outline';
          }else if(route.name == 'Statistics'){
            iconName = focused ? 'chart-box':'chart-box-outline';
          }else if(route.name == 'Settings'){
            iconName = focused ? 'account-settings':'account-settings-outline';
          }
          return <MaterialCommunityIcons name = {iconName} size={size} colour={colour}/>
          
        },
        tabBarStyle: {
          backgroundColor: '#da9afc'
        }
      })
      
    }
    tabBarOptions={{
      activeTintColor: 'black',
      inactiveTintColor: 'black',
      style : {
        backgroundColor: '#efd7fc',
      }
    }}
    >
        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Tab.Screen name="Monitor" component={MonitorScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Sensors" component={SensorScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Statistics" component={StatisticsScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}}/>
        
    </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigation;