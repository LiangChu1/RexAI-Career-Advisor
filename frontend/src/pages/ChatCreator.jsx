import React, { useContext, useState } from 'react';
import { ChatsContext } from '../services/Chats';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/rex-logo.png";
import { Container, Logo, MainButton, MainTitleText } from '../styles/SharedStyles';
import {FormInput} from '../styles/FormAndInputStyles';

/**
 * This page component is responsible for creating a new chat room.
 * It uses the `ChatsContext` to access the `createChatRoom` function.
 * It also uses the `useNavigate` hook from `react-router-dom` to navigate to the inbox after the chat room is created.
 * The chat room name is stored in the `chatName` state, which is updated by the `handleChatNameChange` function.
 * The `handleCreateChatRoom` function is responsible for creating the chat room and navigating to the inbox.
 * @returns {JSX.Element} - The rendered component.
 */
function ChatCreator() {
    const [chatName, setChatName] = useState('');
    const { createChatRoom } = useContext(ChatsContext);
    const navigate = useNavigate()

    /**
     * This function handles the change of the chat room name input.
     * It updates the `chatName` state with the new value.
     * @param {Object} event - The event object from the input change.
     */
    const handleChatNameChange = (event) => {
        setChatName(event.target.value);
    };

    /**
     * This function handles the creation of a new chat room.
     * It calls the `createChatRoom` function with the `chatName` and navigates to the inbox.
     */
    const handleCreateChatRoom = async () => {
        await createChatRoom(chatName);
        navigate('/inbox');
    };

    return (
        <Container>
            <Logo src={logo} alt="Rex logo" />
            <MainTitleText>Create a New Chat Room</MainTitleText>
            <FormInput style={{width: "50%"}} type='text' value={chatName} onChange={handleChatNameChange} placeholder='Enter chat room name' />
            <MainButton onClick={handleCreateChatRoom}>Create Chat Room</MainButton>
        </Container>
    );
}

export default ChatCreator;
