// React Navigation Setup for Success Planner Mobile
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateGoalScreen from './src/screens/CreateGoalScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Navigator
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Authentication Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Success Planner' }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'User Login' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'CreateGoal') {
            iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'ios-stats-chart' : 'ios-stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'My Goals' }}
      />
      <Tab.Screen 
        name="CreateGoal" 
        component={CreateGoalScreen}
        options={{ title: 'New Goal' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;