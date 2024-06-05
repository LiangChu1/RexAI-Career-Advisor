/**
 * This module is responsible for managing chat-related operations.
 * It provides a context for managing chats and exposes several functions for interacting with the chat API.
 * 
 * @module Chats
 * @category Services
 */
import React, { useState, createContext, useContext } from 'react';
import { functions, httpsCallable } from '../api/firebase';
import axios from 'axios';
import { UserContext } from './User';

// Create a context for managing chats
export const ChatsContext = createContext();

/**
 * A functional component that provides a context for managing chats.
 * 
 * @param {Object} props - The component's props
 * @param {ReactNode} props.children - The component's children
 * @returns {JSX.Element} The rendered component
 */
export const Chats = ({ children }) => {
    const [chats, setChats] = useState([]);
    const { user } = useContext(UserContext);

    // Function for fetching all chats for the current user
    const fetchChats = async () => {
        try {
            const response = await axios.get(`https://us-central1-rex-chatbot-c1051.cloudfunctions.net/getAllChatRooms?userId=${user.uid}`);
            //console.log(response.data.status)
            setChats(response.data.chatRooms);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    // Function for fetching a specific chat by ID
    const fetchAChat = async (chatId) => {
        try{
            const response = await axios.get(`https://us-central1-rex-chatbot-c1051.cloudfunctions.net/getAChatRoom?userId=${user.uid}&chatId=${chatId}`);
            console.log(response.data.status)
            return response.data.chatData;
        } catch (error) {
            console.error('Error fetching chat with Id:' + chatId, error);
        }
    }

    // Function for updating the status of a chat
    const updateChatStatus = async (chatId, newStatus) => {
        try{
        const url = 'https://us-central1-rex-chatbot-c1051.cloudfunctions.net/updateChatRoomStatus';
        const data = {
            userId: user.uid,
            chatId: chatId,
            isActive: newStatus
        };
            const response = await axios.put(url, { data });
            console.log(response.data.status);
            setChats(chats.map(chat => chat.chatId === chatId ? { ...chat, isActive: newStatus } : chat));
        } catch (error) {
            console.error("Error updating chat status:", error.response ? error.response.data : error);
        }
    };

    // Function for creating a new chat room
    const createChatRoom = async (chatName) => {
        try{
           const createChatRoomFunction = httpsCallable(functions, 'createChatRoom');
           const response = await createChatRoomFunction({ name: chatName, userId: user.uid });
           alert(response.data.status);
           const chatData = fetchAChat(response.data.chatId);
           setChats([...chats, chatData]);
        }  catch(error){
          console.log("Error creating chat room:" + error);
        }
    };

    // Function for deleting a chat room
    const deleteChatRoom = async (chatId) => {
        try{
            const response = await axios.delete(`https://us-central1-rex-chatbot-c1051.cloudfunctions.net/deleteChatRoom?userId=${user.uid}&chatId=${chatId}`);
            console.log(response.data.status);
            setChats(chats.filter(chat => chat.chatId !== chatId));
        } catch (error) {
            console.error("Error deleting chat room:", error);
        }
    }    

    // Render the provider for the chats context
    return (
        <ChatsContext.Provider value={{ chats, fetchChats, fetchAChat, updateChatStatus, createChatRoom, deleteChatRoom }}>
            {children}
        </ChatsContext.Provider>
    );
}
