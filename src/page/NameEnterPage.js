import { Chat, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { useState, useContext } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Crypto from 'expo-crypto';
import { AppContext } from '../../AppContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { Ionicons, AntDesign, Feather} from '@expo/vector-icons';

import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';
import axios from 'axios';
import { loadApiUsingCount, loadMonth, Max_Api_Count, saveApiUsingCount, saveMonth } from './utill';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

const { width, height } = Dimensions.get('window');

const NameEnterPage = ({navigation}) => {
    const {setUserName, setAIkeyUsingCount} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState("me")
    const [isName, setIsName] = useState(false)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const addMessage = (message) => {
        setMessages([message, ...messages])
    }

    const handleSendPress = async (message) => {
        if(isName) return;
        const textMessage = {
          author: userId === "gpt" ? gpt : me,
          createdAt: Date.now(),
          id: Crypto.randomUUID(),
          text: message.text,
          type: 'text',
          messageType: "online",
          isSent: true,
          isReceived: true,
          isClicked: false
        }
        addMessage(textMessage)
        setIsName(true)
        setUserName(message.text)
        let responseForTime = await axios.get(`https://www.google.com`)
        let onlineMonth = new Date(responseForTime.headers.date).getMonth() + 1;
        let savedMonth = await loadMonth();
        if(onlineMonth !== savedMonth) {
          await saveMonth(onlineMonth);
          await saveApiUsingCount(Max_Api_Count)
          setAIkeyUsingCount(Max_Api_Count)
        } else {
          let usingApiCount = await loadApiUsingCount();
          setAIkeyUsingCount(usingApiCount)
        }
        setTimeout(() => {
          navigation.navigate('selectCategory')
        }, 500)
    }

    const handleNaviate = (router) => {
      navigation.navigate(router)
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require('../../assets/NameEnterBackground.png')} style={styles.image}>
            <Menu style={styles.dropMenu}>
              <MenuTrigger
                  customStyles={{
                      triggerWrapper: {
                          top: -40,
                          left: -10
                      },
                  }}
              >
                  <Ionicons name="reorder-three" size={50} color="#ba9e87" />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => handleNaviate("FAQ")} customStyles={{
                  optionWrapper: {
                    padding: 10
                  },
                }} >
                  <Text style={styles.optionText}>FAQ</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleNaviate("AboutUs")} customStyles={{
                  optionWrapper: {
                    padding: 10
                  },
                }} >
                  <Text style={styles.optionText}>About Us</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
            <View style={styles.chatContainer}>
              <Text style={styles.text}>What is your Name?</Text>
              <Chat
                enableAnimation={true} 
                messages={messages}
                onSendPress={handleSendPress}
                user={me}
                showUserAvatars={true}
                showUserNames={true}
                theme={{
                  ...defaultTheme,
                  colors: { ...defaultTheme.colors, inputBackground: '#4d4d4d', background: 'transparent', PRIMARY: '#d9d9d9', inputText: '#d9d9d9' },
                  borders: { ...defaultTheme.borders, inputBorderRadius: 30 },
                }}
                customDateHeaderText={customBottomComponent}
                customBottomComponent={isName ? customBottomComponent : false}
                onMessageLongPress={(prop) => {
                }}
                buttonGroupComponent={() => <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.navBarLeftButton}>
                  <AntDesign name="copy1" size={24} color="black" />
                  <Text style={styles.buttonText}>
                    Copy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarLeftButton}>
                  <Feather name="share" size={24} color="black" />
                  <Text style={styles.buttonText}>
                    Share
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarLeftButton}>
                  <AntDesign name="delete" size={24} color="black" />
                  <Text style={styles.buttonText}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarLeftButton}>
                  <AntDesign name="sound" size={24} color="black" />
                  <Text style={styles.buttonText}>
                    Read
                  </Text>
                </TouchableOpacity>
                </View>}
              />
              { isName && <><Text></Text><Text></Text><Text></Text></> }
            </View>
            </ImageBackground>
        </View>
    )
}

const customBottomComponent = () => (
  <></>
)

const customHeaderComponent = (userName) => (
  <>
    <Text style={styles.text}>{`What is your Name?`}</Text>
  </>
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    text: {
      fontSize: width / 100 * 6,
      fontWeight: '100',
      fontFamily: 'JosefinSans_300Light_Italic',
      textAlign: 'left',
      marginLeft: width / 100 * 6,
      position: "absolute",
      bottom: height / 100 * 18,
      textTransform: 'uppercase'
    },
    chatContainer: {
      position: "absolute",
      backgroundColor: "transparent",
      width: "100%",
      bottom: 0
    },
    dropMenu: {
      position: "absolute",
      top: 30,
      left: 10
    },
    optionText: {
      fontSize: 18,
      color: '#9d8673'
    },
    buttonGroup : {
      flexDirection: "row",
      borderTopWidth: 2,
      borderColor: "#9d8673",
      paddingTop: 2
    },
    navBarLeftButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginHorizontal: 2
    },
    buttonText: {
      paddingLeft: 2,
      textAlignVertical: "center",
    }
  });

export default NameEnterPage