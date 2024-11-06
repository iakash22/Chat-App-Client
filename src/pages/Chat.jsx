import { useInfiniteScrollTop } from '6pp'; // Custom hook for infinite scrolling
import { AttachFile as AttachFileIcon, Send as SendIcon, } from '@mui/icons-material'; // Icons for file attachment and sending message
import { IconButton, Skeleton, Stack } from '@mui/material'; // Material UI components for layout and skeleton loader
import React, { useCallback, useEffect, useRef, useState } from 'react'; // React hooks and components
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks for state management
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../components/constants/events'; // Event constants for socket communication
import FileMenu from '../components/dialogs/FileMenu'; // File menu component
import AppLayout from '../components/layouts/AppLayout'; // Layout component
import { TypingLoader } from '../components/layouts/Loaders'; // Typing loader component to show typing indicator
import MessageComponent from '../components/shared/MessageComponent'; // Message component to display messages
import { InputBox } from '../components/styles/StyleComponents'; // Styled input box component
import { useErrors, useSocketEvents } from '../hooks'; // Custom hooks for handling errors and socket events
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api'; // Redux API hooks for fetching chat details and messages
import { removeNewMessagesAlert } from '../redux/reducers/slice/chat'; // Redux action to remove new message alert
import { setIsFileMenu } from '../redux/reducers/slice/misc'; // Redux action to toggle file menu visibility
import { getSocket } from '../socket'; // Socket connection setup

const Chat = ({ chatId }) => {
    // State hooks for message input, messages, and typing status
    const [message, setMessage] = useState("");
    const [messagesData, setMessagesData] = useState([]);
    const [page, setPage] = useState(1);
    const [isTyping, setIsTyping] = useState(false);
    const [usertyping, setUserTyping] = useState(false);

    // Refs for handling scroll, file menu, and bottom element
    const typingTimeout = useRef(null);
    const containerRef = useRef(null);
    const fileMenuRef = useRef(null);
    const bottomRef = useRef(null);

    // Dispatch and navigate hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Socket connection setup
    const socket = getSocket();

    // Redux state for the current user
    const { user } = useSelector(state => state.auth);

    // Fetch chat details and messages using Redux API hooks
    const chatData = useChatDetailsQuery({ chatId, skip: !chatId });
    const members = chatData?.data?.chat?.members;
    const oldMessagesDataChunk = useGetMessagesQuery({ chatId, page });

    // Infinite scroll hook to load older messages
    const { data: oldMessages, setData: setOldMessages } =
        useInfiniteScrollTop(
            containerRef,
            oldMessagesDataChunk?.data?.totalPages,
            page,
            setPage,
            oldMessagesDataChunk?.data?.data,
        );

    // Handle message input change and typing status
    const messageChangeHandler = (e) => {
        setMessage(e.target.value);

        // Emit start typing event when the user starts typing
        if (!isTyping) {
            socket.emit(START_TYPING, { members, chatId });
            setIsTyping(true);
        }

        // Clear the timeout if typing is happening again
        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        // Set timeout to stop typing after a delay
        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit(STOP_TYPING, { members, chatId });
        }, [2000])
    }

    // Handle message submit event (sending the message)
    const submitHandler = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            return;
        }
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage("");
    }

    useEffect(() => {
        // Emit chat joined event when chat is loaded
        if (chatData?.data) {
            socket.emit(CHAT_JOINED, { userId: user?._id, members: members || [] });
        }

        // Remove new messages alert
        dispatch(removeNewMessagesAlert(chatId));

        return () => {
            // Cleanup on component unmount
            setMessage("");
            setMessagesData([]);
            setOldMessages([]);
            setPage(1);
            socket.emit(CHAT_LEAVED, { userId: user?._id, members: members || [] });
        }
    }, [chatId, chatData?.data]);

    // Scroll to bottom whenever new messages are added
    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messagesData]);

    // Redirect to homepage if chat data fetch fails
    useEffect(() => {
        if (chatData.isError) {
            navigate('/');
        }
    }, [chatData.isError]);

    // Handle new messages from socket
    const newMessagesHandler = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setMessagesData(prev => [...prev, data.message]);
    }, [chatId]);

    // Handle typing start event
    const startTypingHandler = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setUserTyping(true);
    }, [chatId]);

    // Handle typing stop event
    const stopTypingHandler = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setUserTyping(false);
    }, [chatId]);

    // Handle alerts in chat
    const alertHandler = useCallback((data) => {
        const messageForAlert = {
            chat: chatId,
            sender: {
                _id: "user._id",
                name: "Admin",
            },
            content: data.message,
            createdAt: new Date().toISOString()
        }
        if (chatId === data.chatId) {
            setMessagesData(prev => [...prev, messageForAlert]);
        }
    }, [chatId]);

    // Error handling for chat and messages
    const errors = [
        {
            isError: chatData?.isError,
            error: chatData.error,
        },
        {
            isError: oldMessagesDataChunk?.isError,
            error: oldMessagesDataChunk.error,
        },
    ];

    // All messages, including old messages and new ones
    const allMessages = [...oldMessages, ...messagesData];

    // Event handlers for socket events
    const eventHandlers = {
        [NEW_MESSAGE]: newMessagesHandler,
        [START_TYPING]: startTypingHandler,
        [STOP_TYPING]: stopTypingHandler,
        [ALERT]: alertHandler,
    };

    // Use custom hooks for handling errors and socket events
    useErrors(errors);
    useSocketEvents(socket, eventHandlers);

    // Open the file menu
    const handlFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
    }

    return (
        chatData.isLoading ?
            <Skeleton /> // Display a loading skeleton if chat data is loading
            :
            <>
                {/* Message container */}
                <Stack
                    ref={containerRef}
                    boxSizing={"border-box"}
                    padding={"1rem"}
                    spacing={"1rem"}
                    height={"90%"}
                    bgcolor={"rgba(247,247,247,1)"}
                    sx={{
                        overflowX: "hidden",
                        overflowY: "auto"
                    }}
                    className='message-container'
                >
                    {
                        // Display all messages
                        allMessages.map((message, index) => (
                            <MessageComponent
                                message={message}
                                user={user}
                                key={index}
                            />
                        ))
                    }

                    {/* Show typing loader if someone is typing */}
                    {usertyping && <TypingLoader />}

                    <div ref={bottomRef} />
                </Stack>

                {/* Message input form */}
                <form
                    style={{
                        height: "10%",
                    }}
                    onSubmit={submitHandler}
                >
                    <Stack
                        direction={"row"}
                        height={"100%"}
                        padding={"1rem"}
                        alignItems={"center"}
                        position={"relative"}
                    >
                        {/* File attachment button */}
                        <IconButton
                            sx={{
                                position: "absolute",
                                left: "1.5rem",
                                rotate: "30deg"
                            }}
                            ref={fileMenuRef}
                            onClick={handlFileOpen}
                        >
                            <AttachFileIcon />
                        </IconButton>

                        {/* Message input box */}
                        <InputBox
                            placeholder='Type message here...'
                            value={message}
                            onChange={messageChangeHandler}
                        />

                        {/* Send message button */}
                        <IconButton
                            type='submit'
                            sx={{
                                backgroundColor: "#ea7070",
                                color: "white",
                                marginLeft: "1rem",
                                padding: "0.5rem",
                                "&:hover": {
                                    bgcolor: "error.dark"
                                }
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </form>

                {/* File menu dialog */}
                <FileMenu
                    anchorE1={fileMenuRef.current}
                    chatId={chatId}
                />
            </>
    )
}

export default AppLayout()(Chat);
