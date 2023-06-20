import { Chat, MessageType } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'
import * as Crypto from 'expo-crypto';

const MainPage = () => {
    const [messages, setMessages] = useState([])
    const [uid, setUid] = useState(0)
    const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' }

    const addMessage = (message) => {
        setMessages([message, ...messages])
    }

    const handleSendPress = (message) => {
        const textMessage = {
          author: user,
          createdAt: Date.now(),
          id: Crypto.randomUUID(),
          text: message.text,
          type: 'text',
        }
        addMessage(textMessage)
    }

    return (
        <Chat 
            messages={messages}
            onSendPress={handleSendPress}
            user={user}
        />
    )
}

export default MainPage