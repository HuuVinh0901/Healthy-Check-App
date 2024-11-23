import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Modal,TextInput } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SleepTracker = ({ navigation }) => {
    const [sleepData, setSleepData] = useState([]);
    const [averageSleepTime, setAverageSleepTime] = useState("0h 0 min");
    const [sleepRate, setSleepRate] = useState("0%");
    const [isModalVisible, setModalVisible] = useState(false);
    const [bedTime, setBedTime] = useState('22:00');
    const [wakeUpTime, setWakeUpTime] = useState('07:30');
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setUser(parsedUser);
                console.log("Data của step:" + parsedUser.id)
                fetchSleepData(parsedUser.id)
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const fetchSleepData = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/sleeps/${userId}`);
            const data = await response.json();
            setSleepData(data || []);
            calculateStatistics(data || []);
            console.log(data)
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const calculateStatistics = (sleepData) => {
        const sleepDurations = sleepData.map(record =>
            calculateSleepDuration(record.bedTime, record.wakeUp, record.date)
        );

        const totalSleep = sleepDurations.reduce((sum, time) => sum + time, 0);
        const days = sleepData.length;
        const averageSleep = totalSleep / days;

        const hours = Math.floor(averageSleep / 60);
        const minutes = Math.round(averageSleep % 60);

        const standardSleep = 540 * days;
        const sleepRate = Math.min((totalSleep / standardSleep) * 100, 100);

        setAverageSleepTime(`${hours}h ${minutes} min`);
        setSleepRate(`${Math.round(sleepRate)}%`);
    };

    const calculateSleepDuration = (bedTime, wakeUp, date) => {
        console.log(`bedTime: ${bedTime}, wakeUp: ${wakeUp}, date: ${date}`);  // Log để kiểm tra dữ liệu đầu vào
    
        const startTime = new Date(`${date}T${bedTime}:00`);
        let endTime = new Date(`${date}T${wakeUp}:00`);
    
        // Kiểm tra xem endTime có nhỏ hơn startTime không, nếu có thì điều chỉnh
        if (endTime <= startTime) {
            endTime.setDate(endTime.getDate() + 1);  // Nếu giờ thức dậy nhỏ hơn giờ đi ngủ, thêm một ngày vào endTime
        }
    
        console.log(`startTime: ${startTime}, endTime: ${endTime}`);  // Log thời gian bắt đầu và kết thúc
    
        const sleepDuration = (endTime - startTime) / (1000 * 60); // Chuyển từ milliseconds sang phút
        console.log(`sleepDuration: ${sleepDuration} phút`);  // Log kết quả thời gian ngủ
    
        return sleepDuration;
    };
    

    // Xác định ngày trong tuần
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = moment();
    const startOfWeek = today.clone().startOf('isoWeek');
    const currentDayIndex = today.isoWeekday() - 1;

    const chartData = labels.map((label, index) => {
        const currentDate = startOfWeek.clone().add(index, 'days').format("YYYY-MM-DD");
        // Sử dụng moment để so sánh ngày chính xác
        const sleepRecord = sleepData.find(record => moment(record.date).isSame(moment(currentDate), 'day'));
    
        console.log(`Ngày: ${label}, currentDate: ${currentDate}, sleepRecord.date: ${sleepRecord ? sleepRecord.date : 'Không có dữ liệu'}`);
    
        const sleepHours = sleepRecord ? calculateSleepDuration(sleepRecord.bedTime, sleepRecord.wakeUp, sleepRecord.date) / 60 : 0;
    
        console.log(`Số giờ ngủ thực tế: ${sleepHours}`);
    
        const maxSleepHours = 9;
        const isToday = index === currentDayIndex;
    
        return {
            x: label,
            actual: sleepHours,
            max: maxSleepHours,
            isToday,
        };
    });
    
    
    const handleSave = () => {
        const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
        
        if (!timePattern.test(bedTime) || !timePattern.test(wakeUpTime)) {
            setErrorMessage('Please enter valid time in HH:mm format');
        } else {
            setErrorMessage('');
            // Update the schedule logic
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '43%', justifyContent: 'center' }}
                     onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sleep</Text>
                </View>

            </View>
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
                <Text style={styles.title}>Your average time of</Text>
                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.title}>sleep a day is</Text>
                    <Text style={styles.averageSleep}>{averageSleepTime}</Text>
                </View>

            </View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Svg height="250" width="400">
                    <G y={50}>
                        {chartData.map((d, index) => (
                            <React.Fragment key={index}>
                                {/* Cột nền */}
                                <Rect
                                    x={index * 50 + 30}
                                    y={150 - d.max * 15}
                                    width="40"
                                    height={d.max * 15}
                                    fill="#f3f4f6"
                                    rx="10"
                                    ry="10"
                                />
                                {/* Cột thực tế */}
                                <Rect
                                    x={index * 50 + 30}
                                    y={150 - d.actual * 15}
                                    width="40"
                                    height={d.actual * 15}
                                    fill={d.isToday ? "#1ce5ff" : "#a6f5ff"}
                                    rx="10"
                                    ry="10"
                                />
                                {/* Nhãn cho các cột */}
                                <SvgText
                                    x={index * 50 + 50}
                                    y={180}
                                    fontSize="14"
                                    textAnchor="middle"
                                >
                                    {d.x}
                                </SvgText>
                            </React.Fragment>
                        ))}
                    </G>
                </Svg>
            </View>

            {/* <View style={{ gap: 10, flexDirection: 'row', marginVertical: 10, marginHorizontal: 10 }}>
                <TouchableOpacity style={{ width: '49%', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7', paddingVertical: 5 }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="star-rate" size={24} color="#fce100" />
                        <Text style={{ marginLeft: 5 }}>Sleep rate</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{sleepRate}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '49%', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7', paddingVertical: 10 }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name="dizzy" size={22} color="#ffc83d" />
                        <Text style={{ marginLeft: 5 }}>Deepsleep</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Text style={{ fontSize: 13 }}>insights</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Set your schedule</Text>
                <TouchableOpacity><Text style={{ color: '#4dd6e5', fontSize: 15, fontWeight: 'bold' }}
                onPress={()=>setModalVisible(true)}>Edit</Text></TouchableOpacity>
            </View>
            <View style={{ gap: 10, flexDirection: 'row', marginVertical: 10, marginHorizontal: 10 }}>
                <TouchableOpacity style={{ paddingLeft: 10, width: '49%', borderRadius: 20, paddingVertical: 5, backgroundColor: '#e05858' }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="bed" size={18} color="white" />
                        <Text style={{ marginLeft: 5, color: 'white' }}>Bedtime</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{bedTime}</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>pm</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 10, width: '49%', borderRadius: 20, paddingVertical: 5, backgroundColor: '#ed7d2d' }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="notifications-outline" size={24} color="white" />
                        <Text style={{ marginLeft: 5, color: 'white' }}>Wake up</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{wakeUpTime}</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>am</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Modal visible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Sleep Schedule</Text>
                    <TextInput
                        style={styles.input}
                        value={bedTime}
                        onChangeText={setBedTime}
                        placeholder="Bed Time"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={wakeUpTime}
                        onChangeText={setWakeUpTime}
                        placeholder="Wake Up Time"
                        keyboardType="numeric"
                    />
                    {errorMessage ? <Text style={{color:'red'}}>{errorMessage}</Text> : null}
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',

    },
    averageSleep: {
        fontSize: 20,
        marginLeft: 5,
        color: '#00c0d8',
        fontWeight: 'bold'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SleepTracker;
