import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Fontisto from '@expo/vector-icons/Fontisto';
const Sharing = ({ navigation }) => {
    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

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

    // const handleSubmit = () => {
    //     // Kiểm tra dữ liệu trước khi gửi
    //     if (!type || !title || !content) {
    //         Alert.alert('Error', 'Please fill in all fields.');
    //         return;
    //     }

    //     // Gửi dữ liệu blog lên server
    //     const blogData = {
    //         type,
    //         title,
    //         content,
    //         image,
    //     };
    //     console.log(blogData);
    //     Alert.alert('Success', 'Blog post created successfully!');
        
    //     // Reset form sau khi thêm blog
    //     setType('');
    //     setTitle('');
    //     setContent('');
    //     setImage(null);
    // };

    return (
        <View style={{ padding: 10, flex: 1, backgroundColor: '#fafafb' }}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '38%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Share')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Get sharing</Text>
                </View>
            </View>

            <ScrollView style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Type</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 }}
                    placeholder="Enter type"
                    value={type}
                    onChangeText={setType}
                />

                <Text style={{ fontWeight: 'bold' }}>Title</Text>
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

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00bdd6', padding: 15, borderRadius: 10, marginTop: 30}}
                    >
                    <Fontisto name="share-a" size={24} color="white" />
                    <Text style={{ marginLeft: 5, color: '#fff', fontSize: 18}}>Share</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Sharing;
