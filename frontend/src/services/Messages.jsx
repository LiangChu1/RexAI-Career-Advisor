/**
 * This module is responsible for managing message-related operations.
 * It provides a context for managing messages and exposes several functions for interacting with the message API.
 *
 * @module Messages
 * @category Services
 */
import React, { useState, createContext, useContext } from 'react';
import { functions, httpsCallable } from '../api/firebase';
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

  /**
   * Fetches all messages for a specific chat.
   *
   * @param {string} chatId - The ID of the chat.
   * @returns {void}
   */
  const fetchMessages = async (chatId, setIsFetching) => {
    try {
      setIsFetching(true);
      const getChatMessages = httpsCallable(functions, 'getChatMessages');
      const result = await getChatMessages({ userId: user.uid, chatId });
      const sortedMessages = result.data.messages.sort(
        (a, b) => a.timestamp._seconds - b.timestamp._seconds
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages for chat: ' + chatId, error);
    }
  };

  /**
   * Creates a new message in a specific chat.
   *
   * @param {string} chatId - The ID of the chat.
   * @param {string} text - The text of the message.
   * @param {string} senderId - The ID of the sender.
   * @returns {void}
   */
  const createMessage = async (chatId, text, senderId) => {
    try {
      const createMessageFunction = httpsCallable(functions, 'postMessage');
      const response = await createMessageFunction({
        text: text,
        userId: user.uid,
        chatId: chatId,
        senderId: senderId
      });
  
      const newMessage = {
        text: text,
        senderId: senderId,
        timestamp: { _seconds: Math.floor(Date.now() / 1000) },
        id: response.data.messageId
      };
      
      setMessages(prev => [newMessage, ...prev]);
      
      return response.data;
    } catch (error) {
      console.error("Message creation error:", {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
  };

  const resetMessages = () => {
    setMessages([]);
  };

  // Render the provider for the messages context
  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, fetchMessages, createMessage, resetMessages }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
