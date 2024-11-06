import { Menu, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { setIsDeleteMenu } from '../../redux/reducers/slice/misc';
import { useDispatch, useSelector } from 'react-redux';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useAsyncMutation } from '../../hooks';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api';
import { useNavigate } from 'react-router-dom';

const DeleteChatMenu = ({ deleteOptionAnchor }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux state for delete menu and selected chat
    const { isDeleteMenu, selectDeleteChat } = useSelector(state => state.misc);
    const { chatId, groupChat } = selectDeleteChat; // Extract chat details for deletion/leave action

    // Set up async mutations for deleting or leaving the chat/group
    const [deleteChat, __, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup, _, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

    // Navigate to home if deletion or leave group action completes
    useEffect(() => {
        if (deleteChatData || leaveGroupData) {
            navigate('/');
        }
    }, [deleteChatData, leaveGroupData]);

    // Close the delete options menu
    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteOptionAnchor.current = null;
    };

    // Handler for leaving a group
    const leaveGroupHandler = () => {
        leaveGroup("Group leaving", <ExitToAppIcon color='error' />, chatId);
        closeHandler();
    };

    // Handler for deleting a chat
    const deleteChatHandler = () => {
        deleteChat("Chat deleting...", <DeleteIcon color='error' />, chatId);
        closeHandler();
    };

    return (
        <Menu
            open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteOptionAnchor.current} // Anchors menu to the provided element
            anchorOrigin={{
                vertical: "center",
                horizontal: "center",
            }}
        >
            <Stack
                sx={{
                    width: "10rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={groupChat ? leaveGroupHandler : deleteChatHandler} // Conditionally triggers either leave or delete action
            >
                {
                    groupChat ? 
                        <>
                            <ExitToAppIcon />
                            <Typography>Leave Group</Typography>
                        </>
                        :
                        <>
                            <DeleteIcon />
                            <Typography>Delete Chat</Typography>
                        </>
                }
            </Stack>
        </Menu>
    );
}

export default DeleteChatMenu;
