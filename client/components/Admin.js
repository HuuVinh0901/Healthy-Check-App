import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet, Pressable
} from 'react-native';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Admin = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [modalLogOut, setModalLogOut] = useState(false);
  // Hàm lấy danh sách người dùng
  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
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
  // Hàm xóa người dùng
  const deleteUser = () => {
    // Gọi API để xóa người dùng
    axios
      .delete(`http://localhost:3000/api/users/${selectedUser.id}`)
      .then(() => {
        // Cập nhật lại danh sách người dùng sau khi xóa
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setDeleteModalVisible(false); // Đóng modal sau khi xóa thành công
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  // Hiển thị modal để chỉnh sửa người dùng
  const openEditModal = (user) => {
    setSelectedUser({ ...user }); // Copy dữ liệu người dùng được chọn
    setModalVisible(true);
    setGender(user.gender);
  };

  // Hàm lưu thông tin người dùng sau khi chỉnh sửa
  const saveUser = async () => {
    try {
      await axios.put(`http://localhost:3000/api/users/${selectedUser.id}`, selectedUser);
      setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ backgroundColor: 'white', padding: 20, flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>ADMIN</Text>
        </View>
        <TouchableOpacity style={{
          flexDirection: 'row', backgroundColor: '#d85454',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={() => setModalLogOut(true)}>
          <Entypo name="log-out" size={20} color="white" />
          <Text style={{ marginLeft: 5, fontSize: 16, color: 'white' }}>Log out</Text>
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}><Text style={{ fontSize: 20 }}>User list</Text></View>
      <ScrollView>
        {users.length === 0 ? (
          <Text>No users available</Text>
        ) : (
          users.map((user) => (
            <View
              key={user.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
            >
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.titleText}>User ID:</Text>
                  <Text style={{ marginLeft: 5, fontSize: 18 }}>{user.id}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.titleText}>User name:</Text>
                  <Text style={{ marginLeft: 5, fontSize: 18 }}>{user.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.titleText}>Email:</Text>
                  <Text style={{ marginLeft: 5, fontSize: 18 }}>{user.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.titleText}>Gender:</Text>
                  <Text style={{ marginLeft: 5, fontSize: 18 }}>{user.gender}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => openEditModal(user)}>
                  <MaterialCommunityIcons name="pencil" size={24} color="orange" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openDeleteModal(user)}>
                  <MaterialCommunityIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      {/* Modal chỉnh sửa người dùng */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={selectedUser?.name || ''}
              onChangeText={(text) => setSelectedUser({ ...selectedUser, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={selectedUser?.email || ''}
              onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Gender:</Text>
            <RadioButton.Group onValueChange={(value) => setSelectedUser({ ...selectedUser, gender: value })} value={selectedUser?.gender}>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={saveUser}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xóa người dùng */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={{ fontSize: 16, marginVertical: 20 }}>
              Are you sure you want to delete <Text style={{ fontWeight: 'bold' }}>{selectedUser?.name}</Text>?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.button} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={deleteUser}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalLogOut}
        onRequestClose={() => setModalLogOut(false)} // Đóng modal khi nhấn nút Back
      >
        <View style={styles.modalOverlayDelete}>
          <View style={styles.modalContentDelete}>
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
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
},
  modalContentDelete: {
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
  modalOverlayDelete: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerDelete: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitleDelete: {
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
  modalButtonsDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonCancel: {
    backgroundColor: '#9b9393',
  },
  buttonConfirm: {
    backgroundColor: '#d85454',
  },
});

export default Admin;
