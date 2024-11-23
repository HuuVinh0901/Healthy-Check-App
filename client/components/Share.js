import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { TouchableOpacity } from 'react-native';
const Share = ({navigation}) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#fafafb' }}>


            <View >
                <Text style={{ marginVertical: 20, marginHorizontal: 20, fontSize: 40, fontWeight: 'bold' }}>Sharing</Text>
            </View>
            <ScrollView style={{ flex: 1, }}>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: '#f2f2f3', backgroundColor: 'white', borderRadius: 20, flexDirection: 'row', marginHorizontal: 10, paddingHorizontal: 30, marginVertical: 10, paddingVertical: 20 }}>
                    <View style={{ width: '10%' }}>
                        <FontAwesome6 name="list-check" size={24} color="#e05959" />
                    </View>
                    <View style={{ width: '90%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, }}>Keep your health in check</Text>
                        <Text style={{ marginTop: 10, fontSize: 15 }}>Keep loved ones informed about your condition.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: '#f2f2f3', backgroundColor: 'white', borderRadius: 20, flexDirection: 'row', marginHorizontal: 10, paddingHorizontal: 30, marginVertical: 10, paddingVertical: 20 }}>
                    <View style={{ width: '10%' }}>
                        <MaterialCommunityIcons name="shield-lock-outline" size={24} color="#8353e2" />

                    </View>
                    <View style={{ width: '70%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, }}>Protect your privacy</Text>
                        <Text style={{ marginTop: 10, fontSize: 15 }}>Share key conclusions. Stop anytime.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: '#f2f2f3', backgroundColor: 'white', borderRadius: 20, flexDirection: 'row', marginHorizontal: 10, paddingHorizontal: 30, marginVertical: 10, paddingVertical: 20 }}>
                    <View style={{ width: '10%' }}>
                        <Ionicons name="notifications-outline" size={24} color="#2b55d3" />

                    </View>
                    <View style={{ width: '70%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, }}>Notifications</Text>
                        <Text style={{ marginTop: 10, fontSize: 15 }}>Get notified of update to shared dashboards.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', backgroundColor: '#00bdd6', borderRadius: 20, marginHorizontal: 30, paddingVertical: 10, justifyContent: 'center' }}
                onPress={() => { navigation.navigate('Sharing') }}>
                    <MaterialCommunityIcons name="share-outline" size={24} color="white" />
                    <Text style={{ fontSize: 20, marginLeft: 10, color: 'white' }}>Start sharing</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{ borderWidth: 1, marginTop: 20, flexDirection: 'row', borderRadius: 20, marginHorizontal: 30, paddingVertical: 10, justifyContent: 'center' }}
                >
                    <Feather name="settings" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 10, }}>Setting</Text>
                </TouchableOpacity> */}
            </ScrollView>

            <View style={{ marginTop: 10, flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white', }}>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Home')}
                >
                    <MaterialIcons name="insert-chart-outlined" size={24} color="black" />
                    <Text >Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Explore')}>
                    <MaterialIcons name="explore" size={24} color="black" />
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}>
                    <Feather name="share-2" size={24} color="#4cd1e2" />
                    <Text style={{ color: '#4cd1e2' }}>Sharing</Text>
                </TouchableOpacity>

            </View>
        </View>

    )
}

export default Share