import { Drawer, Grid, Skeleton } from '@mui/material'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useErrors, useSocketEvents } from '../../hooks'
import { useMyChatsQuery } from '../../redux/api'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/slice/chat'
import { setIsDeleteMenu, setIsMobile, setOlineUsers, setSelectDeleteChat } from '../../redux/reducers/slice/misc'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USER, REFETCH_CHATS } from '../constants/events'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'
import Title from '../shared/Title'
import ChatList from '../specific/ChatList'
import Profile from '../specific/Profile'
import Header from './Header'

// Higher-order component to wrap a given component (WrappedComponent) with a layout
const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams();  // Get params from the URL (like chatId)
        const deleteMenuAnchor = useRef(null);  // Reference for the delete menu anchor
        const chatId = params.chatId;  // Extract chatId from URL
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const socket = getSocket();  // Get the socket instance
        const { isMobile } = useSelector(state => state.misc);  // Check if mobile layout is enabled
        const { user } = useSelector(state => state.auth);  // Get user data from Redux store
        const { newMessagesAlert } = useSelector(state => state.chat);  // Get new message alert data
        const { data, isLoading, isError, error, refetch } = useMyChatsQuery("");  // Fetch chat data from API
        useErrors([{ isError, error }]);  // Custom hook to handle errors

        // Refetch chats whenever the user changes
        useEffect(() => {
            refetch();
        }, [user]);

        // Function to handle chat deletion
        const handleDeleteChat = (e, chatId, groupChat) => {
            e.preventDefault();
            dispatch(setSelectDeleteChat({ chatId, groupChat }));  // Set the chat to be deleted in Redux store
            dispatch(setIsDeleteMenu(true));  // Open the delete menu
            deleteMenuAnchor.current = e.currentTarget;  // Set the anchor for the delete menu
        }

        // Function to close the mobile drawer
        const handleMobileClose = () => dispatch(setIsMobile(false));

        // Handle new message alerts from socket events
        const newMessagesAlertHandler = useCallback((data) => {
            if (data.chatId === chatId) return;  // Don't show alert for the current chat
            dispatch(setNewMessagesAlert(data));  // Set new message alert in Redux store
        }, [chatId]);

        // Handle new request notifications
        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification());  // Increment the notification count
        }, [dispatch]);

        // Refetch chat list based on socket events
        const refetchHandler = useCallback((data) => {
            refetch();  // Refetch chats
            // If the chatId matches the current user and chat, navigate to home
            if (data && (data?.chatId === chatId && data?.userId === user?._id)) {
                navigate('/');  // Navigate to home
            };
        }, [refetch, navigate]);

        // Handle online users data from socket events
        const onlineUsersHandler = useCallback((data) => {
            dispatch(setOlineUsers(data));  // Update online users in Redux store
        }, []);

        // Mapping socket event names to event handler functions
        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
            [NEW_REQUEST]: newRequestHandler,
            [REFETCH_CHATS]: refetchHandler,
            [ONLINE_USER]: onlineUsersHandler,
            // [START_TYPING]: typingHandler,  // Typing handler is commented out, can be added if needed
        };

        // Set up socket event listeners using custom hook
        useSocketEvents(socket, eventHandlers);

        return (
            <>
                <Title />  {/* Display page title */}
                <Header />  {/* Render the header */}
                <DeleteChatMenu deleteOptionAnchor={deleteMenuAnchor} />  {/* Render delete chat menu */}
                
                {/* Show loading skeleton while fetching chat data */}
                {
                    isLoading ? 
                        <Skeleton />  // Skeleton loader when data is loading
                        :
                        <Drawer open={isMobile} onClose={handleMobileClose}> {/* Mobile drawer for chat list */}
                            <ChatList
                                chats={data?.data}  // Pass fetched chats
                                w='70vw'  // Width for mobile drawer
                                chatId={chatId}  // Current chatId
                                newMessagesAlert={newMessagesAlert}  // Pass new messages alert data
                                handleDeleteChat={handleDeleteChat}  // Function to handle chat deletion
                            />
                        </Drawer>
                }

                {/* Main layout grid */}
                <Grid container height={"calc(100vh - 4rem)"}>
                    {/* Left side chat list for larger screens */}
                    <Grid item sm={4} md={3} height={"100%"} sx={{ display: { xs: "none", sm: "block" } }}>
                        {
                            isLoading ? 
                                <Skeleton />  // Skeleton loader for chat list
                                :
                                <ChatList
                                    chats={data?.data}  // Pass chats for larger screen
                                    chatId={chatId}  // Current chatId
                                    newMessagesAlert={newMessagesAlert}  // New messages alert data
                                    handleDeleteChat={handleDeleteChat}  // Handle delete chat action
                                />
                        }
                    </Grid>

                    {/* Main content area for displaying the WrappedComponent */}
                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} sx={{ backgroundColor: "rgba(0,0,0,0.1)" }}>
                        <WrappedComponent {...props} chatId={chatId} />  {/* Render wrapped component (chat content) */}
                    </Grid>

                    {/* Right side profile for larger screens */}
                    <Grid item md={4} lg={3} sx={{
                        display: { xs: "none", md: "block" },
                        bgcolor: "rgba(0,0,0,0.85)",
                        padding: "2rem",
                        color: "#FFF"
                    }} height={"100%"}>
                        <Profile />  {/* Render user profile */}
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default AppLayout;
