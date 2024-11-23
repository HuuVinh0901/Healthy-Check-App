import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const NoteScreen = ({ navigation }) => {
    const [notes, setNotes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', description: '' });
    const [userId, setUserId] = useState('');

    useEffect(() => {


        getUserData();
    }, []);
    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setUserId(parsedUser.id);
                fetchNotes(parsedUser.id);
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };
    const fetchNotes = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/note/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setNotes(data); // Update state with fetched notes
            } else {
                throw new Error(data.message || 'Failed to fetch notes');
            }
        } catch (err) {
            console.error('Error fetching notes:', err);
        }
    };
    const handleDeleteNote = async (noteId) => {
        try {
            // Gửi yêu cầu xóa ghi chú từ server
            const response = await axios.delete(`http://localhost:3000/api/note/${noteId}`);
            if (response.status === 200) {
                // Cập nhật lại danh sách ghi chú sau khi xóa thành công
                getUserData()
            } else {
                throw new Error('Failed to delete note');
            }
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };
    const renderNote = ({ item }) => {
        return (
            <View style={styles.noteContainer}>
                <View>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                    <Text style={styles.noteDescription}>{item.description}</Text>
                    <Text style={styles.noteDate}>{item.date}</Text>
                </View>


                {/* Nút xóa */}
                <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-bin" size={20} color="red" />
                </TouchableOpacity>
            </View>
        );
    };

    const handleAddNote = async () => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-GB').split('/').reverse().join('-');
        if (newNote.title && newNote.description) {
            console.log(formattedDate)
            try {
                // Gửi yêu cầu POST với Axios
                const response = await axios.post('http://localhost:3000/api/note', {
                    userId,
                    title: newNote.title,
                    description: newNote.description,
                    date: formattedDate,
                });

                // Nếu yêu cầu thành công, thêm ghi chú mới vào danh sách
                getUserData()
                setNewNote({ title: '', description: '' });
                setIsModalVisible(false);

            } catch (err) {
                // Xử lý lỗi
                if (err.response) {
                    // Lỗi từ server, có thể là lỗi xác thực hoặc dữ liệu không hợp lệ
                    console.error('Error adding note:', err.response.data.message);
                } else if (err.request) {
                    // Lỗi do không nhận được phản hồi từ server
                    console.error('No response received:', err.request);
                } else {
                    // Lỗi khác
                    console.error('Error:', err.message);
                }
            }
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>My Notes</Text>
            </View>

            <FlatList
                data={notes}
                renderItem={renderNote}
                keyExtractor={(item) => item.id.toString()}
                style={styles.notesList}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Note</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={newNote.title}
                            onChangeText={(text) => setNewNote({ ...newNote, title: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={newNote.description}
                            onChangeText={(text) => setNewNote({ ...newNote, description: text })}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                            <Text style={styles.saveButtonText}>Save Note</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        width: '10%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    notesList: {
        marginBottom: 60,
    },
    noteContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        justifyContent:'space-between',
        flexDirection:'row'
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noteDescription: {
        fontSize: 14,
        color: '#666',
    },
    noteDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 10,
    },
    addButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 8,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default NoteScreen;
