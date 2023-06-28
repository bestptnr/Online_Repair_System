import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getAllRequest } from '../redux/authReducer';

const RequestItem = (props) => {
  let Color = {
    name: "",
    color: "",
    font: ""
  }
  if (props.status == 1) {
    Color.color = "#FD8A8A",
      Color.name = "รอดำเนินการ"
    Color.font = "#FFFFFF"
  }
  if (props.status == 2) {
    Color.color = "#F7C04A",
      Color.name = "กำลังดำเนินการ"
    Color.font = "#F5F5F5"
  }
  if (props.status == 3) {
    Color.color = "#AACB73",
      Color.name = "เสร็จสิ้น"
    Color.font = "#F5F5F5"
  }
  return (
    <TouchableOpacity style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      backgroundColor: "#FFFFFF",
      padding: '3%',
      borderRadius: 5,
      marginHorizontal: 2
    }}>
      <Text style={[styles.font, { width: '25%' }]}>
        {props.username}
      </Text>
      <Text style={[styles.font]}>
        {props.name}{'\n'}{props.room} {props.building}
      </Text>
      <View style={{
        backgroundColor: Color.color,
        width: '25%',

        borderRadius: 5
      }}>
        <Text style={{
          fontFamily: "NotoSansThai-Regular",
          fontSize: 14,
          color: Color.font,
          paddingHorizontal: 2,
          textAlign: 'center'
        }}>
          {Color.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const HomeScreen = props => {
  const [isLoading, setLoading] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [request, setRequest] = useState()
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadrequset()
      setRefreshing(false);
    }, 2000);
  }, []);
  const loadrequset =async () =>{
  
    dispatch(getAllRequest())
    .then((result) => {
      if (result.payload.success) {
        setRequest(result.payload.data)
      } else {
        alert("เกิดปัญหาแจ้งเจ้าหน้าที่ที่ดูแลระบบติดต่อ 061-32434234")

      }
      setLoading(true)
    })
  }
  useEffect(() => {
    (async () => {
      loadrequset()
    })()
  }, [])

  if (!isLoading) {
    return <ActivityIndicator></ActivityIndicator>
  }



  return (
    <View style={styles.container}>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={{
          width:'100%',
          marginTop:30
        }}>
          <Image source={require('../assets/banner.jpeg')} style={{height:150,width:'100%',resizeMode: 'contain',}} />
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: "space-between"
        }}>
          
          <View style={styles.box}>
            <TouchableOpacity style={styles.request}
              onPress={() => {
                navigation.navigate('Request')
                console.log("TSET")
              }}>
              <Text style={{
                fontFamily: "NotoSansThai-Regular",
                fontSize: 16,
                color: "#FFFFFF"
              }}
              >
                แจ้งซ่อม
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity style={styles.request} onPress={()=>{
              navigation.navigate("Top")
            }}>
              <Text style={{
                fontFamily: "NotoSansThai-Regular",
                fontSize: 16,
                color: "#FFFFFF"

              }}>
                ตรวจสอบสถานะการซ่อม
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          marginVertical: 20,
          paddingBottom:20
        }}>
          <Text style={{
            fontFamily: "NotoSansThai-Bold",
            fontSize: 16,
          }}>
            แจ้งซ่อมล่าสุด
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',

            padding: '3%'
          }}>
            <Text style={styles.font}>
              ชื่อผู้แจ้ง
            </Text>
            <Text style={[styles.font, {}]}>
              รายการซ่อม
            </Text>
            <Text style={[styles.font, { width: '25%', textAlign: 'right' }]}>
              สถานะ
            </Text>
          </View>
          {request.map((item) => {

            return <RequestItem
              key={item.reqID}
              name={item.equName}
              room={item.roomName}
              building={item.buildingname}
              username={item.fullname}
              status={item.status}
            />
          })}


        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingHorizontal: '5%'
  },
  request: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  box: {
    backgroundColor: '#0476BE',
    width: '46%',
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 10,


  },
  font: {
    fontFamily: "NotoSansThai-Regular",
    fontSize: 14,
    width: '37.5%',

  }
})