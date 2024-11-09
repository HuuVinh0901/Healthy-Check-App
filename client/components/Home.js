import { View, Text, Image, ScrollView,TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
const Home = ({navigation}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const getUserData = async () => {
          try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
              const parsedUser = JSON.parse(currentUser);
              setUser(parsedUser);
               
            }
          } catch (error) {
            console.error('Error fetching user data', error);
          }
        };
      
        getUserData();
      }, []);
    return (
        <View style={{ flex:1,backgroundColor: '#fafafb' ,justifyContent: 'space-between',}}>

            <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                <TouchableOpacity style={{ width: '50%', justifyContent: 'center' }}
                onPress={()=>{navigation.navigate('Laugh')}}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'flex-end' }}>
                    <Image source={require('../assets/data/avatart.png')} />
                </View>

            </View>
            <ScrollView style={{height:600,flex: 1}}>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="sunny-sharp" size={24} color="black" />
                    <Text style={{ marginLeft: 10, }}>TUES 11 JUL</Text>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'center' }}>
                    <View style={{ width: '75%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Overview</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '25%', alignItems: 'flex-end', borderWidth: 1, borderRadius: 15, borderColor: '#4bcfe0', paddingVertical: 10, paddingHorizontal: 5,justifyContent:'center' }}
                    onPress={() => { navigation.navigate('AllData') }}>
                        <FontAwesome name="plane" size={20} color="#4bcfe0" />
                        <Text style={{ marginLeft: 5, color: '#4bcfe0', fontWeight: 'bold' }}>All data</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginVertical: 10, marginHorizontal: 15, flexDirection: 'row', backgroundColor: '#ebfdff', borderRadius: 10, }}>
                    <View style={{ width: '70%', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Health Score</Text>
                        <Text style={{ color: '#7c8689' }}>Based on your overview</Text>
                        <Text style={{ color: '#7c8689' }}>health tracking, your score is</Text>
                        <Text style={{ color: '#7c8689' }}>78 and consider good...</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: '#35cbdf', fontWeight: 'bold' }}>Tell me more</Text>
                            <Entypo name="controller-play" size={18} color="#35cbdf" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '30%', }}>
                        <View style={{ borderBottomLeftRadius: 30, borderBottomEndRadius: 30, backgroundColor: '#8353e2', width: '70%', paddingVertical: 30, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>78</Text></View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Highlights</Text>
                    </View>
                    <TouchableOpacity style={{ width: '50%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#1ce5ff', paddingVertical: 15 }}
                    onPress={()=>{navigation.navigate('StepTracker')}}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="run" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Steps</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>11,857</Text>
                            <Text style={{ color: 'white',  }}>updated 15 min ago</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#e77e7e', paddingVertical: 15 }}
                    onPress={()=>{navigation.navigate('CycleTracking')}}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="calendar-month-outline" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Cycle tracking</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15}}>12 days before perio</Text>
                            <Text style={{ color: 'white', }}>updated 30 min ago</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#125d95', paddingVertical: 15 }}
                    onPress={() => { navigation.navigate('SleepTracker') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="power-sleep" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white',  }}>Sleep</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>7 h 31 min</Text>
                            <Text style={{ color: 'white',  }}>updated 8 day ago</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#cc5f12', paddingVertical: 15 }}
                    onPress={()=>{navigation.navigate('NutritionTracker')}}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="food-variant" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white',  }}>Nutrition</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>960 kcal</Text>
                            <Text style={{ color: 'white',  }}>updated 5 min ago</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>This week report</Text>
                    </View>
                    <TouchableOpacity style={{ width: '40%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="footsteps" size={24} color="red" />
                            <Text>Steps</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>697,978</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="arm-flex-outline" size={24} color="black" />
                            <Text>Workout</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>6h 45min</Text>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="water" size={24} color="#00bcf2" />
                            <Text>Water</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>10,689 ml</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="sleep" size={24} color="black" />
                            <Text>Sleep</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>29h 17min</Text>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Blogs</Text>
                    </View>
                    <TouchableOpacity style={{ width: '40%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ marginTop: 10, flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white',}}>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                
                >
                    <MaterialIcons name="insert-chart-outlined" size={24} color="#4cd1e2" />
                    <Text style={{color:'#4cd1e2'}}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                onPress={()=>navigation.navigate('Explore')}>
                    <MaterialIcons name="explore" size={24} color="black" />
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                onPress={()=>navigation.navigate('Share')}>
                    <Feather name="share-2" size={24} color="black" />
                    <Text>Sharing</Text>
                </TouchableOpacity>

            </View>
        </View>


    )
}

export default Home