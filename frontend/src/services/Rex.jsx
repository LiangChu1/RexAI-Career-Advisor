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
    // Define the system messages for the AI
    const titleSystemMessage = {
        "role": "system",
        "content": "You are an assistant that creates concise and descriptive chat titles (under 10 words) based on the user's initial message."
    };    
    const chatSystemMessage = {
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
        let apiMessages = messages.map((message) => {
            let role = message.senderId === "Rex" ? "assistant" : "user";
            return { role: role, content: message.text };
        });
    
        apiMessages.push({ role: "user", content: newMessage });
    
        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [chatSystemMessage, ...apiMessages]
        };
    
        try {
            const completion = await openai.chat.completions.create({
                messages: apiRequestBody.messages,
                model: apiRequestBody.model
            });
    
            const aiMessage = completion.choices?.[0]?.message?.content || "Sorry, I don't have a reply.";
            
            await createMessage(chatId, aiMessage, "Rex");
    
            return { text: aiMessage };
        } catch (err) {
            console.error("Error calling OpenAI:", err);
            return { text: "Oops! Something went wrong while talking to Rex." };
        }
    };    

    /**
     * Processes a new title with the AI
     * 
     * @param {string} message - The initial message of the user
     */
    const createChatThreadTitle = async (message) => {
        const messages = [
            titleSystemMessage,
            {
                role: "user",
                content: `Generate a short and descriptive title for the following conversation: "${message}"`
            }
        ];
    
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages
        });
    
        const title = response.choices[0].message.content.trim();
        return title;
    };
    

    // Render the provider for the AI context
    return (
        <AIContext.Provider value={{ processMessageToChatGPT, createChatThreadTitle }}>
            {children}
        </AIContext.Provider>
    )
}