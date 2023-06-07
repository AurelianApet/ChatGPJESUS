import { Chat, defaultTheme, Message } from '@flyerhq/react-native-chat-ui'
import { useState, useContext } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import uuid from 'react-native-uuid';
import { AppContext } from '../../AppContext';

import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

const { width, height } = Dimensions.get('window');

const NameEnterPage = ({navigation}) => {
    const {setUserName} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState("me")
    const [isName, setIsName] = useState(false)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const addMessage = (message) => {
        setMessages([message, ...messages])
    }

    const handleSendPress = (message) => {
        if(isName) return;
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
        setIsName(true)
        setUserName(message.text)
        setTimeout(() => {
          navigation.navigate('selectCategory')
        }, 1000)
        
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require('../../assets/NameEnterBackground.png')} style={styles.image}>
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
    text: {
      // color: 'white',
      fontSize: 28,
      fontWeight: '100',
      fontFamily: 'JosefinSans_300Light_Italic',
      textAlign: 'left',
      marginLeft: 40,
      position: "absolute",
      bottom: height / 100 * 17,
      textTransform: 'uppercase'
    },
    chatContainer: {
      position: "absolute",
      backgroundColor: "transparent",
      width: "100%",
      bottom: 0
    }
  });

export default NameEnterPage