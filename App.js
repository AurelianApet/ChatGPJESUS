import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { AppContext } from './AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-url-polyfill/auto';
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
import { MenuProvider } from 'react-native-popup-menu';

import MainPage from './src/page/MainPage';
import NameEnterPage from './src/page/NameEnterPage';
import SelectCategory from './src/page/SelectCatagory';
import MoreCategoryPage from './src/page/MoreCategoryPage';
import DetailCategoryPage from './src/page/DetailCategory';
import FAQPage from './src/page/FAQPage';
import APIKeyEnterPage from './src/page/APIKeyEnterPage';
import { loadOpenAIKey } from './src/page/utill';

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

  const [initialRouter, setInitialRouter] = useState("APIKeyEnter")
  const [userName, setUserName] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAIkey, setOpenAIkey] = useState(null);

  useEffect(() => {
    (async () => {
      let AIkey = await loadOpenAIKey();
      if(AIkey) {
        setOpenAIkey(AIkey)
        setInitialRouter("nameEnter")
      }
      setLoading(false)
    })()
  }, [])

  if (!fontsLoaded || loading) {
    return null;
  } else {
    return (
      <MenuProvider>
        <SafeAreaView style={{flex: 1}}>
          <AppContext.Provider value={{userName, setUserName, currentTopic, setCurrentTopic, openAIkey, setOpenAIkey}} >
            <NavigationContainer>
              <Stack.Navigator initialRouteName={initialRouter} screenOptions={{headerShown: false, unmountOnBlur: true}}>
                <Stack.Screen
                  name="main"
                  component={MainPage}
                  options={{}}
                />
                <Stack.Screen
                  name="selectCategory"
                  component={SelectCategory}
                  options={{unmountOnBlur: true}}
                />
                <Stack.Screen
                  name="nameEnter"
                  component={NameEnterPage}
                  options={{unmountOnBlur: true}}
                />
                <Stack.Screen
                  name="moreCategory"
                  component={MoreCategoryPage}
                  options={{unmountOnBlur: true}}
                />
                <Stack.Screen
                  name="detailCategory"
                  component={DetailCategoryPage}
                  options={{unmountOnBlur: true}}
                />
                <Stack.Screen
                  name="FAQ"
                  component={FAQPage}
                  options={{}}
                />
                <Stack.Screen
                  name="APIKeyEnter"
                  component={APIKeyEnterPage}
                  options={{unmountOnBlur: true}}
                />

              </Stack.Navigator>
            </NavigationContainer>
          </AppContext.Provider>
        </SafeAreaView>
      </MenuProvider>
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
