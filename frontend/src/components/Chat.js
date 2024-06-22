import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css'; // Import the CSS file

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [typingMessage, setTypingMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatWindowRef = useRef(null); // Reference to the chat window

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = { sender: 'user', text: input };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput(''); // Clear the input field

            setIsTyping(true);

            try {
                const response = await axios.post('http://localhost:5000/chat', { message: input });
                setIsTyping(false);
                typeResponse(response.data.response);
            } catch (error) {
                console.error('Error sending message:', error);
                setIsTyping(false);
                const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            }
        }
    };

    const typeResponse = (responseText) => {
        let index = 0;
        setTypingMessage('');

        const typingInterval = setInterval(() => {
            if (index < responseText.length) {
                setTypingMessage((prev) => prev + responseText[index]);
                index++;
            } else {
                clearInterval(typingInterval);
                setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: responseText }]);
                setTypingMessage('');
            }
        }, 50); // Adjust the speed of typing here
    };

    useEffect(() => {
        // Scroll to the bottom of the chat window when messages or typingMessage change
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, typingMessage, isTyping]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>CatchPhis Bot</h2>
            </div>
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {typingMessage && (
                    <div className="message bot">
                        {typingMessage}
                    </div>
                )}
                {isTyping && !typingMessage && (
                    <div className="message bot typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
