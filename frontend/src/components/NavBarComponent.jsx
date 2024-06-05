/**
 * This is a React component named `NavBarComponent` that displays a navigation bar.
 * It imports necessary modules and components from React, React Router, Material UI, and local styles.
 * It uses the `UserContext` to sign out the user and `useNavigate` to navigate to different pages.
 * It also uses Material UI's `useTheme` and `useMediaQuery` to handle responsive design.
 * It handles sign out, navigation to chats page, navigation to chat logs, and drawer toggle.
 * It displays a navigation bar with a logo, page title, and buttons for navigation and sign out.
 * The `NavBarComponent` component is then exported for use in other parts of the application.
 *
 * @returns {JSX.Element} - A navigation bar with a logo, page title, and action buttons.
 */
import React, { useContext, useState } from 'react';
import { NavBar, NavButton, NavLogo, NavPageTitleText } from '../styles/NavStyles';
import logo from '../assets/images/rex-icon.png';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { UserContext } from '../services/User';
import { Link, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function NavBarComponent() {
    // State for drawer open/close
    const [drawerOpen, setDrawerOpen] = useState(false);
    // Context for user sign out
    const { signOut } = useContext(UserContext);
    // Hook for navigation
    const navigate = useNavigate();
    // Theme for responsive design
    const theme = useTheme();
    // Media query for mobile design
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Function to handle sign out and navigate to home page
    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    // Function to navigate to chats page
    const handleNavigateToChatsPage = () => {
        navigate('/inbox');
    };

    // Function to navigate to chat logs
    const handleChatLogs = () => {
        navigate('/chat-logs');
    }

    // Function to toggle drawer open/close
    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Drawer for mobile design
    const drawer = (
        <Drawer
            variant="temporary"
            anchor='right'
            open={drawerOpen}
            onClose={handleDrawerToggle}
        >
            <List>
                <ListItem button onClick={handleNavigateToChatsPage}>
                    <ListItemText primary="Chat Inbox" />
                </ListItem>
                <ListItem button onClick={handleChatLogs}>
                    <ListItemText primary="View Stats" />
                </ListItem>
                <ListItem button onClick={handleSignOut}>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            </List>
        </Drawer>
    );

    // Returns a navigation bar with a logo, page title, and buttons for navigation and sign out
    return (
        <NavBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to='/'><NavLogo src={logo} alt="logo" /></Link>
                    <Typography component="div">
                        <NavPageTitleText>REX AI Chatbot</NavPageTitleText>
                    </Typography>
                </div>
                {isMobile ? 
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ color: '#000000', display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                :
                    <>
                        <NavButton onClick={handleNavigateToChatsPage}>
                            Chat Inbox
                        </NavButton>
                        <NavButton onClick={handleChatLogs}>
                            View Stats
                        </NavButton>
                        <NavButton onClick={handleSignOut}>
                            Sign Out
                        </NavButton>
                    </>
                }
            </Toolbar>
            {drawer}
        </NavBar>
    );
}

export default NavBarComponent;
