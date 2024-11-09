import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
const StepTrackerScreen = ({navigation}) => {
    const [user, setUser] = useState(null);
    const [steps, setSteps] = useState(0);
    useEffect(() => {
        const getUserData = async () => {
          try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
              const parsedUser = JSON.parse(currentUser);
              setUser(parsedUser);
               console.log("Data của step:"+parsedUser.id)
               fetchSteps(parsedUser.id)
            }
          } catch (error) {
            console.error('Error fetching user data', error);
          }
        };
      
        getUserData();
      }, []);
      const fetchSteps = async (userId) => {
        try {
            const today = new Date().toISOString().split('T')[0]; 
            console.log(today)// Lấy ngày hiện tại theo định dạng YYYY-MM-DD
            const response = await fetch(`http://localhost:3000/api/steps/${userId}/${today}`); // Thay bằng URL đúng của bạn
            const data = await response.json();
            console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu trả về
            if (data && data.steps) {
                setSteps(data.steps);  // Cập nhật state với số bước
            } else {
                console.log("Không có dữ liệu bước đi");
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        } finally {
            setLoading(false); // Đảm bảo set loading false khi kết thúc
        }
    };
    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    //step
    // const steps = 11857;
    const goalStep = 18000;
    const progressStep = (steps / goalStep) * 100;
    const progressOffsetStep = circumference - (progressStep / 100) * circumference;
    //calo
    const kcal = steps*0.05; //Mỗi bước chân tiêu thụ 0.05kcal
    const goalKcal = 1700;
    const progressKcal = (kcal / goalKcal) * 100;
    const progressOffsetKcal = circumference - (progressKcal / 100) * circumference;
    //km
    const km = (steps*0.5)/1000;
    const goalKm = 20;
    const progressKm = (km / goalKm) * 100;
    const progressOffsetKm = circumference - (progressKm / 100) * circumference;
    //TIme
    const time = (km/5)*60;
    const goalTime = 200;
    const progressTime = (time / goalTime) * 100;
    const progressOffsetTime = circumference - (progressTime / 100) * circumference;


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '43%', justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('Home') }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Steps</Text>
                </View>

            </View>

            <ScrollView>
                <View style={{ marginVertical: 20, alignItems: 'center' }}>
                    <View>
                        <Text style={styles.subtitle}>You have achieved</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.highlight}>{Math.round(progressStep)}%</Text>
                        <Text style={styles.subtitle}>of your goal today</Text>
                    </View>

                </View>


                <View style={styles.progressCircleContainer}>
                    <Svg height="250" width="300" viewBox="0 0 120 120">
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#e0e0e0"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        <Circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#00bdd6"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={progressOffsetStep}
                            strokeLinecap="round"
                            transform="rotate(-90, 60, 60)"
                        />
                    </Svg>
                    <View style={styles.innerCircle}>
                        <Ionicons name="footsteps-outline" size={32} color="#14bfd7" />
                        <Text style={styles.stepsText}>{steps}</Text>
                        <Text style={styles.goalSubtext}>Steps out of {goalStep}</Text>
                    </View>
                </View>


                <View style={styles.statsContainer}>
                    {/* Biểu đồ Kcal */}
                    <View style={styles.statItem}>

                        <Svg height="50" width="50" viewBox="0 0 120 120">
                            <Circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#fce5d5"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            <Circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#ed7d2d"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffsetKcal}
                                strokeLinecap="round"
                                transform="rotate(-90, 60, 60)"
                            />
                        </Svg>
                        <View style={styles.innerCircleMini}>
                            <MaterialIcons name="local-fire-department" size={24} color="#ed7d2d" />
                        </View>
                        <Text style={styles.statValue}>{kcal} kcal</Text>
                    </View>
                    <View style={styles.statItem}>

                        <Svg height="50" width="50" viewBox="0 0 120 120">
                            <Circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#f9dddd"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            <Circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#e05858"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffsetKm}
                                strokeLinecap="round"
                                transform="rotate(-90, 60, 60)"
                            />
                        </Svg>
                        <View style={styles.innerCircleMini}>
                            <Entypo name="location-pin" size={24} color="#e05858" />
                        </View>
                        <Text style={styles.statValue}>{km} km</Text>
                    </View>
                    <View style={styles.statItem}>

                        <Svg height="50" width="50" viewBox="0 0 120 120">
                            <Circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#ccf2f7"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            <Circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#00bdd6"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={progressOffsetTime}
                                strokeLinecap="round"
                                transform="rotate(-90, 60, 60)"
                            />
                        </Svg>
                        <View style={styles.innerCircleMini}>
                            <FontAwesome name="pie-chart" size={22} color="#00bdd6" />
                        </View>
                        <Text style={styles.statValue}>{time} min</Text>
                    </View>
                </View>

                {/* Biểu đồ đường */}
                <View style={styles.chartContainer}>
                    <LineChart
                        data={{
                            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            datasets: [{ data: [4000, 12000, 8000, 14000, 10000, 12000, 16000] }]
                        }}
                        width={Dimensions.get("window").width - 40}
                        height={200}
                        yAxisSuffix="k"
                        chartConfig={{
                            backgroundGradientFrom: "#e0f7fa",
                            backgroundGradientTo: "#00bcd4",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            strokeWidth: 2
                        }}
                        style={styles.chartStyle}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',

        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
        // marginVertical: 10,
    },
    highlight: {
        // textAlign: 'center',
        color: '#00aaff',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10
    },
    progressCircleContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerCircle: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',

    },
    innerCircleMini: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    stepsText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    goalSubtext: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 20,

    },
    statItem: {
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    statValue: {
        fontSize: 16,
        marginTop: 10
    },
    chartContainer: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    chartStyle: {
        borderRadius: 16,
    },
});

export default StepTrackerScreen;
