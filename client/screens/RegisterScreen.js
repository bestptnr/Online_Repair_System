import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,

} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from 'react-redux'
import { registerUser } from "../redux/authReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';

import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from "react-native-safe-area-context";


const formSchema = yup.object({
    fullName: yup.string().required("กรุณาใส่ชื่อ"),
    email: yup.string().email("กรุณาใส่ Email").required("กรุณาใส่ Email"),
    tel: yup.number().positive().required("กรุณาใส่เบรอร์โทร").min(10, "ใส่เบอร์ไม่ครบ 10 ตัว"),
    password: yup.string().required("กรุณาใส่รหัสผ่าน").min(6, "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัว"),
    passwordconfirm: yup.string().oneOf([yup.ref('password'), null], 'รหัสผ่านไม่ตรงกัน').required("กรุกณากรอกรหัสผ่าน")
});

const RegisterScreen = (navData) => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'นักศึกษา', value: 1 },
        { label: 'TA', value: 2 },
        { label: 'เจ้าหน้าที่', value: 3 },
        { label: 'อาจารย์', value: 4 },
    ]);




    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <Formik
                initialValues={{
                    email: "",
                    tel: "",
                    password: "",
                    passwordconfirm: "",

                }}
                validationSchema={formSchema}
                onSubmit={(values) => {
                    console.log(values);
                    dispatch(registerUser({ ...values, userTypeID: value }))
                        .then(async result => {

                            if (result.payload.success) {
                                try {
                                    await AsyncStorage.setItem('token', result.payload.token)
                                    navData.navigation.replace('Home')
                                } catch (error) {
                                    console.log(error)
                                }

                            } else {
                                alert("Register Failed Try Again")
                            }

                        })
                        .catch(err => console.log(err))

                }}
            >
                {(props) => (


                    <ScrollView nestedScrollEnabled={true}>


                        <View style={styles.container}>

                            <View style={styles.logo}>
                                <Text style={{
                                    fontFamily: "NotoSansThai-Bold",
                                    fontSize: 30
                                }}>สมัครสมาชิก</Text>
                                <Text style={{
                                    fontFamily: "NotoSansThai-Regular",
                                    fontSize: 20,
                                    color: 'grey'
                                }}>ระบบแจ้งซ่อมออนไลน์</Text>
                            </View>
                            <View>
                        
                                <TextInput
                                    style={styles.input}
                                    placeholder="ชื่อ-สกุล"
                                    placeholderTextColor="grey"
                                    onChangeText={props.handleChange("fullName")}
                                    value={props.values.fullName}
                                    onBlur={props.handleBlur("fullName")}
                                />
                                <Text style={styles.error}>
                                    {props.touched.fullName && props.errors.fullName}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="อีเมล"
                                    placeholderTextColor="grey"
                                    keyboardType="email-address"
                                    onChangeText={props.handleChange("email")}
                                    value={props.values.email}
                                    onBlur={props.handleBlur("email")}
                                />
                                <Text style={styles.error}>
                                    {props.touched.email && props.errors.email}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="เบอร์โทร"
                                    placeholderTextColor="grey"
                                    keyboardType="phone-pad"
                                    onChangeText={props.handleChange("tel")}
                                    value={props.values.tel}
                                    onBlur={props.handleBlur("tel")}
                                />
                                <Text style={styles.error}>
                                    {props.touched.tel && props.errors.tel}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="รหัสผ่าน"
                                    placeholderTextColor="grey"
                                    secureTextEntry={true}
                                    onChangeText={props.handleChange("password")}
                                    value={props.values.password}
                                    onBlur={props.handleBlur("password")}
                                />
                                <Text style={styles.error}>
                                    {props.touched.password && props.errors.password}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    placeholderTextColor="grey"
                                    secureTextEntry={true}
                                    onChangeText={props.handleChange("passwordconfirm")}
                                    value={props.values.passwordconfirm}
                                    onBlur={props.handleBlur("passwordconfirm")}
                                />
                                <Text style={styles.error}>
                                    {props.touched.passwordconfirm && props.errors.passwordconfirm}
                                </Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    style={[styles.input, {
                                        borderWidth: 0.4,

                                    }]}
                                    listMode="SCROLLVIEW"
                                    scrollViewProps={{
                                        nestedScrollEnabled: true,
                                    }}

                                    textStyle={{
                                        fontFamily: "NotoSansThai-Regular",
                                        fontSize: 16


                                    }}


                                    placeholder="เลือกรูปแบบสมาชิก"
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={props.handleSubmit}
                                >
                                    <Text style={styles.buttonText}>สมัครสมาชิก</Text>
                                </TouchableOpacity>
                                <View style={styles.registerContainer}>
                                    <Text style={styles.registerText}>เป็นสมาชิกอยู่แล้ว ?</Text>
                                    <TouchableOpacity
                                        onPress={() => navData.navigation.navigate("Login")}
                                    >
                                        <Text style={styles.registerButton}>เข้าสู่ระบบ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                )}
            </Formik>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    
    container: {
        // flex: 1,
        // justifyContent: "center",
        paddingTop: '20%',
        height: '130%',
        backgroundColor: "#ffffff",
        paddingHorizontal: '10%',
        paddingBottom: 100,
    },
    logo: {

        marginBottom: 40,
    },
    image: {
        width: 100,
        height: 100,
    },
    input: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 16,
        fontSize: 16,
        marginVertical: 10,
        fontFamily: "NotoSansThai-Regular",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
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
        fontFamily: "NotoSansThai-Bold",

    },
    registerContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingVertical: 16,
        flexDirection: "row",
    },
    registerText: {
        color: "#738289",
        fontSize: 16,
        fontFamily: "NotoSansThai-Regular",
    },
    registerButton: {
        color: "#738289",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "NotoSansThai-Bold",
    },
    error: {
        color: "red",
        fontFamily: "NotoSansThai-Regular",
    },
});

export default RegisterScreen;
