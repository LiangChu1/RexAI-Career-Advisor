// Importing necessary modules and components
import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Inbox from './pages/Inbox';
import ChatActivity from './pages/ChatActivity';
import { User } from './services/User';
import { Chats } from './services/Chats';
import { Messages } from './services/Messages';
import { Rex } from './services/Rex';

/**
 * The main App component that wraps all the routes and services.
 * It uses React Router for routing and provides several contexts for managing user, chats, messages, and Rex.
 * @returns {ReactElement} - The rendered App component.
 */
function App() {
    return (
        <Rex>
        <User>
            <Chats>
                <Messages>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/register" element={<Register />} />
                        <Route path='/reset-password' element={<ResetPassword />} />
                        <Route path='/inbox' element={<Inbox />} />
                        <Route path='/chat-logs' element={<ChatActivity />} />
                    </Routes>
                </Router>
                </Messages>
            </Chats>
        </User>
        </Rex>
    );
}

// Exporting the App component as the default export
export default App;
