import React, { useContext, useState } from 'react';
import { UserContext } from '../services/User';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/images/rex-logo.png";
import { Container, Logo, MainButton, MainTitleText } from '../styles/SharedStyles';
import { MainForm, FormInput } from "../styles/FormAndInputStyles";

/**
 * This page component is responsible for rendering the registration page.
 * It uses the `UserContext` to access the `register` function.
 * It uses the `useNavigate` hook from `react-router-dom` to navigate to the home page after successful registration.
 * It maintains states for the email, password, and display name inputs.
 * @returns {JSX.Element} - The rendered component.
 */
function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const { register } = useContext(UserContext);
    const navigate = useNavigate();

    /**
     * This function handles the form submission.
     * It prevents the default form submission, registers the user with the provided email, password, and display name,
     * and navigates to the home page if the registration is successful.
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await register(email, password, displayName);
        if(user !== null){
            navigate('/');
        }
    };

    return (
        <Container>
            <Logo src={logo} alt="Rex logo" />
            <MainTitleText>Register</MainTitleText>
            <MainForm onSubmit={handleSubmit}>
                <FormInput
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <FormInput
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder='Display Name'
                    required
                />
                <MainButton variant="contained" type='submit'>Register</MainButton>
            </MainForm>
            <p>Already have an account? <Link to="/signin">Sign In</Link></p>
        </Container>
    );
}

export default Register;
