import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Modal, StyleSheet, Image,Pressable  } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const MyAbout = ({ navigation }) => {
    const [avatar, setAvatar] = useState(null);
    const [modalLogOut, setModalLogOut] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('')
    const [modalMessage, setModalMessage] = useState("");
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [file, setFile] = useState()
    useEffect(() => {


        getUserData();
    }, []);
    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setName(parsedUser.name);
                setGender(parsedUser.gender);
                setEmail(parsedUser.email);
                setUserId(parsedUser.id)
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
                setModalMessage("Change password sucessfully")
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
    const handleImagePick = () => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    console.log('File selected on web:', file);

                    // Tạo URL tạm thời cho file trên web
                    const fileUri = URL.createObjectURL(file);
                    setAvatar(fileUri);  // Lưu lại avatar là URI tạm thời
                    setFile(file);  // Lưu lại file để upload sau này
                    console.log('Avatar set to (file URI):', fileUri);
                }
            };
            input.click();
        } else {
            launchImageLibrary({ mediaType: 'photo' }, (response) => {
                if (response.assets && response.assets.length > 0) {
                    const { uri, type } = response.assets[0];
                    if (type === 'image/jpeg' || type === 'image/png') {
                        setAvatar(uri);  // Lưu lại URI để hiển thị ảnh
                        setFile(response.assets[0]);  // Lưu lại file để upload
                        console.log("Avatar set to (URI):", uri);
                    } else {
                        alert('Please select a valid image file (jpg or png).');
                    }
                }
            });
        }
    };

    const handleUploadImage = async () => {
        if (!file) {
            setModalMessage("Please choose image")
            setSuccessModalVisible(true);
            setTimeout(() => {
                setSuccessModalVisible(false);
            }, 1000);
            return;
        }

        const formData = new FormData();
        // Truyền trực tiếp `file` vào formData để upload
        formData.append('avatar', file);
        formData.append('userId', userId); // Thêm userId vào FormData

        // Log các phần tử trong FormData để debug
        for (let [key, value] of formData.entries()) {
            console.log(key + ": " + value);
        }

        try {
            const response = await axios.post('http://localhost:3000/api/users/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Response data:', response.data);
            // Hiển thị thông báo thành công
            if (response.status === 200) {
                setModalMessage("Change profile sucessfully")
                setSuccessModalVisible(true);
                setTimeout(() => {
                    setSuccessModalVisible(false);
                }, 1000);
                console.log(response.data.filePath)
                const imageUrl = `http://localhost:3000${response.data.filePath}`;
                setAvatar(imageUrl);
            } else {
                alert('Failed to update avatar.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        }
    };

    const handleLogout = async () => {
        try {
            // Xóa token và thông tin người dùng
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('currentUser');
            setModalVisible(false);
            navigation.replace('Login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };







    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                <TouchableOpacity
                    style={{ width: '10%', justifyContent: 'center' }}
                    onPress={() => { navigation.goBack(); }}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>My information</Text>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <View style={styles.avatarContainer}>
                    {/* Avatar */}
                    <Image
                        style={styles.avatar}
                        source={
                            avatar
                                ? { uri: avatar }
                                : gender === 'male'
                                    ? require('../assets/data/male.png')
                                    : require('../assets/data/female.png')
                        }
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={handleImagePick} >
                        <MaterialCommunityIcons name="account-edit" size={20} color="white" />
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity style={styles.button}
                    onPress={handleUploadImage}
                >
                    <Text style={styles.buttonText}>Save profie</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 20 }}>
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
            </View>


            {/* Button to change password */}
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Feather name="lock" size={20} color="white" />
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                marginTop: 10,
                flexDirection: 'row', backgroundColor: '#d85454',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center'
            }} onPress={()=>setModalLogOut(true)}>
                <Entypo name="log-out" size={20} color="white" />
                <Text style={{ marginLeft: 5, fontSize: 16, color: 'white' }}>Log out</Text>
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
                        <Text style={styles.successText}>{modalMessage}</Text>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalLogOut}
                onRequestClose={() => setModalLogOut(false)} // Đóng modal khi nhấn nút Back
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure want to log out?</Text>

                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setModalLogOut(false)}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.textStyle}>Yes</Text>
                            </Pressable>
                        </View>
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
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#00bdd6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 5
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
    avatarContainer: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007BFF',
        borderRadius: 12,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCancel: {
        backgroundColor: '#9b9393',
    },
    buttonConfirm: {
        backgroundColor: '#d85454',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default MyAbout;
