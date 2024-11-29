import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AvatarCard from './AvatarCard';
import { getPeer } from '../../providers/Peer';
import { setCallMessage } from '../../redux/reducers/slice/call';
import { useDispatch } from 'react-redux';

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
}) => {
    // console.log(videoRef);
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
            <Typography
                variant='body1'
                color={"#000"}
                sx={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    fontSize: "20px",
                    fontWeight: "600"
                }}
            >
                {name}
            </Typography>
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
                    muted={audioEnabled}
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