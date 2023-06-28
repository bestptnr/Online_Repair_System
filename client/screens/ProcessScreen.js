import { ActivityIndicator, StyleSheet, Text, View, Image, ScrollView,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserRequest, getUserRequestProcess } from '../redux/authReducer'
import { useNavigation } from '@react-navigation/native'


const RenderItem = (props) => {
    let Color = {
        name: "",
        color: "",
        font: ""
    }
    if (props.status == 2) {
        Color.color = "#F7C04A",
        Color.name = "กำลังดำเนินการ"
        Color.font = "#FFFFFF"
    }
    const navigation = useNavigation()
    
    return (

        <View style={{
            marginVertical: 30,
            borderWidth: 0.3,
            padding: 20,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
    
            elevation: 4,
            backgroundColor:"#FFFFFF"
        }}>
           

            <TouchableOpacity onPress={()=>{
                navigation.navigate("Edit",{
                    props
                })
            }}>
                <View style={{ width: '100%', height: 200, marginBottom: 20 ,backgroundColor:'#B9D7EA'}}>
                    <Image source={{ uri: "http://localhost:3000/images/" + props.images }}
                        style={{ flex: 1, width: undefined, height: undefined, resizeMode: 'contain', }} />
                </View>
                <Text style={styles.font}>
                    รายการซ่อม : {props.equName} {props.buildingname} ห้อง {props.roomName}
                </Text>
                <Text style={styles.font}>
                    รายละเอียด : {props.description}
                </Text>
                <Text style={styles.font}>
                    ผู้รับผิดชอบ : {
                       props.techName
                    }</Text>
                <Text style={styles.font}>
                    ติดต่อผู้รับผิดชอบ : email : {props.techemail}{'\n'}tel : {props.techtel}</Text>
                    <Text style={styles.font}>สถานะ :
                    <View style={{
                        backgroundColor: Color.color,
                        width: '30%',

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
                    </View></Text></TouchableOpacity>
    
               

        </View>
    )
}
const ProcessScreen = () => {
    const data = useSelector(state => state.data.data.data.userID)

    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [request, setRequest] = useState()
    const loadrequset = async () => {
        dispatch(getUserRequestProcess(data))
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
        loadrequset()
    }, [])
    if (!isLoading) {
        return (
            <ActivityIndicator />
        )
    }
    return (
        <View style={{
            backgroundColor: 'white',
            height: '100%'
        }}>
            <ScrollView>

                <View style={{
                    paddingHorizontal: '5%',
                    marginTop: '5%'
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: "NotoSansThai-Bold",
                    }}>คำขอแจ้งซ่อมของคุณ</Text>
                    {request.map((item) => {
                   
                        return (
                            <RenderItem
                                key={item.reqID}
                                buildingname={item.buildingname}
                                description={item.description}
                                equName={item.equName}
                                images={item.images}
                                reqID={item.reqID}
                                roomName={item.roomName}
                                status={item.status}
                                techName={item.techname}
                                techemail={item.techemail}
                                techtel={item.techtel}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default ProcessScreen

const styles = StyleSheet.create({
    font: {
        fontSize: 14,
        fontFamily: "NotoSansThai-Regular",
        marginBottom: 10
    }
})