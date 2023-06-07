import { Chat, defaultTheme, Message } from '@flyerhq/react-native-chat-ui'
import { useState, useContext } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import uuid from 'react-native-uuid';
import { AppContext } from '../../AppContext';

import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

const { width, height } = Dimensions.get('window');

const SelectCategory = ({navigation}) => {
    const {userName, currentTopic, setCurrentTopic} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState("me")
    const [isAnswer, setIsAnswer] = useState(false)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const addMessage = (message) => {
        setMessages([message, ...messages])
    }

    const handleSendPress = (message) => {
        if(isAnswer) return;
        const textMessage = {
          author: userId === "gpt" ? gpt : me,
          createdAt: Date.now(),
          id: uuid.v1(),
          text: message.text,
          type: 'text',
          messageType: "online",
          isSent: true,
          isReceived: true
        }
        addMessage(textMessage)
        setIsAnswer(true)
    }

    const onSelectCategory = (category) => {
      setCurrentTopic(category)
    }

    const onSelectOtherCategory = () => {
      navigation.navigate('moreCategory')
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require('../../assets/SelectCategory.png')} style={styles.image}>
            <View style={styles.chatContainer}>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.text}>{`What is bothering you, \n My Blessed child?`}</Text>
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
              />
              {
                isAnswer && <>
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
                    <TouchableOpacity 
                      activeOpacity={0.5}
                      style={styles.circleButton}
                      onPress={onSelectOtherCategory}
                      >
                        <Text style={styles.buttonTitle}>+</Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
            </View>
            </ImageBackground>
        </View>
    )
}

const customBottomComponent = () => (
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
      // paddingBottom: 40
    },
    name: {
      fontSize: 60,
      color: "#3c2819",
      // fontWeight: 'light',
      // fontStyle: "italic",
      fontFamily: 'AlexBrush_400Regular',
      alignSelf: "center",
      position: "absolute",
      bottom: height / 100 * 48,
    },
    text: {
      fontSize: 28,
      fontWeight: '100',
      fontFamily: 'JosefinSans_300Light_Italic',
      textAlign: 'left',
      marginLeft: 30,
      // position: "absolute",
      // bottom: height / 100 * 28,
      marginBottom: -20,
      textTransform: 'uppercase'
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
    }
  });

export default SelectCategory