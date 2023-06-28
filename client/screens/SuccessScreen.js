import { ActivityIndicator, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserRequestSuccess, getUserRequestProcess } from '../redux/authReducer'
import { useNavigation } from '@react-navigation/native'


const RenderItem = (props) => {
    let Color = {
        name: "",
        color: "",
        font: ""
    }
    const dateObj = new Date(props.time).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

    if (props.status == 3) {
        Color.color = "#AACB73",
            Color.name = "เสร็จสิ้น"
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
            backgroundColor: "#FFFFFF"
        }}>


            <TouchableOpacity onPress={() => {

            }}>
                <View style={{ width: '100%', height: 200, marginBottom: 20, backgroundColor: '#B9D7EA' }}>
                    <Image source={{ uri: "http://localhost:3000/images/" + props.images }}
                        style={{ flex: 1, width: undefined, height: undefined, resizeMode: 'contain', }} />
                </View>
                <Text style={styles.font}>
                    รายการซ่อม : {props.equName} {props.buildingname} ห้อง {props.roomName}
                </Text>
                <Text style={styles.font}>
                    รายงานหลังซ่อม : {props.techreport}
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
                    </View>
                </Text>
                <Text style={styles.font}>เมื่อ : {dateObj}</Text>
            </TouchableOpacity>



        </View>
    )
}
const SuccessScreen = () => {
    const data = useSelector(state => state.data.data.data.userID)

    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [request, setRequest] = useState()
    const loadrequset = async () => {
        dispatch(getUserRequestSuccess(data))
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
                        console.log(item)
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
                                time={item.update_at}
                                techreport={item.techreport}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default SuccessScreen

const styles = StyleSheet.create({
    font: {
        fontSize: 14,
        fontFamily: "NotoSansThai-Regular",
        marginBottom: 10
    }
})