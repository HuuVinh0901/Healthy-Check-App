import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker'; // Import react-native-image-picker
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';

const Register = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');

    // Hàm chọn ảnh từ thư viện hoặc máy ảnh
    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo', // Chỉ chọn ảnh
                quality: 1,
                includeBase64: false, // Nếu bạn muốn base64, set true
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                    setImage(response.assets[0].uri);  // Lưu URI ảnh đã chọn
                }
            }
        );
    };

    const handleDateChange = (date) => {
        setBirthDate(date);
        setFormattedDate(moment(date).format('DD/MM/YYYY')); // Định dạng ngày
    };

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            {/* Chỗ chọn ảnh đại diện */}
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <TouchableOpacity onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    ) : (
                        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="account-circle" size={50} color="gray" />
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Tap to select a profile picture</Text>
            </View>

            {/* Chọn giới tính */}
            <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Gender</Text>
                <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                            <RadioButton value="male" />
                            <Text style={{ marginLeft: 8 }}>Male</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RadioButton value="female" />
                            <Text style={{ marginLeft: 8 }}>Female</Text>
                        </View>
                    </View>
                </RadioButton.Group>
            </View>

            {/* Các trường email và mật khẩu */}
            <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email</Text>
                <View style={{ borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
                    <TextInput placeholder="Enter your email" />
                </View>
            </View>

            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
                <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
                    <View style={{ width: '80%' }}>
                        <TextInput placeholder="Enter your password" />
                    </View>
                    <View style={{ width: '20%', alignItems: 'flex-end' }}>
                        <TouchableOpacity><Feather name="eye-off" size={24} color="black" /></TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Nút đăng ký */}
            <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#41cee0', marginHorizontal: 15, marginVertical: 20, borderRadius: 10, paddingVertical: 10 }}>
                <Text style={{ color: 'white', fontSize: 20 }}>Register</Text>
            </TouchableOpacity>

            {/* Liên kết đến trang đăng nhập */}
            <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontSize: 15 }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ marginLeft: 5, fontSize: 15, color: '#41cee0', fontWeight: 'bold' }}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Register;
