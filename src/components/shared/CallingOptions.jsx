import React, { useState } from 'react'
import { IconButton, Stack, styled, Tooltip } from '@mui/material'
import { tooltipClasses } from '@mui/material/Tooltip'
import {
    VideocamRounded as VideocamRoundedIcon,
    VideocamOffRounded as VideocamOffRoundedIcon,
    Call as CallIcon,
    CallEnd as CallEndIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
} from '@mui/icons-material'
import { getPeer } from '../../providers/Peer'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { setAudioEnabled, setCallMessage, setVideoEnabled } from '../../redux/reducers/slice/call'

const CallingOptions = ({ callerData }) => {
    const [params] = useSearchParams();
    const { user } = useSelector(state => state.auth);
    const { videoEnabled, audioEnabled, callAccepted, callDail } = useSelector(state => state.call);
    const callerIDs = callerData?.members.map(({ _id }) => _id);
    const { stream, myVideo, callUser, leaveCall, peer, videoHandler, controlsHandle, audioHandler } = getPeer();
    const dispatch = useDispatch();

    // const onMicHandler = () => {
    //     dispatch(setAudioEnabled(true));
    // }
    // const offMicHandler = () => {
    //     dispatch(setAudioEnabled(false));
    // }


    const CallingHandler = () => {
        const callType = params.get('video') === "true" ? "video" : "audio";
        const chatId = params.get('chatId') || callerData?._id;
        dispatch(setCallMessage({ message: `Calling..` }))
        callUser(user, callerIDs, callType, chatId);
    }

    const callHangUpHandler = async () => {
        dispatch(setCallMessage({ message: `Hang Up`, messageShowTime: "1000" }));
        await leaveCall(callerIDs, { message: `Hang Up`, error: "", messageShowTime: "1000" });
        // window.location.reload();
    }

    const audioToggleHandler = () => {
        if (callAccepted) {
            audioHandler(callerIDs);
        } else {
            dispatch(setAudioEnabled(!audioEnabled));
        }
    }

    const videoToggleHandler = () => {
        if (callAccepted) {
            videoHandler(callerIDs);
        } else {
            controlsHandle();
        }
    }

    return (
        <Stack
            sx={{
                position: "absolute",
                bottom: "5%",
                left: "50%",
                transform: "translateX(-50%)"
            }}
            spacing={"4rem"}
            direction={"row"}

        >
            {
                videoEnabled ?
                    <CallingButton
                        Icon={VideocamRoundedIcon}
                        title={"Video On"}
                        handler={videoToggleHandler}
                    />
                    :
                    <CallingButton
                        Icon={VideocamOffRoundedIcon}
                        title={"Video Off"}
                        handler={videoToggleHandler}
                    />
            }
            {(callDail || callAccepted) &&
                <CallingButton
                    Icon={CallEndIcon}
                    title={"Hang Up"}
                    bgColor='#FF0000'
                    IconColor='#FFF'
                    handler={callHangUpHandler}
                />
            }
            {
                !callAccepted && !callDail &&
                <CallingButton
                    Icon={CallIcon}
                    title={"Call"}
                    bgColor='#73EC8B'
                    IconColor='#FFF'
                    handler={CallingHandler}
                />
            }
            {
                audioEnabled ?
                    <CallingButton
                        Icon={MicIcon}
                        title={"Mic On"}
                        handler={audioToggleHandler}
                    />
                    :
                    <CallingButton
                        Icon={MicOffIcon}
                        title={"Mic Off"}
                        handler={audioToggleHandler}
                    />
            }
        </Stack>
    )
}

export default CallingOptions


const CallingButton = ({
    Icon,
    title,
    handler,
    IconColor = "#2d3648",
    bgColor = "#FFFFFF",
}) => {

    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent', // Background color
            color: '#2d3648',          // Text color
            fontWeight: "800",
            fontSize: 10,            // Font size
        },
    }));

    return (
        <CustomTooltip
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -10],
                            },
                        },
                    ],
                },
            }}
            title={title}
        >
            <button
                onClick={handler}
                style={{
                    backgroundColor: bgColor,
                    width: "50px",
                    height: "50px",
                    border: "none",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                }}
            >
                <Icon
                    sx={{
                        fontSize: "1.8rem",
                        color: IconColor,
                    }}

                />
            </button>
        </CustomTooltip>
    )
}