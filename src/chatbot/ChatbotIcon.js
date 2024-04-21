import React, { useState } from 'react';
import Chatbot from './Chatbot';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
      {!isOpen && (
        <a href="#" onClick={toggleChatbot} style={{ textDecoration: 'none' }}>
          <button
            style={{
              fontSize: '24px',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              position: 'relative',
            }}
          >
            <span role="img" aria-label="Chatbot">🤖</span>
            <span
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px',
                visibility: 'hidden', // Initially hidden
                opacity: '0',
                transition: 'visibility 0s, opacity 0.2s linear',
              }}
            >
              Chat with AI bot
            </span>
          </button>
        </a>
      )}
      {isOpen && <Chatbot />}
    </div>
  );
};

export default ChatbotIcon;
