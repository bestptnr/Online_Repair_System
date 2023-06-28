import { ActivityIndicator, StyleSheet, Text, View, Image, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserRequest, deleleReq } from '../redux/authReducer'
import { useNavigation } from '@react-navigation/native'
import { Entypo, AntDesign } from '@expo/vector-icons';


const RenderItem = (props) => {
    let Color = {
        name: "",
        color: "",
        font: ""
    }
    if (props.status == 1) {
        Color.color = "red",
            Color.name = "รอดำเนินการ"
        Color.font = "#FFFFFF"
    }
    const navigation = useNavigation()
    const dispatch = useDispatch()
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


            <View>

                <View style={{ width: '100%', height: 200, marginBottom: 20, backgroundColor: '#B9D7EA' }}>
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
                        "ยังไม่มีผู้รับผิดชอบ"
                    }</Text>
                <Text style={styles.font}>
                    ติดต่อผู้รับผิดชอบ : {
                        "ยังไม่มีผู้รับผิดชอบ"
                    }</Text>
                <Text style={styles.font}>สถานะ :
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
                </Text>
                <View style={{
                    flexDirection:'row'
                }}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    backgroundColor: 'red',
                    width: '15%',
                    paddingHorizontal: 5,
                    borderRadius: 5,

                }}
                    onPress={() => {
                        Alert.alert(`ลบคำขอร้องแจ้งซ่อมที่ ${props.reqID} `, 'คุณแน่ใจที่จะลบหรือไม่', [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {
                                text: 'OK', onPress: async () => {
                                    await dispatch(deleleReq(props.reqID))
                                        .then((result) => {
                                            if (result.payload.success) {
                                                Alert.alert("ลบสำเร็จ")

                                            } else {
                                                Alert.alert("ลบไม่สำเร็จ")
                                            }
                                        })
                                }
                            },
                        ]);
                    }}
                >
                    <Entypo name="trash" size={24} color="white" />
                    <Text style={{ fontFamily: "NotoSansThai-Bold", color: 'white' }}>ลบ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    backgroundColor: 'yellow',
                    width: '20%',
                    paddingHorizontal: 5,
                    borderRadius: 5,
                    marginLeft:10
                }}
                onPress={()=>{
                    navigation.navigate('Edit',props.item)
                }}>
                    <AntDesign name="edit" size={24} color="black" />
                    <Text style={{ fontFamily: "NotoSansThai-Bold", color: 'black' }}>แก้ไข</Text>
                </TouchableOpacity>
                </View>
            </View>



        </View>
    )
}
const StatusScreen = () => {
    const data = useSelector(state => state.data.data.data.userID)

    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [request, setRequest] = useState()
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            loadrequset()
            setRefreshing(false)
        }, 2000);
    }, []);
    const loadrequset = async () => {
        dispatch(getUserRequest(data))
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
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

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
                                item={item}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default StatusScreen

const styles = StyleSheet.create({
    font: {
        fontSize: 14,
        fontFamily: "NotoSansThai-Regular",
        marginBottom: 10
    }
})