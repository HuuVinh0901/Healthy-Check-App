import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const NutritionForm = ({navigation}) => {
    const [fat, setFat] = useState('');
    const [protein, setProtein] = useState('');
    const [carb, setCarb] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [calories, setCalories] = useState(0);
    const [meals, setMeals] = useState([]);
    const [user, setUser] = useState(null);
    useEffect(() => {
        getUserData()
    }, []);
    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setUser(parsedUser);
                fetchNutritions(parsedUser.id);
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const fetchNutritions = async (userId) => {
        try {
            const today = new Date().toISOString().split('T')[0]; // Get today's date
            const response = await fetch(`http://localhost:3000/api/nutritions/${userId}/${today}`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setMeals(data);  // Store the meals data in the state
            } else {
                console.log("No nutrition data found for today");
            }
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        }
    };
    const validateInput = (input) => {

        const regex = /^\d+(\.\d+)?$/;
        return regex.test(input);
    };
    const handleSubmit = () => {
        if (!validateInput(fat) || !validateInput(protein) || !validateInput(carb)) {
            setIsModalVisible(true);

        } else {
            handleAddMeal()

        }
    };
    const calculateCalories = (fat, protein, carb) => {
        const fatValue = parseFloat(fat) || 0;
        const proteinValue = parseFloat(protein) || 0;
        const carbValue = parseFloat(carb) || 0;
        const cal = fatValue * 9 + proteinValue * 4 + carbValue * 4;
        setCalories(cal);
    };
    // Gọi hàm calculateCalories khi giá trị fat, protein, carb thay đổi
    const handleFatChange = (value) => {
        setFat(value);
        calculateCalories(value, protein, carb);  // Tính lại calories khi fat thay đổi
    };

    const handleProteinChange = (value) => {
        setProtein(value);
        calculateCalories(fat, value, carb);  // Tính lại calories khi protein thay đổi
    };

    const handleCarbChange = (value) => {
        setCarb(value);
        calculateCalories(fat, protein, value);  // Tính lại calories khi carb thay đổi
    };
    const handleAddMeal = async () => {
        if (!user) return; // Ensure user data exists

        try {
            const today = new Date().toISOString().split('T')[0]; // Get today's date

            // Send a POST request to create a new nutrition entry
            const response = await axios.post('http://localhost:3000/api/nutritions', {
                userId: user.id,
                calories,
                protein,
                carbs: carb,
                fats: fat,
                date: today,
            });
            getUserData()
            // Clear input fields after adding the meal
            setFat('');
            setProtein('');
            setCarb('');
            setCalories(0);

        } catch (error) {
            console.error('Error adding nutrition data:', error);
        }
    };
    const renderMealItem = ({ item }) => (
        <View style={styles.mealItem}>
            <Text style={styles.mealText}>Calories: {item.calories}</Text>
            <Text style={styles.mealText}>Fat: {item.fats}g</Text>
            <Text style={styles.mealText}>Protein: {item.protein}g</Text>
            <Text style={styles.mealText}>Carbs: {item.carbs}g</Text>
        </View>
    );
    return (
        <View style={styles.container}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity style={{ width: '30%', justifyContent: 'center' }}
                    onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Meals</Text>
                </View>
            </View>
            <ScrollView>
                <Text style={styles.label}>Fat (g):</Text>
                <TextInput
                    style={styles.input}
                    value={fat}
                    onChangeText={handleFatChange}
                    keyboardType="numeric"
                    placeholder="Enter fat value"
                />

                <Text style={styles.label}>Protein (g):</Text>
                <TextInput
                    style={styles.input}
                    value={protein}
                    onChangeText={handleProteinChange}
                    keyboardType="numeric"
                    placeholder="Enter protein value"
                />

                <Text style={styles.label}>Carbs (g):</Text>
                <TextInput
                    style={styles.input}
                    value={carb}
                    onChangeText={handleCarbChange}
                    keyboardType="numeric"
                    placeholder="Enter carb value"
                />
                <Text style={styles.label}>Calories:</Text>
                <TextInput
                    style={styles.input}
                    value={calories.toString()}  // Hiển thị giá trị calories
                    editable={false}
                />

                <TouchableOpacity style={styles.button}
                    onPress={handleSubmit}   >
                    <MaterialIcons name="download" size={24} color="white" />
                    <Text style={styles.buttonText}>Add new meal</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Meals for Today:</Text>
                <FlatList
                    data={meals}
                    renderItem={renderMealItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.mealsList}
                />
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Please enter valid numbers for fat, protein, and carbs.</Text>
                        <Button title="Close" onPress={() => setIsModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 20,
        paddingLeft: 10,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
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
    mealsList: {
        marginTop: 20,
        paddingBottom: 20,
    },
    mealItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 15,
    },
    mealText: {
        fontSize: 16,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default NutritionForm;
