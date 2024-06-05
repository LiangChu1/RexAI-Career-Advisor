// Importing necessary modules and components
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Inbox from './pages/Inbox';
import ResetPassword from './pages/ResetPassword'
import ChatCreator from './pages/ChatCreator';
import { User } from './services/User';
import { Chats } from './services/Chats';
import ChatThread from './pages/ChatThread';
import { Messages } from './services/Messages';
import { Rex } from './services/Rex';
import ChatActivity from './pages/ChatActivity';

/**
 * The main App component that wraps all the routes and services.
 * It uses React Router for routing and provides several contexts for managing user, chats, messages, and Rex.
 * @returns {ReactElement} - The rendered App component.
 */
function App() {
    return (
        <User>
            <Chats>
                <Messages>
                    <Rex>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/register" element={<Register />} />
                            <Route path='/reset-password' element={<ResetPassword />} />
                            <Route path='/inbox' element={<Inbox />} />
                            <Route path='/chat-creator' element={<ChatCreator />} />
                            <Route path='/chat/:chatId' element={<ChatThread />} />
                            <Route path='/chat-logs' element={<ChatActivity />} />
                        </Routes>
                    </Router>
                    </Rex>
                </Messages>
            </Chats>
        </User>
    );
}

// Exporting the App component as the default export
export default App;
