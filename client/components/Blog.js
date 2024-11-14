import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
const Blog = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }} >
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '40%', justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('Explore') }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Blogs</Text>
                </View>
            </View>
            <ScrollView style={{ marginVertical: 20 }}>
                <View style={{ marginBottom: 10, gap: 5, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#adbbbe' }}>
                    <Text style={{ fontSize: 15, color: '#adbbbe' }}>Nutrition</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>More about Apples: Benefits, nutrition, and tips</Text>
                    <Image style={{ height: 100, width: '100%', borderRadius: 10 }} source={require('../assets/data/blog1.png')} />
                    <Text>Obesity isn’t new, but the obesity epidemic is. We went from a few corpulent queens and kings, like Henry VIII and Louis VI (known as Louis le Gros, or “Louis the Fat”), to a pandemic of obesity, now considered to...</Text>
                    <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', backgroundColor: '#ebfdff', borderRadius: 20 }}>
                        <AntDesign name="like2" size={20} color="#4cd1e2" />
                        <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>78</Text>
                        <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>votes</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 5, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: '#adbbbe' }}>
                    <Text style={{ fontSize: 15, color: '#adbbbe' }}>Life style</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>IMPORTANCE OF FIRE COMPARTMENTS</Text>
                    <Image style={{ height: 100, width: '100%', borderRadius: 10 }} source={require('../assets/data/blog2.png')} />
                    <Text>This article not only helps you understand the importance of fire compartments in particular and fire prevention system in general, as well as key points on how to properly maintain the fire apartments for efficient fire prevention activities.</Text>
                    <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', backgroundColor: '#ebfdff', borderRadius: 20 }}>
                        <AntDesign name="like2" size={20} color="#4cd1e2" />
                        <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>78</Text>
                        <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>votes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View>
    )
}

export default Blog