/**
 * This component is responsible for managing user authentication.
 * It provides a context with the current user and functions for signing in, registering, signing out, and resetting the password.
 * Each function updates the `user` state and displays an alert with the status of the operation.
 * @param {Object} props - The props of the component.
 * @param {ReactNode} props.children - The children components to render inside the UserContext.Provider.
 * @returns {ReactElement} - The UserContext.Provider component with the `user` state and authentication functions as its value.
 */
import React, { useState, createContext } from 'react';
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
export const UserContext = createContext();

export const User = ({ children }) => {
    const [user, setUser] = useState(null);


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
            alert("Login Complete");
            return userCredential.user;
        } catch (error) {
            console.error("Login Failed: ", error);
            alert("Login Failed: ", error);
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
            alert("Registration Complete");
            return user;
        } catch (error) {
            console.error("Registration Failed: ", error);
            alert("Registration Failed: ", error);
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
            alert("Logout Complete");
        } catch (error) {
            console.error("Logout Failed: ", error);
            alert("Logout Failed: ", error);
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
            alert("email sent for Password reset");
            return true;
        } catch (error) {
            console.error("Error resetting password: ", error);
            alert("Error resetting password: ", error);
        }
    };    
    
    // Render the provider for User context
    return (
        <UserContext.Provider value={{ user, signIn, register, signOut, sendResetEmail }}>
            {children}
        </UserContext.Provider>
    );
};

