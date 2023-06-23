import { useEffect, useState } from 'react';
import "./global";
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext } from './AppContext';
import { MenuProvider } from 'react-native-popup-menu';
import LeJourSerif from "./assets/LeJourSerif.ttf";
import LibreBaskerville from "./assets/LibreBaskerville.ttf";
import {
  useFonts,
  JosefinSans_300Light_Italic
} from '@expo-google-fonts/josefin-sans';
import { AlexBrush_400Regular } from '@expo-google-fonts/alex-brush';

import MainPage from './src/page/MainPage';
import NameEnterPage from './src/page/NameEnterPage';
import SelectCategory from './src/page/SelectCatagory';
import MoreCategoryPage from './src/page/MoreCategoryPage';
import DetailCategoryPage from './src/page/DetailCategory';
import FAQPage from './src/page/FAQPage';
import APIKeyEnterPage from './src/page/APIKeyEnterPage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRouter, setInitialRouter] = useState("nameEnter")
  const [userName, setUserName] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [openAIkey, setOpenAIkey] = useState("");
  const [AIkeyUsingCount, setAIkeyUsingCount] = useState(0);

  let [loaded] = useFonts({
    JosefinSans_300Light_Italic,
    AlexBrush_400Regular,
    Le_Jour_Serif: LeJourSerif,
    LibreBaskerville
  });

  if (!loaded) {
    return ;
  }
  return (
    <MenuProvider>
      <SafeAreaView style={{flex: 1}}>
        <AppContext.Provider value={{userName, setUserName, currentTopic, setCurrentTopic, openAIkey, setOpenAIkey, AIkeyUsingCount, setAIkeyUsingCount}} >
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

