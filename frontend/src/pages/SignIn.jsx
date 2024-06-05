/**
 * This component is responsible for rendering the Sign In page.
 * It provides a form for the user to enter their email or username and password to sign in.
 * If the credentials are valid, the user is signed in and navigated to the home page.
 * 
 * @module SignIn
 * @category Components
 * @subcategory Authentication
 */

import React, { useContext, useState } from 'react';
import { UserContext } from '../services/User';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/images/rex-logo.png";
import { Container, Logo, MainButton, MainTitleText } from '../styles/SharedStyles';
import { MainForm, FormInput } from "../styles/FormAndInputStyles";

/**
 * A functional component that renders a form for signing in the user.
 * 
 * @returns {JSX.Element} The rendered component
 */
function SignIn() {
    // State for the email or username input field
    const [emailOrUsername, setEmailOrUsername] = useState('');

    // State for the password input field
    const [password, setPassword] = useState('');

    // Context for user-related operations
    const { signIn } = useContext(UserContext);

    // Hook for navigation
    const navigate = useNavigate();

    /**
     * Handles the submission of the sign in form.
     * Signs in the user and navigates to the home page.
     * 
     * @param {Event} e - The submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await signIn(emailOrUsername, password);
        if(user !== null){
            navigate('/');
        }
    };

    // Render the component
    return (
        <Container>
            <Logo src={logo} alt="Rex logo" />
            <MainTitleText>Sign In</MainTitleText>
            <MainForm onSubmit={handleSubmit}>
                <FormInput
                    type='text'
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder='Email'
                    required
                />
                <FormInput
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                />
                <MainButton variant="contained" type='submit'>Sign In</MainButton>
            </MainForm>
            <Link to="/reset-password">Forgot Password?</Link>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </Container>
    );
}

export default SignIn;
