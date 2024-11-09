import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker'; // Import react-native-image-picker
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import axios from 'axios'; // Thêm axios để gửi yêu cầu HTTP



const Register = ({ navigation }) => {

    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');



    const uploadImageToCloudinary = async (uri) => {
        const formData = new FormData();
        const timestamp = new Date().toISOString();
        const imageName = `User_${timestamp}.jpg`; // Tạo tên file dựa theo thời gian

        // Kiểm tra nếu URI ảnh hợp lệ
        if (!uri) {
            throw new Error("No image URI provided");
        }

        // Chuyển đổi URI ảnh thành một file
        formData.append('file', {
            uri: uri,
            name: imageName,
            type: 'image/jpg'  // Đảm bảo kiểu ảnh đúng
        });

        formData.append('upload_preset', 'Healthy-Check-App'); // Thay 'YOUR_UPLOAD_PRESET' với upload preset của bạn
        formData.append('cloud_name', 'dvynjv9ln');
        formData.append('folder', 'avatars/');  // Thêm folder nếu cần thiết

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dvynjv9ln/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                return response.data.secure_url; // Lấy URL ảnh từ Cloudinary
            } else {
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw error;
        }
    };


    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response.assets) {
                const uri = response.assets[0].uri;
                setImage(uri);  // Lưu URI ảnh đã chọn
            }
        });
    };

    // const registerUser = async () => {
    //     try {
    //         // Nếu có ảnh, tải ảnh lên Cloudinary và lấy URL
    //         const avatarUrl = image ? await uploadImageToCloudinary(image) : null;

    //         const userData = {
    //             name: name,
    //             gender: gender,
    //             email: email,
    //             password: password,
    //             avatar: avatarUrl, // Lưu URL ảnh vào cơ sở dữ liệu
    //         };
    //         console.log(userData);

    //         // Gửi thông tin người dùng đến server
    //         const response = await axios.post('http://localhost:3000/api/users', userData);

    //         if (response.status === 201) {
    //             console.log("User registered successfully:", response.data);
    //             navigation.navigate('Login');
    //         }
    //     } catch (error) {
    //         console.error("Error registering user:", error);
    //     }
    // };
    // Hàm đăng ký người dùng (sử dụng link ảnh tạm thời để test)
    const registerUser = async () => {
        try {
            // Sử dụng link ảnh mẫu thay vì upload lên Imgur
            const avatarUrl = 'https://i.imgur.com/your-sample-image.jpg'; 

            const userData = {
                name: name,
                gender: gender,
                email: email,
                password: password,
                avatar: avatarUrl, 
            };


            // Gửi thông tin người dùng đến server (đổi URL với URL server của bạn)
            const response = await axios.post('http://localhost:3000/api/users', userData);

            // Kiểm tra nếu đăng ký thành công
            if (response.status === 201) {
                console.log("User registered successfully:", response.data);
                navigation.navigate('Login'); 
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
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
            {/* Các trường email và mật khẩu */}
            <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>User name</Text>
                <View style={{ borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
                    <TextInput
                        placeholder="Enter your user name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </View>
            <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email</Text>
                <View style={{ borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
                    <TextInput
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>

            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
                <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
                    <View style={{ width: '80%' }}>
                        <TextInput
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={{ width: '20%', alignItems: 'flex-end' }}>
                        <TouchableOpacity><Feather name="eye-off" size={24} color="black" /></TouchableOpacity>
                    </View>
                </View>
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



            {/* Nút đăng ký */}
            <TouchableOpacity onPress={registerUser} style={{ alignItems: 'center', backgroundColor: '#41cee0', marginHorizontal: 15, marginVertical: 20, borderRadius: 10, paddingVertical: 10 }}>
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
