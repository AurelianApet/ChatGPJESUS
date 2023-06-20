import { Chat, defaultTheme, Message } from '@flyerhq/react-native-chat-ui'
import { useState, useContext } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, Image, Modal, TouchableHighlight } from 'react-native';
import * as Crypto from 'expo-crypto';
import { AppContext } from '../../AppContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { Ionicons } from '@expo/vector-icons';

import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';
import { saveOpenAIKey } from './utill';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

const { width, height } = Dimensions.get('window');

const APIKeyEnterPage = ({navigation}) => {
    const {setOpenAIkey} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState("me")
    const [isName, setIsName] = useState(false)
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ error, setError ] = useState(null)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const addMessage = (message) => {
        setMessages([message, ...messages])
    }

    const handleSendPress = async (message) => {
        if(isName) return;
        let apiKey = message.text.trim()
        if(apiKey.length === 51 && apiKey.slice(0,3) === "sk-") {
          const textMessage = {
            author: userId === "gpt" ? gpt : me,
            createdAt: Date.now(),
            id: Crypto.randomUUID(),
            text: apiKey,
            type: 'text',
            messageType: "online",
            isSent: true,
            isReceived: true
          }
          addMessage(textMessage)
          setIsName(true)
          await saveOpenAIKey(apiKey)
          setOpenAIkey(apiKey)
          setTimeout(() => {
            navigation.navigate('selectCategory')
          }, 500)
        } else {
          setError("Invalid OpenAI Key")
          setModalVisible(true)
        }

    }

    const handleNaviate = (router) => {
      navigation.navigate(router)
    }

    const onErrorOk = async () => {
      setModalVisible(!modalVisible)
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
              <Text style={styles.text}>Input Your OpenAI Key</Text>

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
                customHeaderChatComponent={() => customHeaderComponent()}
                isOpenAIInput={`Type your OpenAI key here...`}
              />
              { isName && <><Text></Text><Text></Text></> }
            </View>
            </ImageBackground>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Image
                        source={require('../../assets/cross.png')}
                        style={styles.walletIconStyle}
                  />
                  <Text style={styles.walletBigText}>{error}</Text>
                  <TouchableHighlight
                    style={styles.changePinBtn}
                    onPress={onErrorOk}
                    underlayColor='#fff'>
                      <Text style={styles.registerBtnText}>{`OK`}</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
        </View>
    )
}

const customBottomComponent = () => (
  <></>
)

const customHeaderComponent = () => (
  <></>
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
      marginLeft: width / 100 * 4,
      position: "absolute",
      bottom: height / 100 * 17,
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
    /////////////////////
    walletIconStyle: {
      height: 45,
      width: 35,
      resizeMode: 'stretch',
    },
    walletBigText: {
      marginTop: 10,
      textAlign: 'center',
      fontSize: 22
    },
    changePinBtn: {
      marginTop: 25,
      backgroundColor: "#9d8673",
      width: "90%",
      padding:10,
      borderRadius: 15
    },
    registerBtnText: {
      color: 'black',
      textAlign: 'center',
      fontSize: 20,
      opacity: 0.7
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "70%"
    },
  });

export default APIKeyEnterPage