import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialIcons from "@expo/vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import RequestScreen from '../screens/RequestScreen';
import CustomDrewer from './CustomDrewer';
import StatusScreen from '../screens/StatusScreen';
import TopTab from './TopTab';
import EditScreen from '../screens/EditScreen';
const Stack = createNativeStackNavigator()
const Drewer = createDrawerNavigator();

const HeaderLeft = () => {
    const navigation = useNavigation();
    return (
        <MaterialIcons
            name="menu"
            size={30}
            onPress={() => {
                navigation.openDrawer();
            }}
        />
    );
};
const BackLeft = () => {
    const navigation = useNavigation();
    return (
        <MaterialIcons name="arrow-back" size={30} color="black"
            onPress={() => {
                navigation.goBack();
            }} />
    );
};
function Hambuger() {
    return (

        <Drewer.Navigator drawerContent={props => <CustomDrewer {...props} />}>
            <Drewer.Screen
                name="Main"
                component={DrewerNavigatior}
                options={{
                    headerShown: false,
                    title: "หน้าหลัก",
                    drawerLabelStyle: {
                        fontFamily: "NotoSansThai-Bold",
                    },
                    drawerIcon: ({ color }) => (
                        <AntDesign name="home" size={24} color={color} />
                    )
                }}

            />
            <Drewer.Screen
                name="about"
                component={DrewerNavigatior}
                options={{
                    headerShown: false,
                    title: "ติดต่อเจ้าหน้าที่",
                    drawerLabelStyle: {
                        fontFamily: "NotoSansThai-Bold",
                    },
                    drawerIcon: ({ color }) => (
                        <AntDesign name="contacts" size={24} color={color} />
                    )
                }}

            />
            {/* <Drewer.Screen
                name="About"
                component={DrewerNavigatior}
                options={{ headerShown: false }}
            /> */}
        </Drewer.Navigator>

    )
}

function DrewerNavigatior() {
    return (


        <Stack.Navigator>
            <Stack.Screen
                name="Homepage"
                component={HomeScreen}
                options={{
                    title: "หน้าหลัก",
                    headerTitleStyle: {
                        fontFamily: "NotoSansThai-Bold",
                    },
                    headerLeft: () => <HeaderLeft />,

                }}
            />
            <Stack.Screen
                name="Request"
                component={RequestScreen}
                options={{
                    title: "แจ้งซ่อม",
                    headerTitleStyle: {
                        fontFamily: "NotoSansThai-Bold",
                    },
                    headerLeft: () => <BackLeft />,

                }}
            />
            <Stack.Screen
                name="Status"
                component={StatusScreen}
                options={{
                    title: "ดูสถานะการซ่อม",
                    headerTitleStyle: {
                        fontFamily: "NotoSansThai-Bold",
                    },
                    headerLeft: () => <BackLeft />,

                }}
            />
            <Stack.Screen
                name="Edit"
                component={EditScreen}
                options={{
                    title: "แก้ไขคำร้องแจ่งซ่อม",
                    headerTitleStyle: {
                        fontFamily: "NotoSansThai-Bold",
                    },
                    headerLeft: () => <BackLeft />,

                }}
            />
                     <Stack.Screen
                    name="Top"
                    component={TopTab}
                    options={{
                        headerLeft: () => <BackLeft />, title: "ดูสถานะการซ่อม", headerTitleStyle: {
                            fontFamily: "NotoSansThai-Bold",
                        },
                    }}
                />
       
        </Stack.Navigator>

    )
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Hambuger}
                    options={{ headerShown: false, headerLeft: () => <HeaderLeft /> }}
                />
            

            </Stack.Navigator>
        </NavigationContainer>
    );
}



export default AppNavigator

const styles = StyleSheet.create({})