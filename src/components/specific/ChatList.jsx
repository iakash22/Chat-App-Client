import { Stack } from '@mui/material' // Importing Stack component for layout
import React from 'react'
import ChatItem from '../shared/ChatItem' // Importing ChatItem component to display individual chats
import { useSelector } from 'react-redux' // Importing useSelector hook to access Redux state

const ChatList = ({
    w = "100%", // Default width is 100%, can be overridden by props
    chats = [], // Array of chat data passed as prop
    chatId, // ID of the current active chat
    newMessagesAlert = [ // Array to track new message alerts for each chat
        {
            chatId: "", // Chat ID to match
            count : 0, // Count of new messages
        }
    ],
    handleDeleteChat, // Function to handle chat deletion
}) => {
    const { onlineUsers } = useSelector(state => state.misc); // Accessing the onlineUsers state from Redux

    return (
        <Stack width={w} direction={"column"} height={"100%"} overflow={"auto"} bgcolor={"#373A40"} >
            {
                // Iterating through chats to display each chat item
                chats.map((data, index) => {
                    const { name, avatar, _id, groupChat, members } = data; // Destructuring chat data
                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === _id // Finding new message alerts for the current chat
                    );
                    // Checking if any member of the chat is online by matching with onlineUsers
                    const isOnline = members?.some((member) => onlineUsers.includes(member));
                    return (
                        // Rendering ChatItem for each chat with necessary props
                        <ChatItem
                            index={index}
                            name={name}
                            avatar={avatar}
                            groupChat={groupChat}
                            isOnline={isOnline}
                            newMessageAlert={newMessageAlert}
                            _id={_id}
                            key={_id}
                            sameSender={chatId === _id} // Comparing if current chat is the active chat
                            handleDeleteChat={handleDeleteChat} // Passing the delete function
                        />
                    )
                })
            }
        </Stack>
    )
}

export default ChatList;
