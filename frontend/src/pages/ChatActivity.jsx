/**
 * This is a React page component named `ChatActivity` that displays chat statistics and detailed chat history.
 * It imports necessary modules and components from React, Material UI, Recharts, Firebase Firestore, and local styles.
 * It uses the `UserContext` and `ChatsContext` to fetch chats and the user.
 * It also uses a state for chart data and a function to format dates.
 * It fetches chats and groups them by date in a `useEffect` hook.
 * It displays a navigation bar, chat statistics in a bar chart, and detailed chat history in a styled container.
 * The `ChatActivity` component is then exported for use in other parts of the application.
 *
 * @returns {JSX.Element} - A styled container with a navigation bar, chat statistics, and detailed chat history.
 */
import React, { useContext, useEffect, useState } from 'react';
import {Grid} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChatLogPreview from '../components/ChatLogPreview';
import { UserContext } from '../services/User';
import { ChatsContext } from '../services/Chats';
import { Timestamp } from 'firebase/firestore';
import { Container, MainTitleText, RootContainer, SubTitleText } from '../styles/SharedStyles';
import NavBarComponent from '../components/NavBarComponent';

const ChatActivity = () => {
    // Context for user and chats
    const { user } = useContext(UserContext);
    const { chats, fetchChats } = useContext(ChatsContext)
    // State for chart data
    const [ chartData, setChartData ] = useState([]);

    // Function to format dates
    const formattedDate = (timeStamp) => {
        const timestamp = new Timestamp(timeStamp._seconds, timeStamp._nanoseconds);
        const date = timestamp.toDate();
        const formattedDate = date.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit' });
        return formattedDate;
    }

    // Fetch chats and group them by date
    useEffect(() => {
        if (user?.uid) { // Ensure user.uid is available
            fetchChats();
            const groupedChats = chats.reduce((acc, chat) => {
                const date = formattedDate(chat.created_at);
                if (!acc[date]) {
                    acc[date] = {
                        date: date,
                        totalMessages: 0
                    };
                }
                acc[date].totalMessages += chat.totalMessages;
                return acc;
            }, {});
            setChartData(Object.values(groupedChats));
        }
    }, [user.uid, fetchChats, chats]); // Add user.uid as a dependency

    // Returns a styled container with a navigation bar, chat statistics, and detailed chat history
    return (
        <RootContainer>
            <NavBarComponent />
            <Container style={{padding: '0', width: '100%'}}>
                <MainTitleText>Chat Statistics</MainTitleText>
                <SubTitleText>Monthly Usage</SubTitleText>
                <Grid container item style={{display:'flex', justifyContent: 'center', width:'100%'}}>
                    <BarChart
                        width={350}
                        height={400}
                        data={chartData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalMessages" fill="#8884d8" />
                    </BarChart>
                </Grid>
                <SubTitleText>Detailed Chat History</SubTitleText>
                {chats.map((chat) => (
                    <ChatLogPreview key={chat.chatId} chat={chat}/>
                ))}
            </Container>
        </RootContainer>
    );
}

export default ChatActivity;
