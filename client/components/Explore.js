import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';

const Explore = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [gender, setGender] = useState('')
    const [avatar, setAvatar] = useState(null);
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
                setGender(parsedUser.gender)
                console.log(parsedUser.avatar)
                if (parsedUser.avatar === null) {
                    setAvatar(null);
                }
                else {
                    const imageUrl = `http://localhost:3000${parsedUser.avatar}`;
                    setAvatar(imageUrl)
                }
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafb', justifyContent: 'space-between' }}>
            {/* Search and Avatar section */}
            <View style={{ marginHorizontal: 15, flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                    {/* <View style={{ flexDirection: 'row', borderRadius: 10, borderWidth: 1, paddingHorizontal: 5,paddingVertical:10, alignItems: 'center' }}>
                        <Feather name="search" size={20} color="black" />
                        <TextInput style={{ marginLeft: 5 }} placeholder='Search topic'></TextInput>
                    </View> */}
                    <Text style={styles.headerText}>Explore</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('MyAbout') }}>
                    {/* Nền trang trí */}
                    <View style={styles.avatarContainer}>
                        {/* Avatar */}
                        <Image
                            style={styles.avatarImage}
                            source={
                                avatar
                                    ? { uri: avatar }
                                    : gender === 'male'
                                        ? require('../assets/data/male.png')
                                        : require('../assets/data/female.png')
                            }
                        />
                        {/* Badge trạng thái */}
                        <View style={styles.statusBadge} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ height: 600, flex: 1 }}>
                {/* For you section */}
                <View style={{ flexDirection: 'row', marginHorizontal: 15,}}>
                    <View style={{ width: '75%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>For you</Text>
                    </View>
                    {/* <TouchableOpacity style={{ width: '25%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                    </TouchableOpacity> */}
                </View>

                <View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 10, gap: 10 }}
                >
                    <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: '#ebfdff', paddingHorizontal: 40, paddingVertical: 20, borderRadius: 10 }}
                        onPress={() => { navigation.navigate('NoteScreen') }}>
                        <Fontisto name="onenote" size={50} color="black" />
                        <Text style={{ fontSize: 20, color: '#adbbbe' }}>Notes</Text>
                    </TouchableOpacity>

                </View>

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
                {/* <FlatList
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
                    keyExtractor={(item) => item.id.toString()} */}
                {/* /> */}
                <ScrollView horizontal>
                    <View style={{ marginVertical: 10, marginHorizontal: 10, height: 300, width: 200, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#adbbbe' }}>
                        <Image
                            style={{ width: '100%', height: '50%', borderRadius: 10 }}
                            source={require('../assets/data/blog1.png')}

                        />
                        <Text style={{ fontSize: 15, color: '#adbbbe' }}>Nutrition</Text>
                        <View style={{ marginBottom: 5, height: 85 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>More about Apples: Benefits, nutrition, and tips</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', backgroundColor: '#ebfdff', borderRadius: 20 }}>
                                    <AntDesign name="like2" size={20} color="#4cd1e2" />
                                    <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>{item.likes}</Text>
                                    <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>votes</Text>
                                </View>
                            </View> */}
                    </View>
                    <View style={{ marginVertical: 10, marginHorizontal: 10, height: 300, width: 200, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#adbbbe' }}>
                        <Image
                            style={{ width: '100%', height: '50%', borderRadius: 10 }}
                            source={require('../assets/data/blog2.png')}

                        />
                        <Text style={{ fontSize: 15, color: '#adbbbe' }}>Life style</Text>
                        <View style={{ marginBottom: 5, height: 85 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>IMPORTANCE OF FIRE COMPARTMENTS</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', flexDirection: 'row', width: '50%', backgroundColor: '#ebfdff', borderRadius: 20 }}>
                                    <AntDesign name="like2" size={20} color="#4cd1e2" />
                                    <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>{item.likes}</Text>
                                    <Text style={{ marginLeft: 5, color: '#4cd1e2', fontWeight: 'bold' }}>votes</Text>
                                </View>
                            </View> */}
                    </View>
                </ScrollView>
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
const styles = StyleSheet.create({
    avatarContainer: {
        height: 80,
        width: 80,
        borderRadius: 40, // Hình tròn
        backgroundColor: '#e0f7fa', // Màu nền trang trí (nhạt)
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Đổ bóng
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Bóng trên Android
    },
    avatarImage: {
        height: 70,
        width: 70,
        borderRadius: 35, // Bo tròn ảnh
        borderWidth: 2, // Viền
        borderColor: '#00796b', // Màu viền (xanh đậm)
    },
    statusBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 15,
        width: 15,
        borderRadius: 7.5,
        backgroundColor: '#4caf50', // Màu xanh lá (online)
        borderWidth: 2,
        borderColor: '#fff', // Viền trắng xung quanh badge
    },
    headerText: {
        fontSize: 30, // Kích thước chữ lớn
        fontWeight: 'bold', // Chữ đậm
        color: '#4caf50', // Màu xanh lá tạo cảm giác tươi mới
        textTransform: 'uppercase', // Chuyển chữ thành viết hoa
        letterSpacing: 2, // Tăng khoảng cách giữa các chữ cái
        shadowColor: '#000', // Hiệu ứng bóng
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5, // Bóng trên Android
    },
});
export default Explore;
