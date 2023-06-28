import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StatusScreen from '../screens/StatusScreen';
import ProcessScreen from '../screens/ProcessScreen';
import SuccessScreen from '../screens/SuccessScreen';
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator()
const TopTab = () => {
  return (
    <>
         <Tab.Navigator
                initialRouteName="start"
                tabBarPosition='top'
                screenOptions={{
                    // tabBarScrollEnabled:'true',
                    animationEnabled: 'true',
                    tabBarActiveTintColor: '#e91e63',
                    tabBarLabelStyle: { fontSize: 14, color: 'black', fontFamily: "NotoSansThai-Bold" },
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF', shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.16,
                        shadowRadius: 4.65,

                        elevation: 6,
                        width: '100%',
                    },
                }} >
                <Tab.Screen
                    name="imagefirst"
                    component={StatusScreen}
                    options={{ tabBarLabel: 'ยังไม่ได้ดำเนินการ' }}
                />
                <Tab.Screen
                    name="sectionTwo"
                    component={ProcessScreen}
                    options={{ tabBarLabel: 'กำลังดำเนินการ' }}
                />
                <Tab.Screen
                    name="sectionThree"
                    component={SuccessScreen}
                    options={{ tabBarLabel: 'ดำเนินการเสร็จสิ้น' }}
                />


            </Tab.Navigator>
    </>
  )
}

export default TopTab