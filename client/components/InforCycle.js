import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const InforCycle = ({ navigation }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [cycleLength, setCycleLength] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [cycleData, setCycleData] = useState([]);
    const [user, setUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Thêm modal trạng thái
    const [cycleToDelete, setCycleToDelete] = useState(null);
    const calculateCycleLength = (start, end) => {
        const diffTime = new Date(end).getTime() - new Date(start).getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); // Lấy số ngày nguyên
        return diffDays;
    };
    useEffect(() => {
        getUserData();
    }, []);
    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setUser(parsedUser);
                fetchCycleData(parsedUser.id);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng', error);
        }
    };
    const fetchCycleData = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cycle/${userId}`);
            const data = await response.json();
            setCycleData(data || []);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const handleStartDateConfirm = (params) => {
        const { date } = params;
        setStartDate(date);
        setShowStartDatePicker(false);
    };

    const handleEndDateConfirm = (params) => {
        const { date } = params;
        setEndDate(date);
        setShowEndDatePicker(false);
    };

    useEffect(() => {
        if (new Date(endDate) <= new Date(startDate)) {
            setErrorMessage('End date must be after start date.');
            setCycleLength(null);
        } else {
            setErrorMessage('');
            const length = calculateCycleLength(startDate, endDate);
            setCycleLength(length);
        }
    }, [startDate, endDate]);
    const handleAddCycle = async () => {
        if (!user) return;

        try {
            const response = await axios.post('http://localhost:3000/api/cycle', {
                userId: user.id,
                startDate,
                endDate,
                cycleLength,
            });
            setStartDate(new Date());
            setEndDate(new Date());
            setCycleLength(null);
            setErrorMessage('');
            getUserData()
        } catch (error) {
            console.error('Error adding cycle:', error);
        }
    };
    const handleDeleteCycle = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/cycle/${id}`);
            setShowDeleteModal(false);
            getUserData(); // Refresh the cycle data after deletion
        } catch (error) {
            console.error('Error deleting cycle:', error);
        }
    };
    const confirmDeleteCycle = (cycle) => {
        setCycleToDelete(cycle);  // Set cycle to be deleted
        setShowDeleteModal(true);  // Show delete confirmation modal
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);  // Close the modal if user cancels
        setCycleToDelete(null);
    };
    return (
        <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff', }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity style={{ width: '30%', justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('CycleTracking') }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>New Cycle</Text>
                </View>
            </View>


            <View style={styles.dateRow}>
                <View style={styles.dateLabelContainer}>
                    <Text style={styles.dateLabel}>Start date:</Text>
                </View>
                <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerText}>{startDate.toLocaleDateString()}</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                        <AntDesign name="edit" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateLabelContainer}>
                    <Text style={styles.dateLabel}>End date:</Text>
                </View>
                <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerText}>{endDate.toLocaleDateString()}</Text>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                        <AntDesign name="edit" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cycleLengthContainer}>
                <View style={styles.cycleLengthLabelContainer}>
                    <Text style={styles.dateLabel}>Cycle length:</Text>
                </View>
                <View style={styles.cycleLengthValueContainer}>
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : (
                        cycleLength !== null && (
                            <Text style={styles.cycleLengthText}>{cycleLength} days</Text>
                        )
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.button}
                onPress={handleAddCycle}>
                <MaterialIcons name="download" size={24} color="white" />
                <Text style={styles.buttonText}>Add cycle</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>YOUR CYCLE LIST</Text>
            <ScrollView style={styles.cycleListContainer}>
                {cycleData.map((cycle, index) => (
                    <View key={index} style={styles.cycleCard}>
                        <View>
                            <Text style={styles.cycleText}>Start date: {new Date(cycle.startDate).toLocaleDateString()}</Text>
                            <Text style={styles.cycleText}>End date: {new Date(cycle.endDate).toLocaleDateString()}</Text>
                            <Text style={styles.cycleText}>Cycle length: {cycle.cycleLength} days</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            {/* <TouchableOpacity style={styles.editButton}>
                                <AntDesign name="edit" size={20} color="white" />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteCycle(cycle)}>
                                <AntDesign name="delete" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <Modal
                transparent={true}
                animationType="fade"
                visible={showDeleteModal}
                onRequestClose={cancelDelete}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this cycle?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => handleDeleteCycle(cycleToDelete.id)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cancelDelete} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <DatePickerModal
                locale="en"
                mode="single"
                visible={showStartDatePicker}
                onDismiss={() => setShowStartDatePicker(false)}
                date={startDate}
                onConfirm={handleStartDateConfirm}
                saveLabel="Choose"
                label="Start date"
            />

            <DatePickerModal
                locale="en"
                mode="single"
                visible={showEndDatePicker}
                onDismiss={() => setShowEndDatePicker(false)}
                date={endDate}
                onConfirm={handleEndDateConfirm}
                saveLabel="Choose"
                label="End date"
            />
        </View>
    );
};

const styles = StyleSheet.create({

    dateRow: {
        marginTop: 20,
        alignItems: 'center',
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    dateLabelContainer: {
        width: '40%',
    },
    datePickerContainer: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-between'
        // borderWidth: 2,
        // borderColor: '#f6f6f7',
        // borderRadius:20
    },
    dateLabel: {
        fontSize: 18,
    },
    datePickerText: {
        fontSize: 18,
        color: '#333',
    },
    cycleLengthContainer: {
        marginTop: 20,
        alignItems: 'center',
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    cycleLengthLabelContainer: {
        width: '40%',
    },
    cycleLengthValueContainer: {
        width: '60%',
    },
    cycleLengthText: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold'
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00bdd6',
        padding: 15,
        borderRadius: 10,
        marginTop: 30,
    },
    buttonText: {
        marginLeft: 5,
        color: '#fff',
        fontSize: 18,
    },
    cycleListContainer: {
        marginTop: 10,
    },
    cycleCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cycleText: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 5,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f44336',
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#00bdd6',
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default InforCycle;
