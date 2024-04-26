import React, { useState } from 'react';
import Chatbot from './Chatbot';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import BotModal from './BotModal';
import { IconButton } from '@mui/material';
import AssistantRoundedIcon from '@mui/icons-material/AssistantRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

const BotIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
            {!isOpen && (
                // <Button
                //     variant="contained"
                //     color="primary"

                //     onClick={handleOpenModal}
                //     style={{
                //         position: 'relative', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.7)',
                //         color: '#fff',
                //     }}
                // >
                // <Button variant="contained" onClick={handleOpenModal} startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 40 }} />}>

                <IconButton aria-label='assistant' onClick={handleOpenModal} size='large'>
                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 40 }} />

                    {/* <span role="img" aria-label="Chatbot">🤖</span> */}
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
                    </span>
                </IconButton>


            )
            }
            {isModalOpen && <BotModal openModal={isModalOpen} handleCloseModal={handleCloseModal}></BotModal>}
        </div >
    );
};

export default BotIcon;