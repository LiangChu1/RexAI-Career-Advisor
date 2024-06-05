import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../services/User';
import icon from '../assets/images/rex-icon.png';
import { Container, Logo, MainButton, MainTitleText, RootContainer, SubTitleText } from '../styles/SharedStyles';
import NavBarComponent from '../components/NavBarComponent';

/**
 * This page component is responsible for rendering the home page.
 * It uses the `UserContext` to get the current user.
 * It uses the `useNavigate` hook from `react-router-dom` to navigate to the sign in or inbox page.
 * @returns {JSX.Element} - The rendered component.
 */
function Home() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    /**
     * This function handles the click of the "Get Started" button.
     * It navigates to the sign in page.
     */
    const handleGetStarted = () => {
        navigate('/signin');
    };

    /**
     * This function handles the click of the "Start Chatting" button.
     * It navigates to the inbox page.
     */
    const handleNavigateToChatsPage = () => {
        navigate('/inbox');
    };

    return (
        <div>
            {user ? (
                <RootContainer>
                    <NavBarComponent />
                    <Container>
                        <MainTitleText>Welcome{user ? `, ${user.displayName}` : ' to ReX AI Chatbot'}</MainTitleText>
                        <SubTitleText>Receive Career Help from ReX!</SubTitleText>
                        <MainButton variant="contained" onClick={handleNavigateToChatsPage}>Start Chatting</MainButton>
                    </Container>
                </RootContainer>
            ) : (
                <Container>
                    <Logo src={icon} alt="Rex icon" />
                    <MainTitleText>Welcome to ReX AI ChatBot</MainTitleText>
                    <SubTitleText>Receive Career Help from ReX!</SubTitleText>
                    <MainButton className='home-button' onClick={handleGetStarted}>Get Started</MainButton>
                </Container>
            )}
        </div>
    );
}

export default Home;
