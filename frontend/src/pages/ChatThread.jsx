import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { MessagesContext } from '../services/Messages';
import { UserContext } from '../services/User';
import { AIContext } from '../services/Rex';
import { ChatContainer, RootContainer } from '../styles/SharedStyles';
import NavBarComponent from '../components/NavBarComponent';

/**
 * This page component is responsible for displaying a chat thread.
 * It uses the `useParams` hook to get the `chatId` from the URL.
 * It uses the `UserContext` to get the current user.
 * It uses the `MessagesContext` to fetch messages and create a new message.
 * It uses the `AIContext` to process the message with the GPT-3 model.
 * It also maintains a `isTyping` state to show a typing indicator when the AI is processing the message.
 * @returns {JSX.Element} - The rendered component.
 */
function ChatThread(){
    const { chatId } = useParams();
    const { user } = useContext(UserContext);
    const { messages, fetchMessages, createMessage } = useContext(MessagesContext);
    const { processMessageToChatGPT } = useContext(AIContext);
    const [isTyping, setIsTyping] = useState(false);
    
    /**
     * This effect runs when the `user.uid` or `chatId` changes.
     * It fetches the messages for the current chat room.
     */
    useEffect(() => {
        if(user?.uid && chatId){
            fetchMessages(chatId);
        }
    }, [user.uid, fetchMessages, chatId]);

    /**
     * This function handles sending a message.
     * It creates a new message, sets the `isTyping` state to true, processes the message with the GPT-3 model, and then sets the `isTyping` state to false.
     * @param {string} message - The message to send.
     */
    const handleSend = async (message) => {
        console.log(message);
        await createMessage(chatId, message, user.uid);
        setIsTyping(true);
        await processMessageToChatGPT(chatId, messages, createMessage, message);
        setIsTyping(false);
    }

    return(
    <RootContainer>
        <NavBarComponent />
        <div style={{position: "relative", justifyContent: "center", width: "100%", flex:1}}>
            <MainContainer>
                <ChatContainer>
                    <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={isTyping ? <TypingIndicator content="Rex is typing" /> : null}
                    >
                    {messages.map((message, i) => {
                        const messageData = {
                            message: message.text,
                            sender: message.senderId,
                            sentTime: new Date(message.timestamp._seconds * 1000).toLocaleString(),
                            direction: message.senderId !== "Rex" ? "outgoing" : "incoming",
                        }
                        return <Message key={i} model={messageData} />
                    })}
                    </MessageList>
                    <MessageInput placeholder='Type message here' onSend={handleSend} />
                </ChatContainer>
            </MainContainer>
        </div>
    </RootContainer>
    )
}

export default ChatThread
