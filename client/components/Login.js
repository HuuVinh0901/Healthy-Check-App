import { View, Text, ScrollView, TextInput } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { TouchableOpacity } from 'react-native';
const Login = () => {
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 100 }}>
        <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Welcome back</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
          <MaterialCommunityIcons name="hand-wave" size={40} color="black" />
        </View>
      </View>
      <View style={{ marginHorizontal: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email</Text>
        <View style={{ borderRadius: 10, color: '#f3f4f6', backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>
          <TextInput placeholder='Enter email'></TextInput>
        </View>
      </View>
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
        <View style={{ flexDirection: 'row', borderRadius: 10, color: '#f3f4f6', backgroundColor: '#f3f4f6', paddingHorizontal: 20, paddingVertical: 10, marginTop: 5 }}>


          <View style={{ width: '80%' }}>
            <TextInput placeholder='Enter password'></TextInput>
          </View>
          <View style={{ width: '20%', alignItems: 'flex-end' }}>
            <TouchableOpacity><Feather name="eye-off" size={24} color="black" /></TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginHorizontal: 15, alignItems: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity><Text style={{ color: '#41cee0', fontWeight: 'bold' }}>Forgot password?</Text></TouchableOpacity>

      </View>
      <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#41cee0', marginHorizontal: 15, marginVertical: 20, borderRadius: 10, paddingVertical: 10 }}>

        <Text style={{ color: 'white', fontSize: 20 }}>Sign in</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Text>OR LOG IN WITH</Text>
      </View>
      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
        <TouchableOpacity><AntDesign name="google" size={30} color="red" /></TouchableOpacity>
        <TouchableOpacity><Entypo name="facebook-with-circle" size={30} color="#1877f2" /></TouchableOpacity>
        <TouchableOpacity><AntDesign name="apple-o" size={30} color="black" /></TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 30 }}>
        <Text style={{ fontSize: 15 }}>Don't have an account?</Text>
        <TouchableOpacity><Text style={{ marginLeft: 5, fontSize: 15, color: '#41cee0', fontWeight: 'bold' }}>Sign up</Text></TouchableOpacity>
      </View>
    </ScrollView>


  )
}

export default Login