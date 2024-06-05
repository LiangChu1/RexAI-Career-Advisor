/**
 * This module is responsible for managing AI-related operations.
 * It provides a context for managing AI interactions and exposes a function for processing messages with OpenAI's GPT-3.5.
 * 
 * @module Rex
 * @category Services
 */
import { createContext } from "react";
import OpenAI from "openai/index.mjs";

// Initialize the OpenAI API with the provided API key
const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_KEY, dangerouslyAllowBrowser: true});

// Create a context for managing AI interactions
export const AIContext = createContext();

/**
 * A functional component that provides a context for managing AI interactions.
 * 
 * @param {Object} props - The component's props
 * @param {ReactNode} props.children - The component's children
 * @returns {JSX.Element} The rendered component
 */
export const Rex = ({ children }) => {
    // Define the system message for the AI
    const systemMessage = {
        "role": "system", "content": "Explain things as if you are a professional career mentor giving advice to someone"
    }
    /**
     * Processes a new message with the AI and adds it to the chat.
     * 
     * @param {string} chatId - The ID of the chat
     * @param {Array} messages - The existing messages in the chat
     * @param {Function} createMessage - A function for creating a new message
     * @param {string} newMessage - The content of the new message
     */
    const processMessageToChatGPT = async (chatId, messages, createMessage, newMessage) => {
        console.log(messages);
        let apiMessages = messages.map((message) => {
            let role = "";
            if(message.senderId === "Rex"){
                role = "assistant";
            }
            else{
                role = "user";
            }
            return { role: role, content: message.text}
        });

        // Add the new message to apiMessages
        apiMessages.push({ role: "user", content: newMessage });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,  // The system message DEFINES the logic of our chatGPT
                ...apiMessages // The messages from our chat with ChatGPT
            ]
        }

       const completion = await openai.chat.completions.create({
            messages: apiRequestBody.messages,
            model: apiRequestBody.model
       });
        createMessage(chatId, completion.choices[0].message.content, "Rex");
    }

    // Render the provider for the AI context
    return (
        <AIContext.Provider value={{ processMessageToChatGPT }}>
            {children}
        </AIContext.Provider>
    )
}