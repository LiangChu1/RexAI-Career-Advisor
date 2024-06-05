/**
 * This page component is responsible for rendering the Reset Password page.
 * It provides a form for the user to enter their email and request a password reset.
 * If the email is valid and exists in the database, a password reset link is sent to the user's email.
 * After the email is sent, it navigates the user back to the sign-in page.
 * 
 * @module ResetPassword
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
 * A functional component that renders a form for resetting the user's password.
 * 
 * @returns {JSX.Element} The rendered component
 */
function ResetPassword() {
    // State for the email input field
    const [email, setEmail] = useState("");

    // Context for user-related operations
    const { sendResetEmail } = useContext(UserContext);

    // Hook for navigation
    const navigate = useNavigate();

    /**
     * Handles the submission of the reset password form.
     * Sends a password reset email to the user and navigates to the sign-in page.
     * 
     * @param {Event} e - The submit event
     */
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const emailSent = await sendResetEmail(email);
        if(emailSent === true){
            navigate('/signin');
        }
    };

    // Render the component
    return (
        <Container>
            <Logo src={logo} alt="Rex logo" />
            <MainTitleText>Reset Password</MainTitleText>
            <MainForm onSubmit={handleResetPassword}>
                <FormInput
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    required
                />
                <MainButton variant="contained" type='submit'>Reset Password</MainButton>
            </MainForm>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </Container>
    );
}

export default ResetPassword;
