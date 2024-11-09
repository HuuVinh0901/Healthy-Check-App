import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Circle, Svg } from 'react-native-svg';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
const NutritionTracker = ({navigation}) => {
    const data = [
        {
            userId: 1, fat: 70, protein: 150, carb: 220
        }
    ];

    // Lấy thông tin của người dùng đầu tiên
    const { fat, protein, carb } = data[0]; // Dùng destructuring để lấy dữ liệu từ phần tử đầu tiên trong mảng

    const radiusFat = 35;
    const radiusProtein = 45; // Protein có bán kính lớn hơn
    const radiusCarbs = 55;   // Carbs có bán kính lớn nhất

    const circumferenceFat = 2 * Math.PI * radiusFat;
    const circumferenceProtein = 2 * Math.PI * radiusProtein;
    const circumferenceCarbs = 2 * Math.PI * radiusCarbs;
    const strokeWidth = 8;


    // Tính toán tổng calo từ fat, protein và carbs
    const totalKcal = fat * 9 + protein * 4 + carb * 4;
    const kcalAutal = 2200;
    const proteins = kcalAutal * 0.3 / 4
    const fats = kcalAutal * 0.3 / 9
    const carbs = kcalAutal * 0.4 / 4


    const progressFat = (fat / fats) * circumferenceFat;
    const progressProtein = (protein / proteins) * circumferenceProtein;
    const progressCarbs = (carb / carbs) * circumferenceCarbs;

    // Hàm tính tỷ lệ phần trăm
    const calculatePercentage = (currentValue, totalValue) => {
        return (currentValue / totalValue) * 100;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '40%', justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('Home') }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Nutrition</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={styles.subtitle}>You have</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.subtitle}>consumed</Text>
                    <Text style={styles.highlight}>{totalKcal} kcal</Text>
                </View>
                <Text style={styles.subtitle}>today</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Svg height="280" width="400" viewBox="0 0 120 120">
                    {/* Vòng tròn carbs */}
                    <Circle
                        cx="60"
                        cy="60"
                        r={radiusCarbs}
                        stroke="#f4f6fa"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx="60"
                        cy="60"
                        r={radiusCarbs}
                        stroke="#1ce5ff"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumferenceCarbs}
                        strokeDashoffset={circumferenceCarbs - progressCarbs}
                        strokeLinecap="round"
                        transform="rotate(-90, 60, 60)"
                    />

                    {/* Vòng tròn protein */}
                    <Circle
                        cx="60"
                        cy="60"
                        r={radiusProtein}
                        stroke="#f4f6fa"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx="60"
                        cy="60"
                        r={radiusProtein}
                        stroke="#e77e7e"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumferenceProtein}
                        strokeDashoffset={circumferenceProtein - progressProtein}
                        strokeLinecap="round"
                        transform="rotate(-90, 60, 60)"
                    />

                    {/* Vòng tròn fat */}
                    <Circle
                        cx="60"
                        cy="60"
                        r={radiusFat}
                        stroke="#f4f6fa"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx="60"
                        cy="60"
                        r={radiusFat}
                        stroke="#f19b5d"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumferenceFat}
                        strokeDashoffset={circumferenceFat - progressFat}
                        strokeLinecap="round"
                        transform="rotate(-90, 60, 60)"
                    />
                </Svg>
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        {calculatePercentage(totalKcal, kcalAutal).toFixed(1)}%
                    </Text>
                    <Text style={{ fontSize: 15 }}>of {kcalAutal} kcal</Text>
                </View>

            </View>


            <View style={{ marginHorizontal: 10, marginVertical: 10, gap: 10 }}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, borderColor: '#f6f6f7' }}>
                    <View style={{ width: '40%', flexDirection: 'row', gap: 10 }}>
                        <FontAwesome name="circle" size={24} color="#f19b5d" />
                        <Text>Fat</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{fat} g</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{calculatePercentage(fat, fats).toFixed(1)}%</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, borderColor: '#f6f6f7' }}>
                    <View style={{ width: '40%', flexDirection: 'row', gap: 10 }}>
                        <FontAwesome name="circle" size={24} color="#e77e7e" />
                        <Text>Protein</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{protein} g</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{calculatePercentage(protein, proteins).toFixed(1)}%</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 10, borderColor: '#f6f6f7' }}>
                    <View style={{ width: '40%', flexDirection: 'row', gap: 10 }}>
                        <FontAwesome name="circle" size={24} color="#1ce5ff" />
                        <Text>Carbs</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{carbs} g</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{calculatePercentage(carb, carbs).toFixed(1)}%</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.button}>
                <Entypo name="bowl" size={24} color="white" />
                <Text style={styles.buttonText}>Add meals</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    subtitle: { fontWeight: 'bold', fontSize: 20, marginTop: 8 },
    highlight: { fontSize: 20, color: '#00bfff', fontWeight: 'bold', marginLeft: 5, marginTop: 8 },
    percentage: { fontSize: 32, fontWeight: 'bold', marginVertical: 20 },
    nutritionInfo: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
    nutritionItem: { alignItems: 'center' },
    nutritionLabel: { color: '#f39c12', fontSize: 16 },
    button: {flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor: '#00bdd6', padding: 15, borderRadius: 10, marginTop: 30 },
    buttonText: {marginLeft:5, color: '#fff', fontSize: 18 },
});

export default NutritionTracker;