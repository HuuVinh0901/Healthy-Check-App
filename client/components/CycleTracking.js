import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import moment from 'moment';
const CycleTrackingScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [cycleData, setCycleData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);  // State để kiểm soát hiển thị modal
  const [startDate, setStartDate] = useState(''); // Trạng thái lưu trữ ngày bắt đầu
  const [endDate, setEndDate] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  useEffect(() => {
    getUserData();
    const today = new Date();
    setSelectedDay(today.getDate().toString().padStart(2, '0'));
  }, []);
  const handleDateChange = (text, type) => {
    const formattedDate = moment(text, 'DD/MM/YYYY', true).isValid()
      ? moment(text, 'DD/MM/YYYY').format('DD/MM/YYYY')
      : text;

    if (type === 'start') {
      if (!moment(formattedDate, 'DD/MM/YYYY', true).isValid()) {
        setStartDateError('Start date invalid format dd/MM/YYYY');
      } else {
        setStartDateError('');
        setStartDate(formattedDate); // Luôn cập nhật giá trị khi nhập đúng
      }
    } else {
      if (!moment(formattedDate, 'DD/MM/YYYY', true).isValid()) {
        setEndDateError('End date invalid format dd/MM/YYYY');
      } else if (moment(formattedDate).isBefore(moment(startDate, 'DD/MM/YYYY'))) {
        setEndDateError('End date not after start date');
      } else {
        setEndDateError('');
        setEndDate(formattedDate); // Cập nhật giá trị khi nhập đúng
      }
    }
  };
  const getUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        setUser(parsedUser);
        console.log("Data của step:" + parsedUser.id)
        fetchCycleData(parsedUser.id)
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };
  const fetchCycleData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cycle/${userId}`);
      const data = await response.json();
      setCycleData(data || []);
      console.log(data)
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
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
  const handleConfirmDate = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleSaveCycle = () => {
    // Xử lý lưu thông tin chu kỳ
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    // Sau khi lưu, đóng modal
    setIsModalVisible(false);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ width: '30%', justifyContent: 'center' }}
          onPress={() => { navigation.navigate('Home') }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cycle tracking</Text>
        </View>

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
        <Text style={styles.daysText}>12 days</Text>
        <Text style={styles.chanceText}>Low chance of getting pregnant</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
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
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Period Dates</Text>

            <Text>Start Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={startDate}  // giá trị luôn được cập nhật
              onChangeText={(text) => handleDateChange(text, 'start')}
              keyboardType="numeric"
            />
            {startDateError ? <Text style={styles.errorText}>{startDateError}</Text> : null}

            <Text>End Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={endDate}
              onChangeText={(text) => handleDateChange(text, 'end')}
              keyboardType="numeric"
            />
            {endDateError ? <Text style={styles.errorText}>{endDateError}</Text> : null}
            <Text>Start Date: {startDate}</Text>
            <Text>End Date: {endDate}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCycle}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
