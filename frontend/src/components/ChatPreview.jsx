/**
 * This is a React component named `ChatPreview` that displays a preview of a chat.
 * It imports necessary modules and components from React, React Router, and local styles.
 * It takes a `chat` object, `updateChatStatus`, and `deleteChatRoom` as props.
 * It handles chat click, update chat status click, and delete chat room click.
 * It also truncates the most recent message if it's longer than 100 characters.
 * It displays the chat name, truncated message, and buttons for chat actions in a styled container.
 * The `ChatPreview` component is then exported for use in other parts of the application.
 *
 * @param {Object} chat - The chat object containing chat details.
 * @param {Function} updateChatStatus - The function to update the chat status.
 * @param {Function} deleteChatRoom - The function to delete the chat room.
 * @returns {JSX.Element} - A styled container with chat details and action buttons.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainButton, SubButton } from '../styles/SharedStyles';
import { ChatMessage, ChatName, ChatPreviewContainer, ChatMessageButtonDivider } from '../styles/ChatPreviewStyles';

function ChatPreview({ chat, updateChatStatus, deleteChatRoom }) {
    // Hook from react-router-dom to programmatically navigate
    const navigate = useNavigate();

    // Function to handle chat click, navigates to the chat room
    const handleChatClick = async (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    // Function to handle update chat status click, toggles the chat status
    const handleUpdateChatStatusClick = async (chatId, currentStatus) => {
        updateChatStatus(chatId, !currentStatus);
    };

    // Function to handle delete chat room click, deletes the chat room
    const handleDeleteChatRoom = async (chatId) => {
        deleteChatRoom(chatId);
    }

    // Truncates the most recent message if it's longer than 100 characters
    const truncatedMessage = chat.mostRecentMessage
    ? (chat.mostRecentMessage.length > 100 
        ? `${chat.mostRecentMessage.substring(0, 100)}...` 
        : chat.mostRecentMessage)
    : "No messages yet";

    // Returns a styled container with the chat name, truncated message, and buttons for chat actions
    return (
        <ChatPreviewContainer key={chat.chatId}>
            <ChatName>{chat.name}</ChatName>
            <ChatMessage>{truncatedMessage}</ChatMessage>
            {chat.isActive ? (
                <ChatMessageButtonDivider>
                    <SubButton onClick={() => handleUpdateChatStatusClick(chat.chatId, chat.isActive)}>End Chat</SubButton>
                    <MainButton onClick={() => handleChatClick(chat.chatId)}>Start Chatting</MainButton>
                </ChatMessageButtonDivider>
            ) : (
                <ChatMessageButtonDivider>
                    <SubButton onClick={() => handleDeleteChatRoom(chat.chatId)}>Delete Chat</SubButton>
                    <MainButton onClick={() => handleUpdateChatStatusClick(chat.chatId, chat.isActive)}>Resume Chat</MainButton>
                </ChatMessageButtonDivider>
            )}
        </ChatPreviewContainer>
    );
}

export default ChatPreview;

