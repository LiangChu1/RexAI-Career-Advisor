import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * A reusable alert component to show messages.
 * 
 * @param {boolean} open - Whether the alert is visible.
 * @param {string} severity - The severity of the alert (success, error, info, warning).
 * @param {string} message - The message to display in the alert.
 * @param {function} onClose - Function to close the alert manually.
 * @param {number} autoHideDuration - The duration before the alert auto-closes (in milliseconds).
 * 
 * @returns {JSX.Element} The rendered AlertComponent.
 */
function AlertComponent({ open, severity, message, onClose, autoHideDuration = 3000 }) {
    useEffect(() => {
        if (open) {
            // Close the alert automatically after the specified duration
            const timer = setTimeout(() => {
                onClose(); // Close the alert after the specified duration
            }, autoHideDuration);

            // Clean up the timer when the component unmounts or the alert closes
            return () => clearTimeout(timer);
        }
    }, [open, autoHideDuration, onClose]);

    return (
        <Snackbar open={open} onClose={onClose} autoHideDuration={autoHideDuration}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default AlertComponent;

