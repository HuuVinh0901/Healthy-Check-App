import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';

const Explore = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [gender, setGender] = useState('')
    // Fetch blogs from the API when the component mounts
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/blog');
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
        getUserData()
    }, []);
    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setUser(parsedUser);
                setGender(parsedUser.gender)

            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };
    const data = [
        { id: 1, name: "Sports", },
        { id: 2, name: "Nutritions" },
        { id: 3, name: "Running" }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafb', justifyContent: 'space-between' }}>
            {/* Search and Avatar section */}
            <View style={{ marginHorizontal: 15, flexDirection: 'row', marginVertical: 10 }}>
                <View style={{ width: '80%', flexDirection: 'row', borderRadius: 10, borderWidth: 1, paddingHorizontal: 5, alignItems: 'center' }}>
                    <Feather name="search" size={20} color="black" />
                    <TextInput style={{ marginLeft: 5 }} placeholder='Search topic'></TextInput>
                </View>
                <View style={{ width: '20%', alignItems: 'flex-end' }}>
                    <Image style={{ height: 70, width: 70 }}
                        source={
                            gender === 'male'
                                ? require('../assets/data/male.png')  // Replace with the path to the male avatar image
                                : require('../assets/data/female.png')  // Replace with the path to the female avatar image
                        }
                    />
                </View>
            </View>

            <ScrollView style={{ height: 600, flex: 1 }}>
                {/* For you section */}
                <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'center' }}>
                    <View style={{ width: '75%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>For you</Text>
                    </View>
                    <TouchableOpacity style={{ width: '25%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 10, gap: 10 }}>
                    <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: '#ebfdff', paddingHorizontal: 25, paddingVertical: 20, alignItems: 'center', borderRadius: 15 }}>
                        <FontAwesome6 name="bowl-food" size={50} color="black" />
                        <Text style={{ fontSize: 20, color: '#adbbbe' }}>Nutritions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#ebfdff', paddingHorizontal: 45, paddingVertical: 20, alignItems: 'center', borderRadius: 15 }}>
                        <MaterialIcons name="sports-handball" size={50} color="black" />
                        <Text style={{ fontSize: 20, color: '#adbbbe' }}>Sport</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#ebfdff', paddingHorizontal: 45, paddingVertical: 20, alignItems: 'center', borderRadius: 15 }}>
                        <MaterialCommunityIcons name="shoe-sneaker" size={50} color="black" />
                        <Text style={{ fontSize: 20, color: '#adbbbe' }}>Running</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Newest blogs section */}
                <View style={{ marginHorizontal: 15, flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Newest blogs</Text>
                    </View>
                    <TouchableOpacity style={{ width: '50%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { navigation.navigate('Blog') }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={blogs}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical: 10, marginHorizontal: 10, height: 300, width: 200, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#adbbbe' }}>
                            <Image
                                style={{ width: '100%', height: '50%', borderRadius: 10 }}
                                source={item.img ? { uri: item.img } : require('../assets/data/empty.png')}

                            />
                            <Text style={{ fontSize: 15, color: '#adbbbe' }}>{item.type}</Text>
                            <View style={{ marginBottom: 5, height: 85 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.title}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', backgroundColor: '#ebfdff', borderRadius: 20 }}>
                                    <AntDesign name="like2" size={20} color="#4cd1e2" />
                                    <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>{item.likes}</Text>
                                    <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>votes</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />

            </ScrollView>

            {/* Bottom navigation */}
            <View style={{ marginTop: 10, flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white' }}>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Home')}>
                    <MaterialIcons name="insert-chart-outlined" size={24} color="black" />
                    <Text>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}>
                    <MaterialIcons name="explore" size={24} color="#4cd1e2" />
                    <Text style={{ color: '#4cd1e2' }}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Share')}>
                    <Feather name="share-2" size={24} color="black" />
                    <Text>Sharing</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Explore;
