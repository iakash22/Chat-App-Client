import { Avatar, Box, Icon, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AvatarCard from './AvatarCard';
import { getPeer } from '../../providers/Peer';
import { setCallMessage } from '../../redux/reducers/slice/call';
import { useDispatch, useSelector } from 'react-redux';
import { MicOff as MicOffIcon, } from '@mui/icons-material'
import CallDurationTimer from '../specific/CallDurationTimer';

const VideoPlayer = ({
    children,
    videoVisible = true,
    videoRef,
    name = "Jhon Deo",
    isCallReceive = true,
    audioEnabled = true,
    groupChat = false,
    avatar = [],
    callMessage,
    remoteAudio = true,
    callTimer = false,
}) => {
    // console.log(videoRef);
    const { callAccepted } = useSelector(state => state.call);
    return (
        <Box
            sx={{
                width: "100%",
                height: "50%",
                // border: "2px solid #6B8cff",
                borderRadius: children ? "10px 10px 0px 0px" : "0px 0px 10px 10px",
                overflow: "hidden",
                position: "relative",
                zIndex: 0,
            }}
        >
            <Stack
                direction={"row"}
                spacing={"1rem"}
                alignItems={"center"}
                justifyContent={callTimer ? "space-between" : "flex-start"}
                sx={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    width : "90%"
                }}
            >
                <Typography
                    variant='body1'
                    color={"#000"}
                    fontSize={"18px"}
                    fontWeight={600}
                >
                    {name}
                </Typography>

                {
                    callAccepted && !remoteAudio && (
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                                backgroundColor: "#6B8CFF",
                                boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgb(107, 140, 255, 0.45) 0px 6px 6px",
                            }}
                        >
                            <MicOffIcon
                                sx={{
                                    width: "14px"
                                }}
                            />
                        </div>
                    )
                }

                {callAccepted && callTimer && <CallDurationTimer />}
            </Stack>
            {
                <video
                    ref={videoRef}
                    style={{
                        width: "100%",
                        height: "auto",
                        minHeight: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        aspectRatio: "16 / 9",
                        display: videoVisible ? "block" : "none"
                    }}
                    playsInline
                    autoPlay
                    muted={!callAccepted}
                />
            }
            {!videoVisible && <VideoAvatar avatar={avatar} group={groupChat} callMessage={callMessage} />}
            {children && children}
        </Box>
    )
}

export default VideoPlayer

const VideoAvatar = ({ avatar, group, callMessage }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        let timerId;
        if (callMessage?.messageShowTime) {
            const time = callMessage?.messageShowTime || 0;
            timerId = setTimeout(() => {
                dispatch(setCallMessage({ message: "", error: "" }));
            }, time);
        }

        return () => {
            clearTimeout(timerId);
        }
    }, [callMessage]);
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e3e8fb",
                flexDirection: "column",
                gap: "1rem"
            }}
        >
            {
                group ?
                    <AvatarCard
                        avatar={avatar}
                        w='5rem'
                        h='5rem'
                    />
                    :
                    <Avatar
                        sx={{
                            width: "10rem",
                            height: "10rem",
                            color: "#fff",
                            backgroundColor: "#6B8cff",
                        }}
                        src={avatar[0]}
                    />
            }
            {
                callMessage?.message &&
                <Typography variant='body1' color={"#000"}>{callMessage?.message}</Typography>
            }
        </div>
    )
}