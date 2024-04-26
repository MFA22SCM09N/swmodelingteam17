
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Modal } from '@mui/material';

function BotModal({ openModal, handleCloseModal }) {
    // const handleMouseOver = () => {
    //     // Logic for mouse over event
    //     // For example: set some state or update some variables
    // };

    // const handleMouseOut = () => {
    //     // Logic for mouse out event
    //     // For example: reset the state or variables changed on mouse over
    // };

    return (<>

        <Modal
            open={openModal}
            onClose={handleCloseModal}
        // aria-labelledby="simple-modal-title"
        // aria-describedby="simple-modal-description"

        // style={{
        //     position: "fixed", bottom: "0",
        //     right: "0",
        //     width: "25%",
        //     bgcolor: "grey",
        //     boxShadow: "0px 6px 6px -3px rgba(0,0,0,0.1)",
        //     borderRadius: "20px",
        //     border: "1px solid gray",
        //     className: "iframe-container",
        //     display: "flex",
        //     justifyContent: "flex-end",
        //     alignItems: "center"
        // }}

        >
            <Box
                position="fixed"

                bottom="0"
                right="0"
                width="25%"
                bgcolor="grey"
                boxShadow="0px 6px 6px -3px rgba(0,0,0,0.1)"
                borderRadius="20px"
                border="1px solid gray"
                className="iframe-container"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"

            >
                <iframe id="PIRXVRKOJB" loading="eager" src="https://embed.pickaxeproject.com/axe?id=SportSync_Your_Personal_Sports_Data_Concierge_Y9JRT&mode=embed_gold&host=beta&theme=light&opacity=100&font_header=Real+Head+Pro&size_header=30&font_body=Real+Head+Pro&size_body=16&font_labels=Real+Head+Pro&size_labels=14&font_button=Real+Head+Pro&size_button=16&c_fb=FFFFFF&c_ff=FFFFFF&c_fbd=888888&c_bb=228DD7&c_bt=FFFFFF&c_t=000000&s_ffo=100&s_bbo=100&s_f=minimalist&s_b=filled&s_t=2&s_to=1&s_r=2"
                    width="100%"
                    height="750px"
                    // onMouseOver={handleMouseOver}
                    // onMouseOut={handleMouseOut}
                    style={{
                        border: '1px solid rgba(0, 0, 0, 1)',
                        // transition: '.3s',
                        marginRight: '10%',
                        // marginBlock: '20%',
                        marginBottom: "10%",
                        borderRadius: "4px"
                    }}></iframe>
                {/* <iframe
                    id='YQPUBKKQYP'
                    title='Chatbot IFrame'
                    loading="eager"
                    src="https://embed.pickaxeproject.com/axe?id=SportSync_Your_Personal_Sports_Data_Concierge_Y9JRT&mode=embed_gold&host=beta&theme=light&opacity=100&font_header=Real+Head+Pro&size_header=30&font_body=Real+Head+Pro&size_body=16&font_labels=Real+Head+Pro&size_labels=14&font_button=Real+Head+Pro&size_button=16&c_fb=FFFFFF&c_ff=FFFFFF&c_fbd=888888&c_bb=228DD7&c_bt=FFFFFF&c_t=000000&s_ffo=100&s_bbo=100&s_f=minimalist&s_b=filled&s_t=2&s_to=1&s_r=2"
                    width="100%"
                    height="750px"
                    // onMouseOver={handleMouseOver}
                    // onMouseOut={handleMouseOut}
                    style={{
                        border: '1px solid rgba(0, 0, 0, 1)',
                        // transition: '.3s',
                        marginRight: '10%',
                        // marginBlock: '20%',
                        marginBottom: "10%",
                        borderRadius: "4px"
                    }}
                ></iframe> */}
            </Box>
        </Modal >
    </>
    );
}

export default BotModal;
