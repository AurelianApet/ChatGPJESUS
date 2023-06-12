import { Chat, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { useState, useContext, useEffect } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Modal, TouchableHighlight } from 'react-native';
import uuid from 'react-native-uuid';
import { AppContext } from '../../AppContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { Ionicons, AntDesign, Feather} from '@expo/vector-icons';
import { Configuration, OpenAIApi } from 'openai';
import { loadDataFromStorage, saveDataToStorage } from './utill';

import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

const { width, height } = Dimensions.get('window');

const SelectCategory = ({navigation}) => {
    const {userName, openAIkey} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState("me")
    const [isAnswer, setIsAnswer] = useState(false)
    const [firstAnswer, setFirstAnswer] = useState("First")
    const [userQuestion, setUserQuestion] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(null)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const configuration = new Configuration({
      apiKey: openAIkey,
    });

    const openai = new OpenAIApi(configuration);

    const addMessage = (message) => {
      setMessages([message, ...messages])
    }

    const addDoubleMessage = (messageOne, messageTwo) => {
      setMessages([messageOne, messageTwo, ...messages])
    }

    const handleSendPress = async (message) => {
      if(firstAnswer === "First") {
        const messageTwo = {
          author: userId === "gpt" ? gpt : me,
          createdAt: Date.now(),
          id: uuid.v1(),
          text: message.text,
          type: 'text',
          messageType: "online",
          // status: "seen",
          isSent: true,
          isReceived: true
        }
        const messageOne = {
          author: gpt,
          createdAt: Date.now(),
          id: uuid.v1(),
          text: `Please tell me more...`,
          type: 'text',
          messageType: "online",
          isSent: true,
          isReceived: true
        }
        addDoubleMessage(messageOne, messageTwo)
        setFirstAnswer("Second")
        setIsAnswer(true)
      } else {
        const textMessage = {
          author: me,
          createdAt: Date.now(),
          id: uuid.v1(),
          text: message.text,
          type: 'text',
          messageType: "online",
          isSent: true,
          isReceived: true,
          // status: "seen",
        }
        addMessage(textMessage)
        setIsAnswer(true);
        setUserQuestion(message.text)
      }
    }

    const onSelectCategory = (category) => {
      const textMessage = {
        author: me,
        createdAt: Date.now(),
        id: uuid.v1(),
        text: `I am feeling ${category}`,
        type: 'text',
        messageType: "online",
        isSent: true,
        isReceived: true,
        status: "seen"
      }
      addMessage(textMessage)
      setUserQuestion(`I am feeling ${category}`)
      setFirstAnswer("Third")
      setIsAnswer(true)
    }

    const handleNaviate = (router) => {
      navigation.navigate(router)
    }

    const loadLastestData = async () => {
      let chatHistory = await loadDataFromStorage("threeCategory");
      setMessages(chatHistory)
    }

    useEffect(() => {
      (
        async () => {
          if(isAnswer && firstAnswer === "Third") {
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
              addMessage(textMessagefromGPT)
              setIsAnswer(false)
            } catch (error) {
              setError("It seems that your OpenAI key was expired")
              setModalVisible(true)
            }
          } else if(!isAnswer && firstAnswer === "Third") {
            await saveDataToStorage("threeCategory", messages)
          }
        }
      )();
    }, [isAnswer, firstAnswer])

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
      await saveDataToStorage("threeCategory", updatedMessages)
    }

    const onReadMessage = async (selectedMessage) => {

    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/SelectCategory.png')} style={styles.image}>
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
                showUserAvatars={true}
                showUserNames={true}
                theme={{
                  ...defaultTheme,
                  colors: { ...defaultTheme.colors, inputBackground: '#4d4d4d', background: 'transparent', PRIMARY: '#d9d9d9', inputText: '#d9d9d9' },
                  borders: { ...defaultTheme.borders, inputBorderRadius: 30 },
                }}
                customDateHeaderText={customBottomComponent}
                customBottomComponent={isAnswer ? customBottomComponent : false}
                customHeaderChatComponent={() => customHeaderComponent(userName)}
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
              {
                firstAnswer === "Second" && <>
                  <Text style={styles.bottomTitle}>Feelings of:</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      activeOpacity={0.5}
                      style={styles.circleButton}
                      onPress={() => onSelectCategory("anger")}
                      >
                        <Text style={styles.buttonTitle}>anger</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      activeOpacity={0.5}
                      style={styles.circleButton}
                      onPress={() => onSelectCategory("fear")}
                      >
                        <Text style={styles.buttonTitle}>fear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      activeOpacity={0.5}
                      style={styles.circleButton}
                      onPress={() => onSelectCategory("jealousy")}
                      >
                        <Text style={styles.buttonTitle}>jealousy</Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
            {/* </View> */}
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
  <>
  </>
)

const customHeaderComponent = (userName) => (
  <>
    <Text style={styles.helloTitle}>{`Hello`}</Text>
    <Text style={styles.name}>{userName}</Text>
    <Text style={styles.text}>{`What is bothering you, \n My Blessed child?`}</Text>
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
      fontSize: 28,
      fontWeight: '100',
      fontFamily: 'JosefinSans_300Light_Italic',
      textAlign: 'left',
      marginLeft: 30,
      textTransform: 'uppercase',
      marginTop: 140
    },
    helloTitle: {
      fontFamily: 'Le_Jour_Serif',
      fontSize: 80,
      textAlign: "center",
      textTransform: 'uppercase',
      color: "#9b9089",
      marginBottom: -40,
      marginTop: 140
    },
    bottomTitle: {
      color: '#3c2819',
      fontSize: 18,
      paddingLeft: 30,
      fontWeight: "bold",
      marginBottom: 5
    },
    buttonTitle: {
      color: '#3c2819',
      fontWeight: 'bold',
      fontSize: 18
    },
    circleButton: {
      alignItems:'center',
      justifyContent:'center',
      width: width / 4 - 10,
      height: width / 4 - 10,
      backgroundColor:'#ba9e87',
      borderRadius: width / 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      justifyContent: 'space-evenly',
      width: width,
      marginBottom: 10
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

export default SelectCategory