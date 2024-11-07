import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './srceen/Login';
import Home from './srceen/Home';
import Explore from './srceen/Explore';
import CycleTracking from './srceen/CycleTracking';
import Laugh from './srceen/Laugh';
import Share from './srceen/Share';
import StepTracker from './srceen/StepTracker';
import SleepTracker from './srceen/SleepTracker';
import NutritionTracker from './srceen/NutriTracker';
import AllData from './srceen/AllData';
import Register from './srceen/Register';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Register'>
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
        <Stack.Screen name='Register' component={Register} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
