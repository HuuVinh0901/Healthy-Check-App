import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import Home from './components/Home';
import Explore from './components/Explore';
import CycleTracking from './components/CycleTracking';
import Laugh from './components/Laugh';
import Share from './components/Share';
import StepTracker from './components/StepTracker';
import SleepTracker from './components/SleepTracker';
import NutritionTracker from './components/NutriTracker';
import AllData from './components/AllData';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Laugh'>
        <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
        <Stack.Screen name='Home' component={Home} options={{headerShown:false}}/>
        <Stack.Screen name='Explore' component={Explore} options={{headerShown:false}}/>
        <Stack.Screen name='Laugh' component={Laugh} options={{headerShown:false}}/>
        <Stack.Screen name='Share' component={Share} options={{headerShown:false}}/>
        <Stack.Screen name='SleepTracker' component={SleepTracker} options={{headerShown:false}}/>
        <Stack.Screen name='StepTracker' component={StepTracker} options={{headerShown:false}}/>
        <Stack.Screen name='NutritionTracker' component={NutritionTracker} options={{headerShown:false}}/>
        <Stack.Screen name='CycleTracking' component={CycleTracking} options={{headerShown:false}}/>
        <Stack.Screen name='AllData' component={AllData} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
