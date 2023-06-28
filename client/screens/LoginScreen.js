import React from "react";
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
	ActivityIndicator
} from "react-native";
import { Formik } from "formik";
import * as yup from 'yup';
import { useDispatch } from 'react-redux'
import { loginUser } from "../redux/authReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';

const formSchema = yup.object({
	email: yup.string().required("กรุณาใส่ชื่อผู้ใช้").min(5,"กรุณาใส่ชื่อผู้ใช้งานเกิน 5 ตัว"),
	password: yup.string().required("กรุณาใส่รหัสผ่าน").min(6,"กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัว")
})

const LoginScreen = navData => {
	const dispatch = useDispatch()
	const test = async () => {
		const token = await AsyncStorage.getItem('token')
		if (!token) {
			navData.navigation.navigate('Login')
		} else {
			navData.navigation.navigate('Home')
		}
	}
	test()
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}>
			<Formik
				initialValues={{
					email: "",
					password: "",
				}}
				validationSchema={formSchema}
				onSubmit={(values) => {
				
					dispatch(loginUser(values))
						.then(async result => {
							if (result.payload.success) {
								try {
									await AsyncStorage.setItem('token', result.payload.token)
									navData.navigation.replace('Home')
								} catch (error) {
									console.log(error)
								}
							} else {
								alert(result.payload.message)
							}


						})

				}}
			>
				{(props) => (
					<View style={styles.container}>
						{/* <ActivityIndicator size="large" /> */}
						<Image source={require('../assets/logo.png')} style={styles.image} />
						<View style={{
							marginVertical: 10,
							height: 2,
							width: '100%',
							backgroundColor: 'grey'
						}}></View>
						<View style={styles.logo}>
							<Text style={{
								fontFamily: "NotoSansThai-Bold",
								fontSize: 30
							}}>ระบบแจ้งซ่อมออนไลน์</Text>
							<Text style={{
								fontFamily: "NotoSansThai-Regular",
								fontSize: 20,
								color: 'grey'
							}}>วิทยาลัยการคอมพิวเตอร์</Text>
						</View>
						<View>
							<TextInput
								style={styles.input}
								placeholder="อีเมล"
								placeholderTextColor="grey"
								onChangeText={props.handleChange("email")}
								value={props.values.email}
								onBlur={props.handleBlur('email')}

							/>
							<Text style={styles.error}>{props.touched.email && props.errors.email}</Text>
							<TextInput
								style={styles.input}
								placeholder="รหัสผ่าน"
								placeholderTextColor="grey"
								secureTextEntry={true}
								onChangeText={props.handleChange("password")}
								value={props.values.password}
								onBlur={props.handleBlur('password')}
							/>
							<Text style={styles.error}>{props.touched.password && props.errors.password}</Text>
							<TouchableOpacity
								style={styles.button}
								onPress={props.handleSubmit}
							>
								<Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
							</TouchableOpacity>
							<View style={styles.registerContainer}>
								<Text style={styles.registerText}>ยังไม่ได้เป็นสมาชิก ? </Text>
								<TouchableOpacity
									onPress={() => navData.navigation.navigate('Register')}
								>
									<Text style={styles.registerButton}>สมัครสมาชิก</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			</Formik>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#ffffff",
		paddingHorizontal: '10%'
	},
	logo: {

		marginBottom: 20,
	},
	image: {
		width: '100%',
		height: 120,
	},
	input: {
		width: '100%',
		backgroundColor: "#ffffff",
		borderRadius: 10,
		padding: 16,
		fontSize: 16,
		marginVertical: 10,
		fontFamily: "NotoSansThai-Regular",
		shadowColor: "#000",
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
		fontFamily: "NotoSansThai-Regular",
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
		color: 'red',
		fontFamily: "NotoSansThai-Regular",
	}
});

export default LoginScreen;
