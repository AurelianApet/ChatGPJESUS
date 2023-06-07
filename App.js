import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppContext } from './AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-url-polyfill/auto';
// import AppLoading from 'expo-app-loading';
import LeJourSerif from "./assets/LeJourSerif.ttf";
import LibreBaskerville from "./assets/LibreBaskerville.ttf";
import {
  useFonts,
  JosefinSans_100Thin,
  JosefinSans_200ExtraLight,
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
  JosefinSans_100Thin_Italic,
  JosefinSans_200ExtraLight_Italic,
  JosefinSans_300Light_Italic,
  JosefinSans_400Regular_Italic,
  JosefinSans_500Medium_Italic,
  JosefinSans_600SemiBold_Italic,
  JosefinSans_700Bold_Italic,
} from '@expo-google-fonts/josefin-sans';
import { AlexBrush_400Regular } from '@expo-google-fonts/alex-brush';

import MainPage from './src/page/MainPage';
import NameEnterPage from './src/page/NameEnterPage';
import SelectCategory from './src/page/SelectCatagory';
import MoreCategoryPage from './src/page/MoreCategoryPage';
import DetailCategoryPage from './src/page/DetailCategory';

const Stack = createNativeStackNavigator();

export default function App() {

  let [fontsLoaded] = useFonts({
    JosefinSans_100Thin,
    JosefinSans_200ExtraLight,
    JosefinSans_300Light,
    JosefinSans_400Regular,
    JosefinSans_500Medium,
    JosefinSans_600SemiBold,
    JosefinSans_700Bold,
    JosefinSans_100Thin_Italic,
    JosefinSans_200ExtraLight_Italic,
    JosefinSans_300Light_Italic,
    JosefinSans_400Regular_Italic,
    JosefinSans_500Medium_Italic,
    JosefinSans_600SemiBold_Italic,
    JosefinSans_700Bold_Italic,
    AlexBrush_400Regular,
    Le_Jour_Serif: LeJourSerif,
    LibreBaskerville
  });

  const [initialRouter, setInitialRouter] = useState("nameEnter")
  const [userName, setUserName] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <AppContext.Provider value={{userName, setUserName, currentTopic, setCurrentTopic}} >
          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouter} screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="main"
                component={MainPage}
                options={{}}
              />
              <Stack.Screen
                name="selectCategory"
                component={SelectCategory}
                options={{}}
              />
              <Stack.Screen
                name="nameEnter"
                component={NameEnterPage}
                options={{}}
              />
              <Stack.Screen
                name="moreCategory"
                component={MoreCategoryPage}
                options={{}}
              />
              <Stack.Screen
                name="detailCategory"
                component={DetailCategoryPage}
                options={{}}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </AppContext.Provider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
