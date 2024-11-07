import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const Laugh = ({navigation}) => {
    return (
        <ScrollView style={{  backgroundColor: '#00bdd6' }}>
            <Image style={{borderBottomRightRadius:70, width: '100%', }} source={require('../assets/data/laugh.png')} />
            <TouchableOpacity>
                <Image style={{ marginLeft: 30 }} source={require('../assets/data/topIcon.png')} />
            </TouchableOpacity>
            <View style={{width:'70%',marginLeft: 30,marginVertical:20}}>
                <Text style={{fontSize:30,color:'white',fontWeight:'bold'}}>
                    Let's start your health journey today with us!
                </Text>
            </View>
            <TouchableOpacity style={{backgroundColor:'white',borderRadius:20,marginHorizontal:30,paddingVertical:10,alignItems:'center'}}
            onPress={()=>navigation.navigate('Login')}>
                <Text style={{fontSize:20}}>Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Laugh