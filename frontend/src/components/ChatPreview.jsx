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
import React, { useState } from 'react';
import { MainButton, SubButton } from '../styles/SharedStyles';
import {
  ChatMessage,
  ChatName,
  ChatPreviewContainer,
  ChatMessageButtonDivider,
} from '../styles/ChatPreviewStyles';
import { CircularProgress } from '@mui/material';

function ChatPreview({
  chat,
  updateChatStatus,
  deleteChatRoom,
  setSelectedChatId,
  selectedChatId,
  resetMessages,
}) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const isSelected = chat.chatId === selectedChatId;

  const handleChatClick = async (chatId) => {
    setIsStartingChat(true);
    try {
      await setSelectedChatId(chatId);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleUpdateChatStatusClick = async (chatId, currentStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateChatStatus(chatId, !currentStatus);
      if (!currentStatus === false && selectedChatId === chatId) {
        setSelectedChatId(null);
        resetMessages();
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteChatRoom = async (chatId) => {
    setIsDeleting(true);
    try {
      await deleteChatRoom(chatId);
    } finally {
      setIsDeleting(false);
    }
  };

  const truncatedMessage = chat.mostRecentMessage
    ? chat.mostRecentMessage.length > 100
      ? `${chat.mostRecentMessage.substring(0, 100)}...`
      : chat.mostRecentMessage
    : 'No messages yet';

  return (
    <ChatPreviewContainer selected={isSelected}>
      <ChatName>{chat.name}</ChatName>
      <ChatMessage>{truncatedMessage}</ChatMessage>
      {chat.isActive ? (
        <ChatMessageButtonDivider>
          <SubButton
            onClick={() =>
              handleUpdateChatStatusClick(chat.chatId, chat.isActive)
            }
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <CircularProgress size={16} sx={{ color: '#fff' }} />
            ) : (
              'End Chat'
            )}
          </SubButton>

          {!isSelected && (
            <MainButton
              onClick={() => handleChatClick(chat.chatId)}
              disabled={isStartingChat}
            >
              {isStartingChat ? (
                <CircularProgress size={16} sx={{ color: '#fff' }} />
              ) : (
                'Start Chatting'
              )}
            </MainButton>
          )}
        </ChatMessageButtonDivider>
      ) : (
        <ChatMessageButtonDivider>
          <SubButton
            onClick={() => handleDeleteChatRoom(chat.chatId)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={16} sx={{ color: '#fff' }} />
            ) : (
              'Delete Chat'
            )}
          </SubButton>

          <MainButton
            onClick={() =>
              handleUpdateChatStatusClick(chat.chatId, chat.isActive)
            }
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <CircularProgress size={16} sx={{ color: '#fff' }} />
            ) : (
              'Resume Chat'
            )}
          </MainButton>
        </ChatMessageButtonDivider>
      )}
    </ChatPreviewContainer>
  );
}

export default ChatPreview;
