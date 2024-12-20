import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import moment from 'moment';
const CycleTrackingScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [cycleData, setCycleData] = useState([]);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      getUserData(); // Gọi lại hàm lấy dữ liệu khi màn hình được focus
      const today = new Date();
      setSelectedDay(today.getDate().toString().padStart(2, '0')); // Cập nhật ngày hôm nay
      if (cycleData.length > 0) {
        calculateDaysUntilNextPeriod(); // Cập nhật ngày đến chu kỳ tiếp theo
      }
    }, [cycleData]) // Mỗi khi cycleData thay đổi thì tính lại ngày
  );

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

      // Đảm bảo data là mảng
      setCycleData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setCycleData([]); // Gán cycleData thành mảng rỗng khi có lỗi
    }
  };


  const calculateDaysUntilNextPeriod = () => {
    if (cycleData.length > 0) {
      const lastCycle = cycleData[cycleData.length - 1]; // Lấy chu kỳ gần nhất
      const lastEndDate = moment(lastCycle.endDate, 'YYYY-MM-DD');
      const nextCycleStartDate = lastEndDate.add(lastCycle.cycleLength, 'days');
      const diffDays = nextCycleStartDate.diff(moment(currentDate), 'days');
      setDaysUntilNextPeriod(diffDays);
    } else {
      setDaysUntilNextPeriod(0); // Không có dữ liệu chu kỳ, gán giá trị là null
    }
  };


  const generateCalendar = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      days.push(date.getDate().toString().padStart(2, '0'));
    }
    return days;
  };

  const days = generateCalendar();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ width: '30%', justifyContent: 'center' }}
          onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cycle tracking</Text>
        </View>
        {/* <View style={{ width: '20%' }}>
          <TouchableOpacity style={{ justifyContent: 'center', paddingVertical: 5, backgroundColor: '#00bdd6', alignItems: 'center', flexDirection: 'row', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7' }}
            onPress={() => navigation.navigate('InforCycle')}>
            <MaterialIcons name="my-library-add" size={18} color="white" />
            <Text style={{ color: 'white', marginLeft: 5 }}>New</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.dateContainer}>

        <View style={styles.weekRow}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        <View style={styles.dayRow}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDay
              ]}
            >
              <Text style={selectedDay === day ? styles.selectedDayText : styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hình tròn ở giữa */}
      <View style={styles.circleContainer}>
        <Text style={styles.periodText}>Period in</Text>
        <Text style={styles.daysText}>{daysUntilNextPeriod}</Text>
        <Text style={styles.chanceText}>Low chance of getting pregnant</Text>
        <TouchableOpacity style={styles.editButton}
          onPress={() => navigation.navigate('InforCycle')}>
          <Text style={styles.editButtonText}>Edit period dates</Text>
        </TouchableOpacity>

      </View>


      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>How are you feel today?</Text>
      </View>
      <View style={{ gap: 10, flexDirection: 'row', marginVertical: 10, marginHorizontal: 10, }}>
        <TouchableOpacity style={{ width: '50%', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7', paddingVertical: 10 }}>
          <View style={{ backgroundColor: '#c8f9ff', padding: 10, marginVertical: 10, borderRadius: 50, }}>
            <MaterialCommunityIcons name="puzzle-plus-outline" size={24} color="#006d7c" />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>Share your</Text>
            <Text style={{ fontSize: 13 }}> systoms with us</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '50%', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7', paddingVertical: 10 }}>
          <View style={{ backgroundColor: '#f5f2fd', padding: 10, marginVertical: 10, borderRadius: 50, }}>
            <Ionicons name="pie-chart-outline" size={24} color="#895ce3" />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>Here's your daily</Text>
            <Text style={{ fontSize: 13 }}>insights</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Menstrual health</Text>
        </View>
        <TouchableOpacity style={{ width: '50%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 2, color: '#a4a7ad' }}>View more</Text>
          <Entypo name="controller-play" size={18} color="#a4a7ad" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ paddingBottom: 20, marginVertical: 10, marginHorizontal: 10, borderRadius: 30, borderWidth: 2, borderColor: '#f6f6f7' }}>
        <View>
          <Image style={{ width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30 }} source={require('../assets/data/mentrusual.png')} />
        </View>
        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Craving sweets on your period? Here's why & what to do about it</Text>
        </View>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  dateContainer: {
    marginVertical: 20

  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  weekDay: {
    fontSize: 16,
    color: '#999',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  circleContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00bdd6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  periodText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold'
  },
  daysText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  chanceText: {
    fontSize: 10,
    color: '#fff',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#a3a4a6',
    fontWeight: 'bold',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  dayButton: {
    padding: 10,
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#00bdd6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00bdd6',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
});
export default CycleTrackingScreen;