import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../services/User';
import { ChatsContext } from '../services/Chats';
import { MessagesContext } from '../services/Messages';
import { AIContext } from '../services/Rex';

import NavBarComponent from '../components/NavBarComponent';
import ChatHistoryPanel from '../components/ChatHistoryPanel';
import ChatThreadPanel from '../components/ChatThreadPanel';
import AlertComponent from '../components/AlertComponent';

import { RootContainer } from '../styles/SharedStyles';
import { PageLayoutContainer } from '../styles/InboxStyles';
import { Container } from '@mui/material';

function Inbox() {
  // Context hooks for user, chats, messages, AI interaction
  const { user } = useContext(UserContext);
  const {
    chats,
    alert,
    setAlert,
    fetchChats,
    createChatRoom,
    updateChatStatus,
    deleteChatRoom,
  } = useContext(ChatsContext);
  const { messages, setMessages, fetchMessages, createMessage, resetMessages } =
    useContext(MessagesContext);
  const { processMessageToChatGPT, createChatThreadTitle } =
    useContext(AIContext);

  // Local component states
  const [creatingChat, setCreatingChat] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [activeChats, setActiveChats] = useState([]);
  const [endedChats, setEndedChats] = useState([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);

  // Fetch chat rooms whenever user or chats change
  useEffect(() => {
    if (user?.uid) {
      fetchChats(setIsFetchingChats);
      setActiveChats(chats.filter((chat) => chat.isActive));
      setEndedChats(chats.filter((chat) => !chat.isActive));
      setIsFetchingChats(false);
    }
  }, [user?.uid, fetchChats, chats, setIsFetchingChats, isFetchingChats]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (user?.uid && selectedChatId) {
      fetchMessages(selectedChatId, setIsFetchingMessages);
      setIsFetchingMessages(false);
    }
  }, [user?.uid, selectedChatId, fetchMessages, setIsFetchingMessages]);

  // Reset the current selected chat
  const resetCurrentChatThread = () => {
    setSelectedChatId(null);
    resetMessages();
  };

  // Create a new chat and send initial message
  const handleCreateNewChatThread = async (message) => {
    if (!message || message.trim() === '') return;

    setCreatingChat(true);
    try {
      const chatName = await createChatThreadTitle(message);
      const { chatId } = await createChatRoom(chatName);
      setSelectedChatId(chatId);
      await fetchMessages(chatId, setIsFetchingMessages);
      await handleSend(message, chatId);
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setCreatingChat(false);
      setIsFetchingMessages(false);
    }
  };

  // Handle sending message (from user, then AI reply)
  const handleSend = async (message, chatId = null) => {
    const targetChatId = selectedChatId || chatId;
    if (!targetChatId || !message?.trim()) return;

    const trimmedMessage = message.trim();
    const userMessage = {
      text: trimmedMessage,
      senderId: user.uid,
      timestamp: { _seconds: Math.floor(Date.now() / 1000) },
    };

    const typingIndicator = {
      id: 'typing',
      text: '',
      senderId: 'Rex',
      isTypingIndicator: true,
      timestamp: { _seconds: Math.floor(Date.now() / 1000) },
    };

    try {
      setMessages((prev) => [...prev, userMessage]);
      await createMessage(targetChatId, trimmedMessage, user.uid);
      setIsTyping(true);
      setMessages((prev) => [...prev, typingIndicator]);

      const aiReply = await processMessageToChatGPT(
        targetChatId,
        [...messages, userMessage],
        createMessage,
        trimmedMessage
      );

      const rexResponse = aiReply?.text || 'Sorry, something went wrong.';
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTypingIndicator),
        {
          text: rexResponse,
          senderId: 'Rex',
          timestamp: { _seconds: Math.floor(Date.now() / 1000) },
        },
      ]);
    } catch (err) {
      console.error('Error in handleSend:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <RootContainer>
      <NavBarComponent />
      <PageLayoutContainer>
        <ChatHistoryPanel
          isFetchingChats={isFetchingChats}
          activeChats={activeChats}
          endedChats={endedChats}
          selectedChatId={selectedChatId}
          updateChatStatus={updateChatStatus}
          deleteChatRoom={deleteChatRoom}
          setSelectedChatId={setSelectedChatId}
          resetMessages={resetMessages}
          resetCurrentChatThread={resetCurrentChatThread}
        />
        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#fff',
            width: '100%',
          }}
        >
          <ChatThreadPanel
            user={user}
            messages={messages}
            isTyping={isTyping}
            isFetchingMessages={isFetchingMessages}
            selectedChatId={selectedChatId}
            creatingChat={creatingChat}
            handleSend={handleSend}
            handleCreateNewChatThread={handleCreateNewChatThread}
          />
        </Container>
      </PageLayoutContainer>
      <AlertComponent
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={1500}
      />
    </RootContainer>
  );
}

export default Inbox;
