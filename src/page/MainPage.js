import { Chat, MessageType } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'
import uuid from 'react-native-uuid';

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
          id: uuid.v1(),
          text: message.text,
          type: 'text',
        }
        addMessage(textMessage)
        // setUid(uid + 1)
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