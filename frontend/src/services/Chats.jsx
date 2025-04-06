/**
 * This module is responsible for managing chat-related operations.
 * It provides a context for managing chats and exposes several functions for interacting with the chat API.
 *
 * @module Chats
 * @category Services
 */
import React, { useState, createContext, useContext } from 'react';
import { functions, httpsCallable } from '../api/firebase';
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
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { user } = useContext(UserContext);

  // Function for fetching all chats for the current user
  const fetchChats = async (setIsFetching) => {
    try {
      setIsFetching(true);
      const getAllChatRoomsFunction = httpsCallable(
        functions,
        'getAllChatRooms'
      );
      const response = await getAllChatRoomsFunction({ userId: user.uid });
      setChats(response.data.chatRooms);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Function for fetching a specific chat by ID
  const fetchAChat = async (chatId) => {
    try {
      const getAChatRoomFunction = httpsCallable(functions, 'getAChatRoom');
      const response = await getAChatRoomFunction({ userId: user.uid, chatId });
      return response.data.chatData;
    } catch (error) {
      console.error('Error fetching chat with Id:' + chatId, error);
    }
  };

  // Function for updating the status of a chat
  const updateChatStatus = async (chatId, newStatus) => {
    try {
      const updateChatRoomStatusFunction = httpsCallable(
        functions,
        'updateChatRoomStatus'
      );
      await updateChatRoomStatusFunction({
        userId: user.uid,
        chatId: chatId,
        isActive: newStatus,
      });
      setChats(
        chats.map((chat) =>
          chat.chatId === chatId ? { ...chat, isActive: newStatus } : chat
        )
      );
      setAlert({
        open: true,
        message: 'Chat status updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating chat status:', error);
      setAlert({
        open: true,
        message: 'Error updating chat status',
        severity: 'error',
      });
    }
  };

  // Function for creating a new chat room
  const createChatRoom = async (chatName) => {
    try {
      const createChatRoomFunction = httpsCallable(functions, 'createChatRoom');
      const response = await createChatRoomFunction({
        name: chatName,
        userId: user.uid,
      });

      setAlert({
        open: true,
        message: 'Chat room created successfully!',
        severity: 'success',
      });
      return {
        chatId: response.data.chatId,
        status: response.data.status,
      };
    } catch (error) {
      console.error('Error creating chat room:', error);
      setAlert({
        open: true,
        message: 'Error creating chat room',
        severity: 'error',
      });
    }
  };

  // Function for deleting a chat room
  const deleteChatRoom = async (chatId) => {
    try {
      const deleteChatRoomFunction = httpsCallable(functions, 'deleteChatRoom');
      await deleteChatRoomFunction({ userId: user.uid, chatId });
      setChats(chats.filter((chat) => chat.chatId !== chatId));
      setAlert({
        open: true,
        message: 'Chat room deleted successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting chat room:', error);
      setAlert({
        open: true,
        message: 'Error deleting chat room',
        severity: 'error',
      });
    }
  };

  // Render the provider for the chats context
  return (
    <ChatsContext.Provider
      value={{
        chats,
        alert,
        setAlert,
        fetchChats,
        fetchAChat,
        updateChatStatus,
        createChatRoom,
        deleteChatRoom,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
