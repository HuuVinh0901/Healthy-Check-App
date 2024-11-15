import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';  // Import Toast

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    // Kiểm tra nếu email hoặc mật khẩu trống
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Please enter both email and password.',
      });
      return; // Dừng lại nếu có trường nào trống
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      // Kiểm tra status trả về từ server
      if (response.status === 200) {
        // Đăng nhập thành công
        await AsyncStorage.setItem('token', response.data.token);
        // Lưu thông tin người dùng vào AsyncStorage
        await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.user));

        // Kiểm tra lưu trữ thông tin người dùng
        console.log(response.data)

        navigation.navigate('Home');
      } else if (response.status === 400 || response.status === 404) {
        // Nếu email hoặc mật khẩu sai (400 hoặc 404)
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.data.message || 'Invalid email or password.',
        });
      } else {
        // Xử lý các lỗi khác từ server (nếu có)
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      // Nếu có lỗi hệ thống (network error, server error, v.v.)
      console.error("Error during login", error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'An error occurred. Please try again.',
      });
    }
  };


  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 100 }}>
        <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Welcome back</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
          <MaterialCommunityIcons name="hand-wave" size={40} color="black" />
        </View>
      </View>
      <View style={{ marginHorizontal: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email</Text>

        <TextInput
          style={{ borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}
          placeholder="Enter email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />

      </View>
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
        <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
          <View style={{ width: '80%' }}>
            <TextInput
              placeholder="Enter password"
              secureTextEntry={secureText}
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <View style={{ width: '20%', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Feather name={secureText ? "eye-off" : "eye"} size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginHorizontal: 15, alignItems: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity>
          <Text style={{ color: '#41cee0', fontWeight: 'bold' }}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          backgroundColor: '#41cee0',
          marginHorizontal: 15,
          marginVertical: 20,
          borderRadius: 10,
          paddingVertical: 10,
        }}
        onPress={handleLogin}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>Sign in</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Text>OR LOG IN WITH</Text>
      </View>
      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
        <TouchableOpacity>
          <AntDesign name="google" size={30} color="red" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="facebook-with-circle" size={30} color="#1877f2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="apple-o" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 30 }}>
        <Text style={{ fontSize: 15 }}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text
            style={{ marginLeft: 5, fontSize: 15, color: '#41cee0', fontWeight: 'bold' }}
            onPress={() => { navigation.navigate('Register'); }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Login;
