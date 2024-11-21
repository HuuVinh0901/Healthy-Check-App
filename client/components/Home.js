import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
const Home = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [user, setUser] = useState(null);
    const [currentDateCycle, setCurrentDateCycle] = useState(new Date());
    const [blogs, setBlogs] = useState([]);
    const [steps, setSteps] = useState(0);
    const [stepWeek, setStepWeek] = useState(0);
    const [kcal, setKcal] = useState(0);
    const [cycleData, setCycleData] = useState([]);
    const [totalSleepTime, setTotalSleepTime] = useState(0);
    const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(null);
    const [gender, setGender] = useState('')
    const [avatar, setAvatar] = useState(null);
    useEffect(() => {
        getCurrentDate()
        getUserData();
        fetchBlogs()
    }, []);
    useEffect(() => {
        if (cycleData.length > 0) {
            calculateDaysUntilNextPeriod();
        }
    }, [cycleData]);
    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/blog');
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };
    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short' }; // Format: "TUES 11 JUL"
        setCurrentDate(date.toLocaleDateString('en-US', options).toUpperCase());
    };
    const getUserData = async () => {
        try {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const parsedUser = JSON.parse(currentUser);
                setUser(parsedUser);
                console.log(parsedUser.avatar)
                const imageUrl = `http://localhost:3000${parsedUser.avatar}`;
                setAvatar(imageUrl);
                fetchSteps(parsedUser.id)
                fetchStepsWeek(parsedUser.id)
                fetchNutritions(parsedUser.id)
                fetchCycleData(parsedUser.id)
                fetchSleepData(parsedUser.id)
                setGender(parsedUser.gender)
                setCurrentUserName(parsedUser.name)
                
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };
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

        }
    }
    const fetchStepsWeek = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/steps/${userId}`); // API cho bước trong ngày hiện tại
            const data = await response.json();
            console.log("Dữ liệu từ API step:", data);
            const currentDate = moment();
            const startOfWeek = currentDate.clone().startOf('week');
            const endOfWeek = currentDate.clone().endOf('week');


            const stepsThisWeek = data.filter((stepRecord) => {
                const stepDate = moment(stepRecord.date);
                return stepDate.isBetween(startOfWeek, endOfWeek, null, '[]');
            });

            const totalStepsThisWeek = stepsThisWeek.reduce((total, stepRecord) => total + stepRecord.steps, 0);
            setStepWeek(totalStepsThisWeek);
            console.log(`Tổng số bước trong tuần: ${totalStepsThisWeek}`);

        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const fetchNutritions = async (userId) => {
        try {
            const today = new Date().toISOString().split('T')[0];

            const response = await fetch(`http://localhost:3000/api/nutritions/${userId}/${today}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const totalNutrition = data.reduce(
                    (totals, meal) => ({
                        calories: totals.calories + meal.calories,

                    }),
                    { calories: 0 } // Giá trị khởi tạo
                );
                setKcal(totalNutrition.calories)

            } else {
                console.log("Không có dữ liệu dinh dưỡng");
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const fetchCycleData = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cycle/${userId}`);
            const data = await response.json();
            setCycleData(data || []);
            console.log("Dữ liệu từ API chu kì:", data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const calculateDaysUntilNextPeriod = () => {
        const lastCycle = cycleData[cycleData.length - 1]; // Lấy chu kỳ gần nhất
        if (lastCycle) {
            const lastEndDate = moment(lastCycle.endDate, 'YYYY-MM-DD');
            const nextCycleStartDate = lastEndDate.add(lastCycle.cycleLength, 'days');
            const diffDays = nextCycleStartDate.diff(moment(currentDateCycle), 'days');
            console.log(lastEndDate)
            console.log(nextCycleStartDate)
            console.log(diffDays)
            setDaysUntilNextPeriod(diffDays);

        }
    };


    const fetchSleepData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/sleeps/${userId}`);
            const sleepData = response.data; // Dữ liệu giấc ngủ lấy từ API
            const currentDate = moment(); // Ngày hiện tại
            const startOfWeek = currentDate.clone().startOf('week'); // Bắt đầu tuần (Chủ nhật)
            const endOfWeek = currentDate.clone().endOf('week'); // Kết thúc tuần (Thứ bảy)

            // Lọc dữ liệu giấc ngủ trong tuần hiện tại
            const sleepDataThisWeek = sleepData.filter((sleepRecord) => {
                const sleepDate = moment(sleepRecord.date); // Chuyển đổi date sang moment
                return sleepDate.isBetween(startOfWeek, endOfWeek, null, '[]'); // Kiểm tra xem ngày có nằm trong tuần hiện tại không
            });

            // Tính tổng số giờ và phút ngủ trong tuần
            let totalSleepMinutes = 0; // Lưu tổng số phút ngủ

            sleepDataThisWeek.forEach((sleepRecord) => {
                const bedTime = moment(sleepRecord.bedTime, 'HH:mm');
                let wakeUpTime = moment(sleepRecord.wakeUp, 'HH:mm');

                // Nếu thời gian thức dậy nhỏ hơn thời gian đi ngủ (thức dậy vào ngày hôm sau), cộng thêm một ngày vào wakeUpTime
                if (wakeUpTime.isBefore(bedTime)) {
                    wakeUpTime = wakeUpTime.add(1, 'days');
                }

                const minutesSlept = wakeUpTime.diff(bedTime, 'minutes'); // Tính số phút ngủ

                totalSleepMinutes += minutesSlept;
            });

            // Chuyển đổi tổng số phút thành giờ và phút
            const totalHours = Math.floor(totalSleepMinutes / 60); // Tính số giờ
            const remainingMinutes = totalSleepMinutes % 60; // Số phút còn lại

            // Hiển thị tổng số giờ và phút ngủ
            console.log(`Tổng số giờ ngủ trong tuần: ${totalHours} giờ ${remainingMinutes} phút`);
            setTotalSleepTime(`${totalHours}h ${remainingMinutes}min`); // Cập nhật state nếu cần

        } catch (error) {
            console.error('Error fetching sleep data:', error);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fafafb', justifyContent: 'space-between', }}>

            <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('Laugh') }}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('MyAbout') }}>
                        <Image style={{ height: 70, width: 70,borderRadius:50 }}
                            source={
                                avatar
                                    ? { uri: avatar }
                                    : gender === 'male'
                                        ? require('../assets/data/male.png')
                                        : require('../assets/data/female.png')
                            }
                        />
                    </TouchableOpacity>

                </View>
            </View>

            <ScrollView style={{ height: 900, flex: 1 }}>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="sunny-sharp" size={24} color="black" />
                    <Text style={{ marginLeft: 10, }}>{currentDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'center' }}>
                    <View style={{ width: '75%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Overview</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '25%', alignItems: 'flex-end', borderWidth: 1, borderRadius: 15, borderColor: '#4bcfe0', paddingVertical: 10, paddingHorizontal: 5, justifyContent: 'center' }}
                        onPress={() => { navigation.navigate('AllData') }}>
                        <FontAwesome6 name="database" size={20} color="#4bcfe0" />
                        <Text style={{ marginLeft: 5, color: '#4bcfe0', fontWeight: 'bold' }}>All data</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginVertical: 10, marginHorizontal: 15, flexDirection: 'row', backgroundColor: '#ebfdff', borderRadius: 10, }}>
                    <View style={{ width: '70%', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Health Score</Text>
                        <Text style={{ color: '#7c8689' }}>Based on your overview</Text>
                        <Text style={{ color: '#7c8689' }}>health tracking, your score is</Text>
                        <Text style={{ color: '#7c8689' }}>78 and consider good...</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: '#35cbdf', fontWeight: 'bold' }}>Tell me more</Text>
                            <Entypo name="controller-play" size={18} color="#35cbdf" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '30%', }}>
                        <View style={{ borderBottomLeftRadius: 30, borderBottomEndRadius: 30, backgroundColor: '#8353e2', width: '70%', paddingVertical: 30, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>78</Text></View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Highlights</Text>
                    </View>
                    {/* <TouchableOpacity style={{ width: '50%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity> */}
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#1ce5ff', paddingVertical: 15 }}
                        onPress={() => { navigation.navigate('StepTracker') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="run" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Steps</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{steps}</Text>
                            <Text style={{ color: 'white', }}>updated 15 min ago</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#e77e7e', paddingVertical: 15 }}
                        onPress={() => { navigation.navigate('CycleTracking') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="calendar-month-outline" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Cycle tracking</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{daysUntilNextPeriod} days before period</Text>
                            <Text style={{ color: 'white', }}>updated 30 min ago</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#125d95', paddingVertical: 15 }}
                        onPress={() => { navigation.navigate('SleepTracker') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="power-sleep" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Sleep</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>7 h 31 min</Text>
                            <Text style={{ color: 'white', }}>updated 8 day ago</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#cc5f12', paddingVertical: 15 }}
                        onPress={() => { navigation.navigate('NutritionTracker') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="food-variant" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Nutrition</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{kcal} kcal</Text>
                            <Text style={{ color: 'white', }}>updated 5 min ago</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>This week report</Text>
                    </View>
                    <TouchableOpacity style={{ width: '40%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="footsteps" size={24} color="red" />
                            <Text>Steps</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>697,978</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="arm-flex-outline" size={24} color="black" />
                            <Text>Workout</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>6h 45min</Text>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="water" size={24} color="#00bcf2" />
                            <Text>Water</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>10,689 ml</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="sleep" size={24} color="black" />
                            <Text>Sleep</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{totalSleepTime}</Text>

                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <View style={{ marginTop: 10, flexDirection: 'row', paddingVertical: 20, backgroundColor: 'white', }}>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}

                >
                    <MaterialIcons name="insert-chart-outlined" size={24} color="#4cd1e2" />
                    <Text style={{ color: '#4cd1e2' }}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Explore')}>
                    <MaterialIcons name="explore" size={24} color="black" />
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', width: '33%', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('Share')}>
                    <Feather name="share-2" size={24} color="black" />
                    <Text>Sharing</Text>
                </TouchableOpacity>

            </View>
        </View>


    )
}

export default Home;