import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
const BMIScreen = ({ navigation }) => {
  const [height, setHeight] = useState(''); // Chiều cao (cm)
  const [weight, setWeight] = useState(''); // Cân nặng (kg)
  const [bmi, setBmi] = useState(null); // Giá trị BMI
  const [bmiCategory, setBmiCategory] = useState(''); // Phân loại BMI
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái Modal

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // Chuyển đổi cm sang mét
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      setBmi(null);
      setBmiCategory('');
      setModalVisible(true); // Hiển thị modal khi nhập không hợp lệ
      return;
    }

    const bmiValue = (w / (h * h)).toFixed(2); // Công thức tính BMI
    setBmi(bmiValue);

    // Phân loại BMI
    let category = '';
    if (bmiValue < 18.5) category = 'UnderWeight';
    else if (bmiValue >= 18.5 && bmiValue < 24.9) category = 'Normal';
    else if (bmiValue >= 25 && bmiValue < 29.9) category = 'Overweight';
    else category = 'Obesity';

    setBmiCategory(category);
    setModalVisible(true); 
    setHeight('')
    setWeight('')
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ justifyContent: 'center', width: '30%' }}
          onPress={() => { navigation.goBack(); }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ width: '70%' }}>
          <Text style={styles.title}>BMI Calculator</Text>
        </View>


      </View>
      <View style={{ marginTop: 30 }}>


        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ width: '20%', fontSize: 18 }}>Height:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>
        <View style={{ marginVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ width: '20%', fontSize: 18 }}>Weight:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your wieght (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

        </View>
      </View>
      <TouchableOpacity style={styles.button}
        onPress={calculateBMI}>
        <Entypo name="calculator" size={24} color="white" />
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      {/* Modal thông báo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {bmi ? (
              <>
                <Text style={styles.modalTitle}>Result</Text>
                <Text style={styles.modalText}>BMI = {bmi}</Text>
                <Text style={styles.modalText}>Phân loại: {bmiCategory}</Text>
              </>
            ) : (
              <Text style={styles.modalText}>Please enter valid value!</Text>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fafafb'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default BMIScreen;
