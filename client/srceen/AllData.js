import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const AllData = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#fafafb' }}>
            <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                <TouchableOpacity style={{ width: '30%', justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('Home') }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ width: '70%' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>All Health Data</Text>
                </View>

            </View>
            <ScrollView style={{ marginTop: 15 }}>
                <TouchableOpacity style={{ paddingVertical: 20, paddingHorizontal: 10, marginHorizontal: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, backgroundColor: 'white', borderColor: '#f4f4f5' }}>
                    <View style={{ width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00bdd6' }}>
                        <FontAwesome name="bullseye" size={24} color="white" />
                    </View>
                    <View style={{ width: '77%', gap: 8, marginLeft: 10 }}>
                        <Text>Double Support Time</Text>
                        <Text style={{ fontStyle: 25, fontWeight: 'bold' }}>29.7 %</Text>
                    </View>
                    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="right" size={15} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop:15,paddingVertical: 20, paddingHorizontal: 10, marginHorizontal: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, backgroundColor: 'white', borderColor: '#f4f4f5' }}>
                    <View style={{ width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ed7d2d' }}>
                        <Ionicons name="footsteps" size={24} color="white" />
                    </View>
                    <View style={{ width: '77%', gap: 8, marginLeft: 10 }}>
                        <Text>Step</Text>
                        <Text style={{ fontStyle: 25, fontWeight: 'bold' }}>11,875 steps</Text>
                    </View>
                    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="right" size={15} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:15, paddingVertical: 20, paddingHorizontal: 10, marginHorizontal: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, backgroundColor: 'white', borderColor: '#f4f4f5' }}>
                    <View style={{ width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8353e2' }}>
                        <MaterialCommunityIcons name="calendar-month-outline" size={24} color="white" />
                    </View>
                    <View style={{ width: '77%', gap: 8, marginLeft: 10 }}>
                        <Text>Cycle tracking</Text>
                        <Text style={{ fontStyle: 25, fontWeight: 'bold' }}>08 April</Text>
                    </View>
                    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="right" size={15} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:15, paddingVertical: 20, paddingHorizontal: 10, marginHorizontal: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, backgroundColor: 'white', borderColor: '#f4f4f5' }}>
                    <View style={{ width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e05858' }}>
                    <MaterialCommunityIcons name="power-sleep" size={24} color="white" />
                    </View>
                    <View style={{ width: '77%', gap: 8, marginLeft: 10 }}>
                        <Text>Sleep</Text>
                        <Text style={{ fontStyle: 25, fontWeight: 'bold' }}>7h 31 min</Text>
                    </View>
                    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="right" size={15} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:15, paddingVertical: 20, paddingHorizontal: 10, marginHorizontal: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, backgroundColor: 'white', borderColor: '#f4f4f5' }}>
                    <View style={{ width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#de3b40' }}>
                    <FontAwesome5 name="heartbeat" size={24} color="white" />
                    </View>
                    <View style={{ width: '77%', gap: 8, marginLeft: 10 }}>
                        <Text>Heart</Text>
                        <Text style={{ fontStyle: 25, fontWeight: 'bold' }}>68 BPM</Text>
                    </View>
                    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="right" size={15} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:15, paddingVertical: 20, paddingHorizontal: 10, marginHorizontal: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, backgroundColor: 'white', borderColor: '#f4f4f5' }}>
                    <View style={{ width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00bdd6' }}>
                    <Ionicons name="body" size={24} color="white" />
                    </View>
                    <View style={{ width: '77%', gap: 8, marginLeft: 10 }}>
                        <Text>Body mass index</Text>
                        <Text style={{ fontStyle: 25, fontWeight: 'bold' }}>18,69 BMI</Text>
                    </View>
                    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="right" size={15} color="black" />
                    </View>
                </TouchableOpacity>
            </ScrollView>
            <View style={{ marginTop: 10, flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white', }}>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}

                >
                    <MaterialIcons name="insert-chart-outlined" size={24} color="#4cd1e2" />
                    <Text style={{ color: '#4cd1e2' }}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Explore')}>
                    <MaterialIcons name="explore" size={24} color="black" />
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Share')}>
                    <Feather name="share-2" size={24} color="black" />
                    <Text>Sharing</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default AllData