import React, { useState } from 'react';
import './Chatbot.css'; // Import chatbot styles if needed
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi there 👋 How can I help you today?' }
  ]);

  // Function to send message
  const sendMessage = (message) => {
    // Add message to state
    setMessages([...messages, { role: 'user', content: message }]);
    
    // Call API to get response
    // Update state with response
  };

  return (
    <div className="chatbot">
      {/* Chat messages */}
      <ul className="chatbox">
        {messages.map((msg, index) => (
          <li key={index} className={`chat ${msg.role}`}>
            <span className="material-symbols-outlined">smart_toy</span>
            <p>{msg.content}</p>
          </li>
        ))}
      </ul>

      {/* Chat input */}
      <div className="chat-input">
        <textarea
          placeholder="Enter a message..."
          spellCheck="false"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <button
          id="send-btn"
          className="material-symbols-rounded"
          onClick={() => {
            const message = document.querySelector('.chat-input textarea').value;
            sendMessage(message);
            document.querySelector('.chat-input textarea').value = '';
          }}
        >
          <SmartToyOutlinedIcon /> {/* Icon displayed here */}
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
