/**
 * This module is responsible for managing message-related operations.
 * It provides a context for managing messages and exposes several functions for interacting with the message API.
 * 
 * @module Messages
 * @category Services
 */
import React, { useState, createContext, useContext } from 'react';
import { functions, httpsCallable } from '../api/firebase';
import axios from 'axios';
import { UserContext } from './User';

// Create a context for managing messages
export const MessagesContext = createContext();

/**
 * A functional component that provides a context for managing messages.
 * 
 * @param {Object} props - The component's props
 * @param {ReactNode} props.children - The component's children
 * @returns {JSX.Element} The rendered component
 */
export const Messages = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const { user } = useContext(UserContext);

    // Function for fetching all messages for a specific chat
    const fetchMessages = async (chatId) => {
        try{
            const response = await axios.get(`https://us-central1-rex-chatbot-c1051.cloudfunctions.net/getChatMessages?userId=${user.uid}&chatId=${chatId}`);
            const sortedMessages = response.data.messages.sort((a, b) => a.timestamp._seconds - b.timestamp._seconds);
            setMessages(sortedMessages);
        }catch(error){
            console.log('Error fetching messages for chat: '+ chatId, error);
        }
    }

     // Function for fetching a specific message by ID
    const fetchAMessage = async (chatId, messageId) => {
        try{
            const response = await axios.get(`https://us-central1-rex-chatbot-c1051.cloudfunctions.net/getAMessage?userId=${user.uid}&chatId=${chatId}&messageId=${messageId}`);
            console.log(response.data.status);
            return response.data.messageData;
        }catch(error){
            console.log('Error fetching message: ' + messageId + ' for chat: '+ chatId, error);
        }

    }

    // Function for creating a new message
    const createMessage = async (chatId, text, senderId) => {
        try{
            const createMessageFunction = httpsCallable(functions, 'postMessage');
            const response = await createMessageFunction({text: text, userId: user.uid, chatId: chatId, senderId: senderId});
            alert(response.data.status);
            const messageData = fetchAMessage(response.data.chatId, response.data.messageId);
            setMessages([messageData, ...messages]);
        }catch(error){
            console.log('Error creating message: ' + text + ' for chat: '+ chatId, error);
        }
    }
    
    // Render the provider for the messages context
    return (
        <MessagesContext.Provider value={{ messages, fetchMessages, createMessage }}>
            {children}
        </MessagesContext.Provider>
    )

    
}
