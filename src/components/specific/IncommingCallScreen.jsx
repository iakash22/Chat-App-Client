import React from 'react'
import { Box, Button, Typography, Avatar, IconButton, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { getPeer } from '../../providers/Peer';
import { useSelector } from 'react-redux';
import { IncommingCallContainer } from '../styles/StyleComponents';
import { Close as CloseIcon, Videocam as VideocamIcon, MessageOutlined as MessageOutlinedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const IncommingCallScreen = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { callerData } = useSelector(state => state.call);
    const { answerCall, leaveCall } = getPeer();
    const { callerName, callType, callerAvatar, callerId, signal, chatId } = callerData;
    const CallerIDs = [callerData?.callerId];

    const redirectReplyHandler = () => {
        // Leave Call
        leaveCall(CallerIDs, { message: "Busy", error: "", messageShowTime: 1000, });
        //Replay message
        const url = `/chat/${chatId}`;
        navigate(url);
    }

    const callRejectHandler = () => {
        console.log("callRejectHandler");
        leaveCall(CallerIDs, { message: "Call Reject", error: "", messageShowTime: 1000, });
    }

    const callAcceptedHandler = () => {
        console.log("callAcceptedHandler");
        answerCall(callerData?.callerId, callerData.signal);
        // answerCall(callerId, signal);
    }

    return (
        <IncommingCallContainer
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
                "&::before": {
                    backgroundImage: `url('${callerAvatar}')`
                }
            }}
        >
            {/* Call Title */}

            {/* Profile Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    component={motion.div}
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    sx={{
                        fontSize: 18,
                        marginTop: 10,
                        marginBottom: 3,
                        fontWeight: 500,
                    }}
                >
                    Incomming {callType === "video" ? "Video" : "Voice"} Call
                </Typography>
                <Avatar
                    src={callerAvatar} // Replace with actual image path
                    alt={`${callerName}-Caller`}
                    sx={{
                        width: 100,
                        height: 100,
                        marginBottom: 1,
                    }}
                />
                <Typography sx={{ fontSize: 20 }}>{callerName}</Typography>
            </Box>


            {/* Reply Button */}
            <Box
                component={motion.div}
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    gap: "0.1rem",
                    textAlign: "center",
                    backgroundColor: "rgba(127,127,127,0.47)",
                    color: "#fff",
                    borderRadius: "2rem",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(57,57,57,0.47)", transition: "all 0.2s ease-in" },
                }}
                onClick={redirectReplyHandler}
            >
                <MessageOutlinedIcon sx={{ fontSize: "1.2rem", }} />
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, }} >Reply</Typography>
            </Box>

            {/* Action Buttons */}
            <Box
                component={motion.div}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                    maxWidth: "70%",
                    marginBottom: 2,
                }}
            >
                {/* Decline Button */}
                <IconButton
                    variant="contained"
                    sx={{
                        [theme.breakpoints.up('xs')]: {
                            width: 70,
                            height: 70,
                        },
                        backgroundColor: "#C62E2E",
                        "&:hover": { backgroundColor: "#FF0000" },
                        borderRadius: "50%",
                    }}
                    onClick={callRejectHandler}
                >
                    <CloseIcon
                        sx={{
                            color: "#fff",
                            fontSize: "2rem"
                        }}
                    />
                </IconButton>

                {/* Answer Button */}
                <IconButton
                    variant="contained"
                    onClick={callAcceptedHandler}
                    sx={{
                        [theme.breakpoints.up('xs')]: {
                            width: 70,
                            height: 70,
                        },
                        backgroundColor: "#1dd055",
                        "&:hover": { backgroundColor: "#49FF00" },
                        borderRadius: "50%",
                    }}
                >
                    <VideocamIcon
                        sx={{
                            color: "#fff",
                            fontSize: "2rem"
                        }}
                    />
                </IconButton>
            </Box>
        </IncommingCallContainer>
    )
}

export default IncommingCallScreen