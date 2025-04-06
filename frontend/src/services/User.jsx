/**
 * This component is responsible for managing user authentication.
 * It provides a context with the current user and functions for signing in, registering, signing out, and resetting the password.
 * Each function updates the `user` state and displays an alert with the status of the operation.
 * @param {Object} props - The props of the component.
 * @param {ReactNode} props.children - The children components to render inside the UserContext.Provider.
 * @returns {ReactElement} - The UserContext.Provider component with the `user` state and authentication functions as its value.
 */
import React, { useState, createContext, useEffect } from 'react';
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
export const UserContext = createContext();

export const User = ({ children }) => {
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    // Subscribe to authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    /**
     * Signs in a user with the given email and password.
     * If successful, it updates the `user` state and displays an alert.
     * If an error occurs, it logs the error and displays an alert.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<User>} - The signed-in user.
     */
    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setAlert({ open: true, message: 'Sign in successful!', severity: 'success' });
            return userCredential.user;
        } catch (error) {
            console.error("Login Failed: ", error);
            setAlert({ open: true, message: 'Invalid credentials. Please try again.', severity: 'error' });
        }
    };


    /**
     * Registers a user with the given email, password, and display name.
     * If successful, it updates the `user` state and displays an alert.
     * If an error occurs, it logs the error and displays an alert.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @param {string} displayName - The display name of the user.
     * @returns {Promise<User>} - The registered user.
     */
    const register = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: displayName });
            setUser(user);
            setAlert({ open: true, message: 'Registration successful!', severity: 'success' });
            return user;
        } catch (error) {
            console.error("Registration Failed: ", error);
            setAlert({ open: true, message: 'Registration failed. Please try again.', severity: 'error' });
        }
    };    

    /**
     * Signs out the current user.
     * If successful, it updates the `user` state and displays an alert.
     * If an error occurs, it logs the error and displays an alert.
     * @returns {Promise<void>}
     */
    const signOut = async () => {
        try {
            await auth.signOut();
            setUser(null);
            setAlert({ open: true, message: 'Sign out successful!', severity: 'success' });
        } catch (error) {
            console.error("Logout Failed: ", error);
            setAlert({ open: true, message: 'Logout failed. Please try again.', severity: 'error' });
        }
    };
    
    /**
     * Sends a password reset email to the given email.
     * If successful, it displays an alert.
     * If an error occurs, it logs the error and displays an alert.
     * @param {string} email - The email to send the password reset email to.
     * @returns {Promise<boolean>} - `true` if the email was sent successfully.
     */
    const sendResetEmail = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            setAlert({ open: true, message: 'Password reset email sent successfully!', severity: 'success' });
            return true;
        } catch (error) {
            console.error("Error resetting password: ", error);
            setAlert({ open: true, message: 'Error resetting password. Please try again.', severity: 'error' });
            return false;
        }
    };    
    
    // Render the provider for User context
    return (
        <UserContext.Provider value={{ user, alert, setAlert, signIn, register, signOut, sendResetEmail }}>
            {children}
        </UserContext.Provider>
    );
};

