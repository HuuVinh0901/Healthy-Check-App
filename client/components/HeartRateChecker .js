import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
const HeartRateChecker = ({ navigation }) => {
    const [heartRate, setHeartRate] = useState('');
    const [healthStatus, setHealthStatus] = useState('');

    const handleHeartRateChange = (text) => {
        setHeartRate(text);
    };

    const checkHeartRate = () => {
        const rate = parseInt(heartRate);
        let status = '';

        if (isNaN(rate) || rate <= 0) {
            status = 'Please enter a valid value for heart rate.';
        } else if (rate < 60) {
            status = 'Your heart rate is a bit low. Additional testing may be needed!';
        } else if (rate >= 60 && rate <= 100) {
            status = 'Your heart rate is normal. You are healthy!';
        } else if (rate > 100) {
            status = 'Your heart rate is a bit high. You may feel tired or stressed. Take a rest!';
        }

        setHealthStatus(status);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Heart rate</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter your heart rate (bpm)"
                value={heartRate}
                onChangeText={handleHeartRateChange}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={checkHeartRate}>
                <Foundation name="results" size={20} color="white" />
                <Text style={styles.buttonText}>Result</Text>
            </TouchableOpacity>

            {healthStatus && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{healthStatus}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: '35%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginVertical: 20
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00bdd6',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        marginLeft: 5,
        color: '#fff',
        fontSize: 18,
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    resultText: {
        fontSize: 16,
        color: '#333',
    },
});

export default HeartRateChecker;
