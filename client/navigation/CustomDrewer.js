import { StyleSheet, Text, View,Image ,TouchableOpacity,RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../redux/authReducer';
import { useDispatch } from 'react-redux';
const CustomDrewer = (props) => {
    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const dispatch = useDispatch();
    useEffect(()=>{
        (async()=>{
            const token = await AsyncStorage.getItem('token')
            const decoded = jwt_decode(token)
          
            await dispatch(getUser(decoded._id))
            .then((result)=>{
                if(result.payload.success){
            
                    setName(result.payload.data.fullname)
                    setEmail(result.payload.data.email)
                }else{
                    alert("มีปัญหา")
                }
            })
   
        })()
    },[])
    const logout = async () =>{
        await AsyncStorage.removeItem("token")
        .then(()=>{
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        })
        .catch((err)=>{
          console.log(err)
        })
      }
    
    return (
        <View style={{
            flex: 1
        }}>

            <DrawerContentScrollView {...props}>
                <View style={styles.box}>
                    <Image source={require('../assets/logo.png')} style={styles.image} />

                </View>
                <View style={{
                    paddingHorizontal:'5%',
                    marginVertical:20
                }}>
                    <Text style={{
                        fontSize:14,
                        fontFamily: "NotoSansThai-Bold",
                    }}>สวัสดีคุณ</Text>
                    <Text style={{
                        fontSize:14,
                        fontFamily: "NotoSansThai-Regular",
                    }}>{name}{'\n'}{email}</Text>
                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={{padding:20,paddingBottom:50,borderTopWidth:1,borderTopColor:"#CCCC"}}>
                <TouchableOpacity onPress={()=>{
                    logout()
                }}>
                    <Text style={{         
                        fontSize:14,
                        fontFamily: "NotoSansThai-Regular",
                        color:'red'}}>ออกจากระบบ</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrewer

const styles = StyleSheet.create({
    image:{
        width:'80%',
        height:100
    },
    box:{
        justifyContent:'center',
        alignItems:'center'
    }
})