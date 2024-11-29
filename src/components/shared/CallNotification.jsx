import React, { memo, useEffect, useRef } from "react";
import { Button, Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCallerData, setCallReceive, setHideCallNotification } from "../../redux/reducers/slice/call";
import INCOMING_RING from '../../assets/ring_mp3/incoming_ring.mp3';
import { getPeer } from "../../providers/Peer";

const CallNotification = ({ }) => {
    const { callerData } = useSelector(state => state.call);
    const disptach = useDispatch();
    const audioRef = useRef(null);
    const { leaveCall } = getPeer();

    useEffect(() => {
        // Play the ringtone when the notification is displayed
        if (audioRef.current) {
            audioRef.current.play();

            const ringtoneDuration = 25000; // 10 seconds
            const timer = setTimeout(() => {
                if (audioRef.current) {
                    // onReject();
                    audioRef.current.currentTime = 0;
                }
            }, ringtoneDuration);


            return () => {
                clearTimeout(timer);
                // Pause the ringtone when the notification is removed
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            };
        }
    }, [audioRef.current]);

    const onDismiss = (e) => {
        audioRef.current.pause();
        disptach(setHideCallNotification(true));
    }

    const onReject = () => {
        const CallerIDs = [callerData?.callerId];
        leaveCall(CallerIDs, { message: "Call Reject", error: "", messageShowTime: 1000, });
        audioRef.current.pause();
    }
    const onAccept = () => {
        console.log("Accept")
        audioRef.current.pause();
        const videoCall = callerData.callType === "video" ? true : false;
        const url = `/call/?video=${videoCall}`
        window.open(url, "_blank")
    }

    const handle = (e) => {
        console.log(e);
    }

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: -200, bottom: 0 }}
            onDragEnd={(event, info) => {
                // Check if the user dragged up beyond a threshold
                // console.log(info.point.y);
                if (info.point.y < 80) {
                    onDismiss();
                }
            }}
            initial={{ y: 0 }}
            animate={{ y: 75 }}
            exit={{ y: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
                position: "fixed",
                top: -10,
                left: 20,
                right: 20,
                zIndex: 10000,
                transition: "all 0.4s ease",
                cursor: "pointer"
            }}
        >
            <audio ref={audioRef} loop >
                <source src={INCOMING_RING} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
            <Box
                sx={{
                    backgroundColor: "#2c2c3e",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <Avatar
                    src={callerData?.callerAvatar}
                    alt="Caller"
                    sx={{ width: 50, height: 50 }}
                />
                <Box>
                    <Typography variant="subtitle2" color="#fff">
                        Incoming {callerData?.callType} Call...
                    </Typography>
                    <Typography variant="h6" color="#fff">
                        {callerData?.callerName}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        marginLeft: "auto",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "#4CAF50",
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        📞
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: "#F44336",
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                        onClick={onReject}
                    >
                        ✖️
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

export default memo(CallNotification);
