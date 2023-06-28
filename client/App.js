import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from "react-redux";
import store from "./redux/store";
import { useFonts } from 'expo-font'
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

export default function App() {
  const [fontsLoaded] = useFonts({
    "NotoSansThai-Regular": require('./assets/font/NotoSansThai/NotoSansThai-Regular.ttf'),
    "NotoSansThai-Bold": require('./assets/font/NotoSansThai/NotoSansThai-SemiBold.ttf'),
  })
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
       <Toast />
      <AppNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
