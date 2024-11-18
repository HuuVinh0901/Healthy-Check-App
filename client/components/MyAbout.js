import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const MyAbout = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('')
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    useEffect(() => {
        const getUserData = async () => {
            try {
                const currentUser = await AsyncStorage.getItem('currentUser');
                if (currentUser) {
                    const parsedUser = JSON.parse(currentUser);
                    setName(parsedUser.name);
                    setGender(parsedUser.gender);
                    setEmail(parsedUser.email);
                    setUserId(parsedUser.id)
                    console.log(parsedUser.id)
                }
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        getUserData();
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        else if (!newPassword || !oldPassword || !confirmPassword) {
            setError('Not enough information')
        }
        try {
            console.log(userId)
            console.log(oldPassword)
            console.log(newPassword)
            const response = await axios.post('http://localhost:3000/api/changepass',
                {
                    userId,
                    currentPassword: oldPassword,
                    newPassword: newPassword,
                },
            );

            // Xử lý khi API thành công
            if (response.status === 200) {
                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                }, 1000);
                setModalVisible(false);
                setError('');
                setNewPassword('')
                setConfirmPassword('')
                setOldPassword('')

            } else {
                setError('Current passord incorrect');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Current password is incorrect.');
            } else {
                setError('An error occurred while changing the password. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                <TouchableOpacity
                    style={{ width: '10%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My information</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.info}>{name}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Gender:</Text>
                <Text style={styles.info}>{gender}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{email}</Text>
            </View>

            {/* Button to change password */}
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            {/* Modal for password change */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Change Password</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Your password"
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="New password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: 'gray' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={successModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.successText}>Password changed successfully!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        width: 90,
    },
    info: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        textAlign: 'left',
    },
    button: {
        marginTop: 30,
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyAbout;
