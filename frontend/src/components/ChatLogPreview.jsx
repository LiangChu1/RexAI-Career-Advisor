/**
 * This is a React component named `ChatLogPreview` that displays a preview of a chat log.
 * It imports necessary modules and components from React, Firebase Firestore, and local styles.
 * It takes a `chat` object as a prop, formats the `created_at` timestamp, and displays the chat name,
 * the formatted date, and the total number of messages in a styled container.
 * The `ChatLogPreview` component is then exported for use in other parts of the application.
 *
 * @param {Object} chat - The chat object containing chat details.
 * @returns {JSX.Element} - A styled container with the chat name, formatted date, and total message count.
 */
import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { ChatMessage, ChatName, ChatPreviewContainer } from '../styles/ChatPreviewStyles';

function ChatLogPreview({chat}) {

    /**
     * This function converts a Firestore Timestamp into a formatted date string.
     * It creates a Firestore Timestamp using seconds and nanoseconds,
     * converts the Timestamp to a JavaScript Date object,
     * and formats the Date object into a string in the format MM/DD/YYYY.
     *
     * @returns {string} - The formatted date.
     */
    const formattedDate = () => {
        const timestamp = new Timestamp(chat.created_at._seconds, chat.created_at._nanoseconds);
        const date = timestamp.toDate();
        const formattedDate = date.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' });
        return formattedDate;
    }

    /**
     * The component returns a styled container with the chat name, formatted date, and total message count.
     * It uses the `ChatPreviewContainer`, `ChatName`, and `ChatMessage` styled components for styling.
     *
     * @returns {JSX.Element} - The styled container with chat details.
     */
    return(
        <ChatPreviewContainer key={chat.chatId}>
            <ChatName>{chat.name} - {formattedDate()}</ChatName>
            <ChatMessage>{chat.totalMessages} Messages</ChatMessage>
        </ChatPreviewContainer>
    )
}

export default ChatLogPreview;
