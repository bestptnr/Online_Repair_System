import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from 'react'
import { getDataFoForm } from "../redux/authReducer";
import { Formik } from "formik";
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from "react-redux";
import * as ImagePicker from 'expo-image-picker'
import mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useNavigation } from "@react-navigation/native";


const RequestScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [hasGalleryPermission, setHasGalleryPermission] = React.useState(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'นักศึกษา', value: 1 },
        { label: 'TA', value: 2 },
        { label: 'เจ้าหน้าที่', value: 3 },
        { label: 'อาจารย์', value: 4 },
    ]);
    const [photo,setPhoto] = useState()
    const [photoName,setPhotoName] =useState("ชื่อไฟล์")
    const [openRoom, setOpenRoom] = useState(false);
    const [selectedRoom, setSeletedRoom] = useState(null);
    const [roomItems, setRoomItems] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            dispatch(getDataFoForm())
                .then((result) => {
                    let arrayObj = []
                    result.payload.equ.forEach(element => {
               
                        const data = {
                            label: element.equName,
                            value: element.equID
                        }
                        arrayObj.push(data)
                    });
                    let arrRoom = []
                    result.payload.room.forEach(element => {
                 
                        const data = {
                            label: element.roomName + " " + element.buildingname,
                            value: element.roomID
                        }

                        arrRoom.push(data)
                    });
                    setItems(arrayObj)
                    setRoomItems(arrRoom)
                    setLoading(true)
                })
        })()
    }, [])

    React.useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })()
    }, [])


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,

        })
        if (!result.cancelled) {
            const newImageUri = "file:///" + result.uri.split("file:/").join("");
            const name = newImageUri.split("/").pop()
            const splitName = name.length >20 ? name.slice(0,20)+".......":name;
            setPhotoName(splitName)
            setPhoto(result)
        }

    }

    const upload = async () =>{
  
    }
    if (!loading) {
        return <ActivityIndicator />
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>
            <Formik
                initialValues={{
                    description: "",

                }}

                onSubmit={ async (values) => {
       
                    const token = await AsyncStorage.getItem('token')
                    const decoded = jwt_decode(token)
           
                    const id = decoded._id
                    const newImageUri = "file:///" + photo.uri.split("file:/").join("");
                    const dataimage = new FormData();
                    dataimage.append('photo', {
                        name: newImageUri.split("/").pop(),
                        type: mime.getType(newImageUri),
                        uri: newImageUri
                    });
                    dataimage.append('equID',value)
                    dataimage.append('roomID',selectedRoom)
                    dataimage.append('description',values.description)
                    dataimage.append('uesrID',id)
                    await fetch(`http://localhost:3000/api/user/request`, {
                        method: 'POST',
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                        body: dataimage,
                        headers :{
                            "auth-token":token
                        }
                    }).then((result)=>result.json())
                    .then((result)=>{
                        if(result.success){
                            Alert.alert('แจ้งซ่อมเสร็จ', 'โปรดติดตามสถานะการแจ้งซ่อมของคุณ', [
                          
                                {text: 'OK', onPress: () => navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Home' }],
                                  }) },
                              ]);
                        }
                    })


                }}
            >
                {(props) => (
                    <ScrollView style={{ backgroundColor: "#FFFFFF" }} nestedScrollEnabled={true}>
                        <View style={styles.container}>


                            <Text style={{
                                fontFamily: "NotoSansThai-Bold",
                                fontSize: 16,
                                marginVertical: 10,
                            }}>
                                อุปกรณ์ที่เสียหาย / หรืออื่น ๆ
                            </Text>

                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={[styles.dropdown, {
                                    borderWidth: 0.3,

                                }]}
                                zIndex={20}
                                listItemContainerStyle={{

                                }}
                                listMode="SCROLLVIEW"


                                textStyle={{
                                    fontFamily: "NotoSansThai-Regular",
                                    fontSize: 16


                                }}
                                placeholder="เลือก"
                            />
                            <Text style={{
                                fontFamily: "NotoSansThai-Bold",
                                fontSize: 16,
                                marginVertical: 10,
                            }}>
                                สถานที่พบ
                            </Text>

                            <DropDownPicker
                                zIndex={10}
                                open={openRoom}
                                value={selectedRoom}
                                items={roomItems}
                                setOpen={setOpenRoom}
                                setValue={setSeletedRoom}
                                setItems={setRoomItems}
                                style={[styles.dropdown, {
                                    borderWidth: 0.3,


                                }]}
                                listMode="SCROLLVIEW"
                                scrollViewProps={{
                                    nestedScrollEnabled: true,
                                }}

                                textStyle={{
                                    fontFamily: "NotoSansThai-Regular",
                                    fontSize: 16


                                }}
                                placeholder="เลือก"
                            />
                            <Text style={{
                                fontFamily: "NotoSansThai-Bold",
                                fontSize: 16,
                                marginVertical: 10,
                            }}>
                                รายละเอียด
                            </Text>


                            <TextInput
                                style={styles.input}
                                placeholderTextColor="grey"
                                multiline
                                onChangeText={props.handleChange("description")}
                                value={props.values.description}
                                onBlur={props.handleBlur('description')}

                            />
                            <Text style={styles.error}>{props.touched.description && props.errors.description}</Text>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity
                                    style={[{ backgroundColor: '#F9F8F9', borderWidth: 0.3, padding: 10, marginVertical: 10 }]}
                                    onPress={pickImage}
                                >

                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: "500",
                                        fontFamily: "NotoSansThai-Regular",

                                        textAlign: "left",
                                    }}>อัปโหลดรูป</Text>
                                </TouchableOpacity>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "500",
                                    fontFamily: "NotoSansThai-Regular",
                                    marginLeft: 20,
                                    color: 'grey'
                                }}>{photoName} </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={props.handleSubmit}
                            >
                                <Text style={styles.buttonText}>SUBMIT</Text>
                            </TouchableOpacity>

                        </View>



                    </ScrollView>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
}

export default RequestScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        height: '130%',
        paddingHorizontal: '5%',
        backgroundColor: "#ffffff",
    },
    logo: {

        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 120,
    },
    input: {
        height: 150,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 16,
        paddingTop: 16,
        fontSize: 16,

        fontFamily: "NotoSansThai-Regular",
        borderWidth: 0.3

    },
    dropdown: {
        marginVertical: 10,
    },
    button: {
        width: '100%',
        backgroundColor: "#0976BC",
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 13,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ffffff",
        textAlign: "center",
        fontFamily: "NotoSansThai-Regular",
    },

    error: {
        color: 'red',
        fontFamily: "NotoSansThai-Regular",
    }
})