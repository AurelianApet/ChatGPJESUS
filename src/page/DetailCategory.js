import { Chat, defaultTheme, Message } from '@flyerhq/react-native-chat-ui'
import { useState, useContext, useEffect } from 'react'
import { ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image} from 'react-native';
import uuid from 'react-native-uuid';
import { AppContext } from '../../AppContext';
import { Configuration, OpenAIApi } from 'openai';
import { ScrollView } from 'react-native-virtualized-view';
import gpt_Avatar from '../../assets/cross.png';
import me_Avatar from '../../assets/me.png';
import { Questions } from './Questions';

const gptAvatar = Image.resolveAssetSource(gpt_Avatar).uri;
const meAvatar = Image.resolveAssetSource(me_Avatar).uri;

// const OPENAI_API_KEY = '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'
// const OPENAI_API_KEY = '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'
const OPENAI_API_KEY = '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'

const { width, height } = Dimensions.get('window');

const DetailCategoryPage = ({navigation}) => {
    const {userName, currentTopic, setCurrentTopic} = useContext(AppContext)
    const [messages, setMessages] = useState([])
    const [userQuestion, setUserQuestion] = useState(null)
    const [userId, setUserId] = useState("me")
    const [isGPT, setIsGPT] = useState(false)
    const gpt = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', imageUrl: gptAvatar}
    const me = { id: '06c33e8b-e835-4736-80f4-63f44b66666d', imageUrl: meAvatar }

    const addMessage = async (message) => {
      console.log("message",messages)
      let total = [message, ...messages]
      setMessages(total)
        // setMessages([...messages, message])
        // console.log("total", messages)
    }

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const handleSendPress = async (message) => {
        const textMessage = {
          // author: userId === "gpt" ? gpt : me,
          author: me,
          createdAt: Date.now(),
          id: uuid.v1(),
          text: message.text,
          type: 'text',
          // messageType: "online",
          // isSent: true,
          // isReceived: true
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
                // model: "text-davinci-002",
                model: 'text-davinci-003',
                temperature: 0,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                stop: ['/'],
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
              setIsGPT(false)
              throw(error)
            }
          }
        }
      )();

    }, [isGPT])

    const onSelectCategory = (category) => {
      setCurrentTopic(category)
    }

    const onSelectOtherCategory = () => {
      navigation.navigate('moreCategory')
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require('../../assets/DetailCategory.png')} style={styles.image}>
            {/* <ScrollView> */}
              <View style={styles.chatContainer}>
                <Text style={styles.helloTitle}>{`Hello`}</Text>
                <Text style={styles.name}>{userName}</Text>
                {/* <Text style={styles.text}>{`What is bothering you, \n My Blessed child?`}</Text> */}
                <Text style={styles.text}>{Questions[currentTopic]}</Text>
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
                />
              </View>
              {/* </ScrollView> */}
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
      fontSize: 100,
      color: "#3c2819",
      // fontWeight: 'light',
      // fontStyle: "italic",
      fontFamily: 'AlexBrush_400Regular',
      alignSelf: "center",
      // position: "absolute",
      // bottom: height / 100 * 48,
    },
    text: {
      fontSize: 22,
      fontWeight: '100',
      fontFamily: 'JosefinSans_300Light_Italic',
      textAlign: 'left',
      marginLeft: 30,
      // position: "absolute",
      // bottom: height / 100 * 28,
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
    }
  });

export default DetailCategoryPage