import React, { useContext, useEffect } from 'react';
import { UserContext } from '../services/User';
import ChatPreview from '../components/ChatPreview';
import { useNavigate } from 'react-router-dom';
import { ChatsContext } from '../services/Chats';
import { Container, MainButton, MainTitleText, RootContainer, SubTitleText } from '../styles/SharedStyles';
import NavBarComponent from '../components/NavBarComponent';

/**
 * This page component is responsible for rendering the inbox page.
 * It uses the `UserContext` to get the current user.
 * It uses the `ChatsContext` to fetch chats, update chat status, and delete chat rooms.
 * It uses the `useNavigate` hook from `react-router-dom` to navigate to the chat creator page.
 * @returns {JSX.Element} - The rendered component.
 */
function Inbox() {
    const { user } = useContext(UserContext);
    const { chats, fetchChats, updateChatStatus, deleteChatRoom } = useContext(ChatsContext)
    const navigate = useNavigate();

    /**
     * This effect runs when the `user.uid` changes.
     * It fetches the chats for the current user.
     */
    useEffect(() => {
        if (user?.uid) { // Ensure user.uid is available
            fetchChats();
        }
    }, [user.uid, fetchChats]); // Add user.uid as a dependency

    /**
     * This function handles the click of the "Start Another Chat with ReX" button.
     * It navigates to the chat creator page.
     */
    const handleCreateNewChatRoom = () => {
        // Navigate to form that creates a message
        navigate('/chat-creator');
    }

    return (
        <RootContainer>
        <NavBarComponent/>
        <Container>
            <MainTitleText>Chat Inbox</MainTitleText>
            <SubTitleText>Active Chats</SubTitleText>
            {chats.filter(chat => chat.isActive === true).map((chat) => (
                <ChatPreview key={chat.chatId} chat={chat} updateChatStatus={updateChatStatus} deleteChatRoom={deleteChatRoom}/>
            ))}
            <SubTitleText>Ended Chats</SubTitleText>
            {chats.filter(chat => chat.isActive === false).map((chat) => (
                <ChatPreview key={chat.chatId} chat={chat} updateChatStatus={updateChatStatus} deleteChatRoom={deleteChatRoom}/>
            ))}
            <MainButton className='inbox-button' onClick={handleCreateNewChatRoom}>Start Another Chat with ReX</MainButton>
        </Container>
        </RootContainer>
    );
}

export default Inbox;