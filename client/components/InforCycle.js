import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const InforCycle = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [cycleLength, setCycleLength] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Hàm tính độ dài chu kỳ (tính bằng ngày)
    const calculateCycleLength = (start, end) => {
        const diffTime = new Date(end).getTime() - new Date(start).getTime();
        const diffDays = diffTime / (1000 * 3600 * 24); // Chuyển đổi từ mili giây sang ngày
        return diffDays;
    };

    // Hàm xử lý thay đổi ngày bắt đầu
    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
        setShowStartDatePicker(false); // Đóng picker sau khi chọn
    };

    // Hàm xử lý thay đổi ngày kết thúc
    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setEndDate(currentDate);
        setShowEndDatePicker(false); // Đóng picker sau khi chọn
    };

    // Tính chu kỳ khi ngày bắt đầu hoặc ngày kết thúc thay đổi
    useEffect(() => {
        if (new Date(endDate) <= new Date(startDate)) {
            setErrorMessage('Ngày kết thúc phải sau ngày bắt đầu.');
            setCycleLength(null);
        } else {
            setErrorMessage('');
            const length = calculateCycleLength(startDate, endDate);
            setCycleLength(length);
        }
    }, [startDate, endDate]);

    return (
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <Text style={styles.headerText}>Add New Cycle</Text>
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateLabelContainer}>
                    <Text style={styles.dateLabel}>Start date:</Text>
                </View>
                <View style={styles.datePickerContainer}>
                    {Platform.OS !== 'web' && (
                        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                            <Text style={styles.datePickerText}>{startDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    )}

                    {Platform.OS === 'web' && (
                        <DatePicker
                            selected={startDate}
                            onChange={setStartDate}
                            dateFormat="dd/MM/YYYY"
                            className="datepicker"
                        />
                    )}
                </View>
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateLabelContainer}>
                    <Text style={styles.dateLabel}>End date:</Text>
                </View>
                <View style={styles.datePickerContainer}>
                    {Platform.OS !== 'web' && (
                        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                            <Text style={styles.datePickerText}>{endDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    )}

                    {Platform.OS === 'web' && (
                        <DatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            dateFormat="dd/MM/YYYY"
                            className="datepicker"
                        />
                    )}
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

            <TouchableOpacity style={styles.button}>
                <MaterialIcons name="download" size={24} color="white" />
                <Text style={styles.buttonText}>Add meals</Text>
            </TouchableOpacity>

            {/* Modal cho Start Date Picker */}
            <Modal visible={showStartDatePicker} transparent={true} animationType="slide">
                <TouchableWithoutFeedback onPress={() => setShowStartDatePicker(false)}>
                    <View style={styles.modalBackground}>
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={handleStartDateChange}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal cho End Date Picker */}
            <Modal visible={showEndDatePicker} transparent={true} animationType="slide">
                <TouchableWithoutFeedback onPress={() => setShowEndDatePicker(false)}>
                    <View style={styles.modalBackground}>
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={handleEndDateChange}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1ce5ff',
    },
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
        fontSize: 18,
        color: '#333',
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default InforCycle;
