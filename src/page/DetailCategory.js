import { Chat, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { useState, useContext, useEffect } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Modal, TouchableHighlight} from 'react-native';
import uuid from 'react-native-uuid';
import { AppContext } from '../../AppContext';
import { Configuration, OpenAIApi } from 'openai';
import { Questions } from './Questions';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { Ionicons, AntDesign, Feather} from '@expo/vector-icons';
import { loadDataFromStorage, saveDataToStorage } from './utill';
import * as Clipboard from 'expo-clipboard';

import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

const { width, height } = Dimensions.get('window');

const DetailCategoryPage = ({navigation}) => {
    const {userName, currentTopic, openAIkey} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userQuestion, setUserQuestion] = useState(null)
    const [userId, setUserId] = useState("me")
    const [isGPT, setIsGPT] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(null)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const addMessage = async (message) => {
      let total = [message, ...messages]
      setMessages(total)
    }

    const configuration = new Configuration({
      apiKey: openAIkey,
    });

    const openai = new OpenAIApi(configuration);

    const handleSendPress = async (message) => {
        const textMessage = {
          author: me,
          createdAt: Date.now(),
          id: uuid.v1(),
          text: message.text,
          type: 'text',
          // status: "seen",
          isClicked: false,
          messageType: "online",
          isSent: true,
          isReceived: true
        }
        await addMessage(textMessage)
        setUserQuestion(message.text)
        setIsGPT(true)
    }

    useEffect(() => {
      (
        async () => {
          if(isGPT) {
            try {
              let prompt = `"${userQuestion}" of answer based on what is there taken from the bible`
              const completion = await openai.createCompletion({
                model: "text-davinci-002",
                // model: 'text-davinci-003',
                // temperature: 0,
                // max_tokens: 100,
                // top_p: 1,
                // frequency_penalty: 0.0,
                // presence_penalty: 0.0,
                // stop: ['/'],
                prompt: prompt,
              });

              let responseText = completion.data.choices[0].text;

              const textMessagefromGPT = {
                author: gpt,
                createdAt: Date.now(),
                id: uuid.v1(),
                text: `Let's see what the Bible teaches us about this.${responseText}`,
                type: 'text',
                messageType: "online",
                isSent: true,
                isReceived: true
              }
              await addMessage(textMessagefromGPT)
              setIsGPT(false)

            } catch (error) {
              setError("It seems that your OpenAI key was expired")
              setModalVisible(true)
            }
          } else if(!isGPT && messages.length >= 2) {
            await saveDataToStorage(currentTopic, messages)
          }
        }
      )();

    }, [isGPT])

    const handleNaviate = (router) => {
      navigation.navigate(router)
    }

    const loadLastestData = async () => {
      let chatHistory = await loadDataFromStorage(currentTopic);
      setMessages(chatHistory)
    }

    const onErrorOk = async () => {
      setModalVisible(!modalVisible)
      navigation.navigate('APIKeyEnter')
    }

    const onMessageClick = async (prop) => {
      let updatedMessages = messages.map((message) => {
        if(message.id === prop.id) return { ...message, isClicked: !prop.isClicked}
        else return { ...message, isClicked: false}
      })
      setMessages(updatedMessages)
    }

    const onCopyMessage = async (selectedMessage) => {
      await Clipboard.setStringAsync(selectedMessage.text);
    }

    const onShareMessage = async (selectedMessage) => {

    }

    const onDeleteMessage = async (selectedMessage) => {
      let updatedMessages = messages.filter((message) => message.id !== selectedMessage.id)
      setMessages(updatedMessages)
      await saveDataToStorage(currentTopic, updatedMessages)
    }

    const onReadMessage = async (selectedMessage) => {

    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require('../../assets/DetailCategory.png')} style={styles.image}>
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
                <MenuOption onSelect={() => handleNaviate("moreCategory") } customStyles={{
                  optionWrapper: {
                    padding: 10
                  },
                }} >
                  <Text style={styles.optionText}>Conversation</Text>
                </MenuOption>
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
                <MenuOption onSelect={() => loadLastestData()} customStyles={{
                  optionWrapper: {
                    padding: 10
                  },
                }} >
                  <Text style={styles.optionText}>Load Last Chat</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
              <Chat 
                enableAnimation={true} 
                messages={messages}
                onSendPress={handleSendPress}
                user={me}
                showA
                showUserAvatars={true}
                showUserNames={true}
                theme={{
                  ...defaultTheme,
                  colors: { ...defaultTheme.colors, inputBackground: '#4d4d4d', background: 'transparent', PRIMARY: '#d9d9d9', inputText: '#d9d9d9' },
                  borders: { ...defaultTheme.borders, inputBorderRadius: 30 },
                }}
                customDateHeaderText={customBottomComponent}
                customBottomComponent={isGPT ? customBottomComponent : false}
                customHeaderChatComponent={() => customHeaderComponent(userName, Questions[currentTopic])}
                onMessageLongPress={(prop) => onMessageClick(prop)}
                buttonGroupComponent={(selectedMessage) => 
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.navBarLeftButton} onPress={() => onCopyMessage(selectedMessage)}>
                      <AntDesign name="copy1" size={20} color="black" />
                      <Text style={styles.buttonText}>
                        Copy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBarLeftButton} onPress={() => onShareMessage(selectedMessage)}>
                      <Feather name="share" size={20} color="black" />
                      <Text style={styles.buttonText}>
                        Share
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBarLeftButton} onPress={() => onDeleteMessage(selectedMessage)}>
                      <AntDesign name="delete" size={20} color="black" />
                      <Text style={styles.buttonText}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navBarLeftButton} onPress={() => onReadMessage(selectedMessage)}>
                      <AntDesign name="sound" size={20} color="black" />
                      <Text style={styles.buttonText}>
                        Read
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
              />
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

const customHeaderComponent = (userName, topic) => (
  <>
    <Text style={styles.helloTitle}>{`Hello`}</Text>
    <Text style={styles.name}>{userName}</Text>
    <Text style={styles.text}>{topic}</Text>
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
    name: {
      fontSize: 100,
      color: "#3c2819",
      fontFamily: 'AlexBrush_400Regular',
      alignSelf: "center",
    },
    text: {
      fontSize: 22,
      fontWeight: '100',
      fontFamily: 'JosefinSans_300Light_Italic',
      textAlign: 'left',
      marginLeft: 30,
      marginBottom: -20,
      textTransform: 'uppercase'
    },
    helloTitle: {
      fontFamily: 'Le_Jour_Serif',
      fontSize: 80,
      textAlign: "center",
      textTransform: 'uppercase',
      color: "#9b9089",
      marginBottom: -40
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
      left: 10,
      zIndex: 10000
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
    buttonGroup : {
      flexDirection: "row",
      borderTopWidth: 2,
      borderColor: "#9d8673",
      paddingTop: 4
    },
    navBarLeftButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginHorizontal: 5
    },
    buttonText: {
      paddingLeft: 3,
      textAlignVertical: "center",
    }
  });

export default DetailCategoryPage