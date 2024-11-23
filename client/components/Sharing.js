import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import React, { useState,useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Fontisto from '@expo/vector-icons/Fontisto';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Sharing = ({ navigation }) => {
    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
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
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        // Kiểm tra dữ liệu đầu vào
        if (!type || !title || !content) {
            setModalMessage('Please fill in all fields.');
            setModalVisible(true);
            return;
        }
        const avatarUrl = image ? image : null;
        try {
            // Chuẩn bị dữ liệu blog
            const blogData = {
                type,
                title,
                content,
                img: avatarUrl,
                userId: user.id
            };

            // Gửi dữ liệu lên server
            const response = await axios.post('http://localhost:3000/api/blog', blogData);

            // Kiểm tra phản hồi từ server
            if (response.status === 201) {
                setModalMessage('Blog post created successfully!');
                setModalVisible(true);

                // Reset form sau khi thêm blog
                setType('');
                setTitle('');
                setContent('');
                setImage(null);

                // Điều hướng về màn hình chính
                // navigation.navigate('Home');
            }
        } catch (error) {
            console.error(error);
            setModalMessage('Failed to create blog post.');
            setModalVisible(true);
        }
    };

    return (
        <View style={{ padding: 10, flex: 1, backgroundColor: '#fafafb' }}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '38%', justifyContent: 'center' }}
                    onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Get sharing</Text>
                </View>
            </View>

            <ScrollView style={{ marginTop: 20 }}>
                <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Type</Text>
                <RNPickerSelect
                    onValueChange={(value) => setType(value)}
                    items={[
                        { label: 'Sport', value: 'sport' },
                        { label: 'Nutrition', value: 'nutrition' },
                        { label: 'Lifestyle', value: 'lifestyle' },
                        { label: 'Health', value: 'health' },
                    ]}
                    placeholder={{
                        label: 'Select a type',
                        value: null,
                        color: '#9EA0A4',
                    }}
                />

                <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Title</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 }}
                    placeholder="Enter title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={{ fontWeight: 'bold' }}>Content</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5, height: 100 }}
                    placeholder="Enter content"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <Text style={{ fontWeight: 'bold' }}>Image (optional)</Text>
                <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 10 }}>
                    <Text>Select Image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={{ width: '100%', height: 200, marginTop: 10 }} />}

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00bdd6', padding: 15, borderRadius: 10, marginTop: 30 }}
                    onPress={handleSubmit}
                >
                    <Fontisto name="share-a" size={24} color="white" />
                    <Text style={{ marginLeft: 5, color: '#fff', fontSize: 18 }}>Share</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#00bdd6',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Sharing;
