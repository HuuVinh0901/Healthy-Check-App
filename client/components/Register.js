import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import axios from 'axios';



const Register = ({ navigation }) => {

    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);


    const registerUser = async () => {
        const avatar=null;
        try {
            const userData = {
                name,
                gender,
                email,
                password,
                avatar,
                role: 'user',
            };

            const response = await axios.post('http://localhost:3000/api/users', userData);

            if (response.status === 201) {
                console.log("User registered successfully:", response.data);
                setIsModalVisible(true);
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };


    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={{justifyContent:'center',alignItems:'center',marginVertical:20}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome to Healthy Check App</Text>
            </View>

            {/* Các trường email và mật khẩu */}
            <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>User name</Text>

                <TextInput style={{ borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}
                    placeholder="Enter your user name"
                    value={name}
                    onChangeText={setName}
                />

            </View>
            <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email</Text>

                <TextInput style={{ borderRadius: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                />

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

            <TouchableOpacity onPress={registerUser} style={{ alignItems: 'center', backgroundColor: '#41cee0', marginHorizontal: 15, marginVertical: 20, borderRadius: 10, paddingVertical: 10 }}>
                <Text style={{ color: 'white', fontSize: 20 }}>Register</Text>
            </TouchableOpacity>


            <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ fontSize: 15 }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ marginLeft: 5, fontSize: 15, color: '#41cee0', fontWeight: 'bold' }}>Sign in</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Registration Successful</Text>
                        <Text style={styles.modalMessage}>Your account has been created successfully!</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setIsModalVisible(false);
                                navigation.navigate('Login');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Go to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#41cee0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
export default Register;
