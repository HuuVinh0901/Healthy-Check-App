import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
const Home = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [user, setUser] = useState(null);
    const [currentDateCycle, setCurrentDateCycle] = useState(new Date());
    const [sleepData, setSleepData] = useState("0h 0 min");
    const [steps, setSteps] = useState(0);
    const [stepWeek, setStepWeek] = useState(0);
    const [currentUserName, setCurrentUserName] = useState('')
    //One day
    const [proteinData, setProteinData] = useState(0);
    const [carbData, setCarbData] = useState(0);
    const [fatData, setFatData] = useState(0);
    //Week
    const [proteinDataWeek, setProteinDataWeek] = useState(0);
    const [carbDataWeek, setCarbDataWeek] = useState(0);
    const [fatDataWeek, setFatDataWeek] = useState(0);

    const [cycleData, setCycleData] = useState([]);
    const [sleepWeek, setSleepWeek] = useState("0h 0 min");
    const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(null);
    const [gender, setGender] = useState('')
    const [avatar, setAvatar] = useState(null);
    useEffect(() => {
        getCurrentDate()
        getUserData();
    }, []);
    useEffect(() => {
        if (cycleData.length > 0) {
            calculateDaysUntilNextPeriod();
        }
    }, [cycleData]);
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
                setCurrentUserName(parsedUser.name)
                console.log(parsedUser.avatar)
                if (parsedUser.avatar === null) {
                    setAvatar(null);
                }
                else {
                    const imageUrl = `http://localhost:3000${parsedUser.avatar}`;
                    setAvatar(imageUrl)
                }
                fetchSteps(parsedUser.id)
                fetchStepsWeek(parsedUser.id)
                fetchNutritions(parsedUser.id)
                fetchCycleData(parsedUser.id)
                fetchSleepData(parsedUser.id)
                setGender(parsedUser.gender)
                fetchSleepDataWeek(parsedUser.id)
                fetchNutritionsWeek(parsedUser.id)
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };
    const fetchSleepData = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/sleeps/${userId}`);
            const data = await response.json();

            // Lọc dữ liệu giấc ngủ trong ngày hôm nay
            if (Array.isArray(data)) {
                const today = moment().format('YYYY-MM-DD'); // Ngày hôm nay

                // Lọc các bản ghi giấc ngủ của ngày hôm nay
                const sleepToday = data.filter((sleepRecord) => sleepRecord.date === today);

                if (sleepToday.length > 0) {
                    const { bedTime, wakeUp } = sleepToday[0]; // Giả sử chỉ có một bản ghi giấc ngủ trong ngày hôm nay

                    const bedTimeMoment = moment(bedTime, 'HH:mm'); // Chuyển đổi thời gian vào giờ phút
                    let wakeUpMoment = moment(wakeUp, 'HH:mm');

                    // Nếu giờ thức dậy nhỏ hơn giờ đi ngủ, nghĩa là thức dậy vào ngày hôm sau
                    if (wakeUpMoment.isBefore(bedTimeMoment)) {
                        wakeUpMoment = wakeUpMoment.add(1, 'days'); // Thêm 1 ngày vào thời gian thức dậy
                    }

                    // Tính chênh lệch giữa thời gian thức dậy và giờ đi ngủ
                    const duration = moment.duration(wakeUpMoment.diff(bedTimeMoment));

                    // Lấy ra số giờ, phút, giây
                    const hours = duration.hours();
                    const minutes = duration.minutes();
                    console.log("Giờ: " + hours);
                    console.log("Phút: " + minutes);
                    setSleepData(`${hours}h ${minutes} min`);
                } else {
                    console.log("Không có dữ liệu giấc ngủ hôm nay.");
                }
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };


    const fetchSleepDataWeek = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/sleeps/${userId}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                const currentDate = moment();
                const startOfWeek = currentDate.clone().startOf('week');
                const endOfWeek = currentDate.clone().endOf('week');

                // Lọc dữ liệu giấc ngủ trong tuần hiện tại
                const sleepsThisWeek = data.filter((sleepRecord) => {
                    const sleepDate = moment(sleepRecord.date);
                    return sleepDate.isBetween(startOfWeek, endOfWeek, null, '[]');
                });

                // Tính tổng số giờ và phút ngủ trong tuần
                const totalSleepTimeThisWeek = sleepsThisWeek.reduce((total, sleepRecord) => {
                    const bedTime = moment(sleepRecord.bedTime, 'HH:mm');
                    const wakeUpTime = moment(sleepRecord.wakeUp, 'HH:mm');

                    // Nếu giờ thức dậy trước giờ đi ngủ (ví dụ: ngủ qua đêm), cộng thêm 1 ngày
                    let sleepDuration = wakeUpTime.diff(bedTime, 'minutes'); // Tính theo phút

                    // Nếu giấc ngủ qua đêm (thức dậy hôm sau), kiểm tra thêm trường hợp chênh lệch giờ qua ngày
                    if (sleepDuration < 0) {
                        sleepDuration += 24 * 60; // Cộng thêm 24 giờ nếu thức dậy sau khi đi ngủ, chuyển thành phút
                    }

                    // Cộng dồn tổng số phút ngủ
                    return total + sleepDuration;
                }, 0);

                // Tính số giờ và phút từ tổng số phút
                const hours = Math.floor(totalSleepTimeThisWeek / 60); // Chia cho 60 để lấy số giờ
                const minutes = totalSleepTimeThisWeek % 60; // Số phút còn lại
                setSleepWeek(`${hours}h ${minutes} min`);
                console.log(`Tổng số giờ ngủ trong tuần: ${hours} giờ ${minutes} phút`);
            } else {
                console.error("Dữ liệu trả về không đúng định dạng mảng:", data);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
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

            // Kiểm tra xem data có chứa mảng 'steps' hay không
            if (Array.isArray(data.steps)) {
                const currentDate = moment();
                const startOfWeek = currentDate.clone().startOf('week');
                const endOfWeek = currentDate.clone().endOf('week');

                // Lọc dữ liệu theo tuần
                const stepsThisWeek = data.steps.filter((stepRecord) => {
                    const stepDate = moment(stepRecord.date);
                    return stepDate.isBetween(startOfWeek, endOfWeek, null, '[]');
                });

                const totalStepsThisWeek = stepsThisWeek.reduce((total, stepRecord) => total + stepRecord.steps, 0);
                setStepWeek(totalStepsThisWeek);
                console.log(`Tổng số bước trong tuần: ${totalStepsThisWeek}`);
            } else {
                console.error("Dữ liệu trả về không có mảng 'steps':", data);
            }

        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const fetchNutritionsWeek = async (userId) => {
        try {
            const today = new Date();
            // Lấy ngày đầu tuần (Chủ Nhật) và cuối tuần (Thứ Bảy)
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Chủ nhật
            const endOfWeek = new Date(today.setDate(today.getDate() + 6)); // Thứ bảy

            // Chuyển ngày đầu tuần và cuối tuần thành định dạng YYYY-MM-DD
            const startDate = startOfWeek.toISOString().split('T')[0];
            const endDate = endOfWeek.toISOString().split('T')[0];

            console.log("Tuần này từ: ", startDate, " đến: ", endDate);

            // Lấy tất cả dữ liệu dinh dưỡng của user từ API
            const response = await fetch(`http://localhost:3000/api/nutritions/${userId}`);
            const data = await response.json();
            console.log("Dữ liệu từ API:", data);

            // Kiểm tra nếu dữ liệu trả về hợp lệ
            if (data.nutrition && Array.isArray(data.nutrition) && data.nutrition.length > 0) {
                // Lọc các bản ghi dinh dưỡng trong tuần này
                const nutritionThisWeek = data.nutrition.filter(meal => {
                    const mealDate = moment(meal.date); // Giả sử meal.date là kiểu YYYY-MM-DD
                    return mealDate.isBetween(startDate, endDate, 'day', '[]'); // Kiểm tra xem bữa ăn có nằm trong tuần này không
                });

                // Tính tổng dinh dưỡng từ các bữa ăn trong tuần
                const totalNutrition = nutritionThisWeek.reduce(
                    (totals, meal) => ({
                        protein: totals.protein + meal.protein,
                        carbs: totals.carbs + meal.carbs,
                        fats: totals.fats + meal.fats,
                    }),
                    { protein: 0, carbs: 0, fats: 0 } // Giá trị khởi tạo
                );

                // Cập nhật dữ liệu vào các state
                setProteinDataWeek(totalNutrition.protein);
                setCarbDataWeek(totalNutrition.carbs);
                setFatDataWeek(totalNutrition.fats);
            } else {
                console.log("Không có dữ liệu dinh dưỡng.");
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    // Tính tổng calo cho tuần
    const totalKcalWeek = fatDataWeek * 9 + proteinDataWeek * 4 + carbDataWeek * 4;


    const fetchNutritions = async (userId) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            console.log(today);
            const response = await fetch(`http://localhost:3000/api/nutritions/${userId}/${today}`);
            const data = await response.json();
            console.log("Dữ liệu từ API:", data);

            if (Array.isArray(data) && data.length > 0) {
                // Tính tổng dinh dưỡng từ tất cả các bữa ăn
                const totalNutrition = data.reduce(
                    (totals, meal) => ({
                        protein: totals.protein + meal.protein,
                        carbs: totals.carbs + meal.carbs,
                        fats: totals.fats + meal.fats,
                    }),
                    { protein: 0, carbs: 0, fats: 0 } // Giá trị khởi tạo
                );
                setProteinData(totalNutrition.protein);
                setCarbData(totalNutrition.carbs);
                setFatData(totalNutrition.fats);
            } else {
                console.log("Không có dữ liệu dinh dưỡng");
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const totalKcal = fatData * 9 + proteinData * 4 + carbData * 4;
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


    return (
        <View style={{ flex: 1, backgroundColor: '#fafafb', justifyContent: 'space-between', }}>

            <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>Hi</Text>
                        <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: 'bold' }}>{currentUserName}</Text>
                        <FontAwesome6 name="hand-peace" size={20} color="black" />
                    </View>
                    <View>
                        <Text style={{ fontStyle: 'italic' }}>Wish you a very active day!</Text>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('MyAbout') }}>
                        {/* Nền trang trí */}
                        <View style={styles.avatarContainer}>
                            {/* Avatar */}
                            <Image
                                style={styles.avatarImage}
                                source={
                                    avatar
                                        ? { uri: avatar }
                                        : gender === 'male'
                                            ? require('../assets/data/male.png')
                                            : require('../assets/data/female.png')
                                }
                            />
                            {/* Badge trạng thái */}
                            <View style={styles.statusBadge} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ height: 900, flex: 1 }}>
                <View style={{ marginVertical: 20, marginHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="sunny-sharp" size={24} color="black" />
                    <Text style={{ marginLeft: 10, }}>{currentDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'center' }}>
                    <View style={{ width: '75%' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Overview</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '25%', alignItems: 'flex-end', borderWidth: 1, borderRadius: 15, borderColor: '#4bcfe0', paddingVertical: 10, paddingHorizontal: 5, justifyContent: 'center' }}
                        onPress={() => { navigation.navigate('AllData') }}>
                        <Entypo name="tools" size={20} color="#4bcfe0" />

                        <Text style={{ marginLeft: 5, color: '#4bcfe0', fontWeight: 'bold',fontSize:18 }}>Tools</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginVertical: 10, marginHorizontal: 15, flexDirection: 'row', backgroundColor: '#ebfdff', borderRadius: 10, }}>
                    <View style={{ width: '70%', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Health Score</Text>
                        <Text style={{ color: '#7c8689' }}>Based on your overview</Text>
                        <Text style={{ color: '#7c8689' }}>health tracking, your score is</Text>
                        <Text style={{ color: '#7c8689' }}>100 and good...</Text>
                        {/* <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: '#35cbdf', fontWeight: 'bold' }}>Tell me more</Text>
                            <Entypo name="controller-play" size={18} color="#35cbdf" />
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ width: '30%', }}>
                        <View style={{ borderBottomLeftRadius: 30, borderBottomEndRadius: 30, backgroundColor: '#8353e2', width: '70%', paddingVertical: 30, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>100</Text></View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Highlights</Text>
                    </View>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#28c5d3', paddingVertical: 15 }}
                        onPress={() => { navigation.navigate('StepTracker') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="run" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Workout</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{steps} steps</Text>
                            <Text style={{ color: 'white', }}>today</Text>
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
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{sleepData}</Text>
                            <Text style={{ color: 'white', }}>today</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '48%', borderRadius: 30, backgroundColor: '#cc5f12', paddingVertical: 15 }}
                        onPress={() => { navigation.navigate('NutritionTracker') }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="food-variant" size={60} color="white" />
                        </View>
                        <View style={{ marginHorizontal: 10, gap: 5, paddingVertical: 15 }}>
                            <Text style={{ color: 'white', }}>Nutrition</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{totalKcal} kcal</Text>
                            <Text style={{ color: 'white', }}>today</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>This week report</Text>
                    </View>
                    {/* <TouchableOpacity style={{ width: '40%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
                        <Entypo name="controller-play" size={18} color="#a4a7ad" />
                    </TouchableOpacity> */}
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="footsteps" size={24} color="red" />
                            <Text>Walk</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{stepWeek} steps</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="arm-flex-outline" size={24} color="black" />
                            <Text>Loaded</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{totalKcalWeek} kcal</Text>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 15, flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                    {/* <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="water" size={24} color="#00bcf2" />
                            <Text>Water</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>10,689 ml</Text>

                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={{ paddingHorizontal: 10, width: '48%', borderRadius: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#f5f5f6', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="sleep" size={24} color="black" />
                            <Text>Sleep</Text>
                        </View>
                        <View style={{ marginHorizontal: 5, gap: 5, paddingVertical: 15 }}>

                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{sleepWeek}</Text>

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
const styles = StyleSheet.create({
    avatarContainer: {
        height: 80,
        width: 80,
        borderRadius: 40, // Hình tròn
        backgroundColor: '#e0f7fa', // Màu nền trang trí (nhạt)
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Đổ bóng
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Bóng trên Android
    },
    avatarImage: {
        height: 70,
        width: 70,
        borderRadius: 35, // Bo tròn ảnh
        borderWidth: 2, // Viền
        borderColor: '#00796b', // Màu viền (xanh đậm)
    },
    statusBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 15,
        width: 15,
        borderRadius: 7.5,
        backgroundColor: '#4caf50', // Màu xanh lá (online)
        borderWidth: 2,
        borderColor: '#fff', // Viền trắng xung quanh badge
    },
});

export default Home;
