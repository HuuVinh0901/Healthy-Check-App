import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Admin = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Hàm xóa người dùng
  const deleteUser = (userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await axios.delete(`http://localhost:3000/api/users/${userId}`);
              // Cập nhật lại danh sách người dùng sau khi xóa
              setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          }
        }
      ]
    );
  };

  // Hàm cập nhật người dùng
  const updateUser = (userId) => {
    navigation.navigate('UpdateUser', { userId });  // Chuyển hướng đến màn hình cập nhật người dùng
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;  // Hiển thị khi đang tải danh sách người dùng
  }

  return (
    <ScrollView style={{ backgroundColor: 'white', padding: 20 }}>
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>User Management</Text>
      </View>

      {users.length === 0 ? (
        <Text>No users available</Text>
      ) : (
        users.map(user => (
          <View key={user.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
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
              <TouchableOpacity onPress={() => updateUser(user.id)}>
                <MaterialCommunityIcons name="pencil" size={24} color="orange" style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteUser(user.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
export default Admin;
