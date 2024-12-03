import {
    Lock as LockIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Settings as SettingsIcon,
    Videocam as VideoIcon,
    VideocamOff as VideoOffIcon,
    VolumeUp as VolumeUpIcon
} from '@mui/icons-material';
import { Box, Button, Container, IconButton, Skeleton, SvgIcon, Typography } from '@mui/material';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Peer from 'simple-peer/simplepeer.min.js';
import { CALL_USER } from '../components/constants/events';
import AvatarCard from '../components/shared/AvatarCard';
import { useErrors, useSocketEvents } from '../hooks';
import { getSocket } from '../providers/socket';
import { useGetChatMembersQuery } from '../redux/api';
import { setCallerData, setCallReceive } from '../redux/reducers/slice/call';
import INCOMING_RING from '../assets/ring_mp3/incoming_ring.mp3';
import OUTGOING_RING from '../assets/ring_mp3/outgoing_ring.mp3'
import CallingScreen from '../components/specific/CallingScreen';
import { askMediaPermission } from '../libs/features';
import { getPeer } from '../providers/Peer';
import CallingScreenTemp from '../temp/CallingScreenTemp';

const Call = () => {
    const [params] = useSearchParams();
    const chatId = params.get('chatId') || null;
    const { user } = useSelector(state => state.auth);
    const { videoEnabled, audioEnabled } = useSelector(state => state.call);
    const dispatch = useDispatch();
    const { data, isLoading, error, isError } = useGetChatMembersQuery(chatId, { skip: !chatId });
    // console.log(data);
    const { startMedia, myVideo, mediaPermission,
        setMediaPermission, stream,
    } = getPeer();
    const friendUser = data?.data;

    // const toggleAudio = () => {
    //     if (stream) {
    //         const audioTrack = stream.getAudioTracks()[0];
    //         if (audioTrack) {
    //             audioTrack.enabled = !audioTrack.enabled;
    //             setAudioEnabled(audioTrack.enabled);
    //         }
    //     }
    //     // console.log(audioEnabled);
    // };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: videoEnabled,
            audio: true,
        })
            .then((currStream) => {
                startMedia(currStream);
            });


        if (!mediaPermission) {
            askMediaPermission(videoEnabled, audioEnabled, startMedia, setMediaPermission);
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [myVideo.current]);
    //     console.log("Answer call");
    //     dispatch(setCallAccept(true));

    //     const peer = new Peer({ stream });

    //     peer.on('signal', (data) => {
    //         console.log(data);
    //         socket.emit('ANSWER_CALL', { signal: data, to: callerData.callerId });
    //     });

    //     // peer.on('signal', (currentStream) => {
    //     //     console.log(currentStream);
    //     //     userVideo.current.srcObject = currentStream;
    //     // });

    //     connectionRef.current = peer;
    // };


    // const handlers = {
    //     [CALL_USER]: callUserHandler,
    // }

    // useSocketEvents(socket, handlers);
    useErrors([{ error, isError }]);

    return !mediaPermission ? (
        <CameraBlocked />
    ) : 
        <Container
            sx={{
                width: "100vw",
                height: '100vh',
                bgcolor: '#FFFFFF',
                padding: "0px",
                margin: "0px",
            }}
        >
            <CallingScreen myData={user} userData={friendUser} isLoading={isLoading} />

            {/* <CallingScreenTemp callerData={friendUser} /> */}
        </Container>
// {
//         // <Box
//         //     sx={{
//         //         display: 'flex',
//         //         justifyContent: 'center',
//         //         alignItems: 'center',
//         //         height: '100vh',
//         //         bgcolor: 'black',
//         //         padding: "1rem",
//         //         flexDirection: "column",
//         //         gap: "1rem"
//         //     }}
//         // >
//         //     {/* Video Call Section */}
//         //     <Box
//         //         sx={{
//         //             flex: 1,
//         //             display: 'flex',
//         //             flexDirection: 'column',
//         //             alignItems: 'center',
//         //             justifyContent: 'center',
//         //             bgcolor: '#333',
//         //             height: '100%',
//         //             width: "100%",
//         //             borderRadius: 2,
//         //             overflow: "hidden"
//         //             // marginRight: 2,
//         //         }}
//         //     >
//         //         {
//         //             !videoEnabled &&
//         //             <>
//         //                 <VideoOffIcon sx={{ fontSize: 50, color: '#888' }} />
//         //                 <Typography color="white" mt={1}>
//         //                     Camera off
//         //                 </Typography>
//         //             </>
//         //         }

//         //         <video
//         //             playsInline
//         //             ref={myVideo}
//         //             autoPlay
//         //             muted={!audioEnabled}
//         //             style={{
//         //                 margin: "0 1rem",
//         //                 width: "100%",
//         //             }}
//         //         />
//         //         {callAccept && !callEnded && <video
//         //             playsInline
//         //             ref={userVideo}
//         //             autoPlay
//         //             muted={!audioEnabled}
//         //             style={{
//         //                 margin: "0 1rem",
//         //                 width: "100%",
//         //             }}
//         //         />}

//         //         <Box
//         //             sx={{
//         //                 display: 'flex',
//         //                 justifyContent: 'center',
//         //                 mt: 'auto',
//         //                 mb: 2,
//         //             }}
//         //         >
//         //             <IconButton onClick={toggleVideo}>
//         //                 {videoEnabled ? <VideoIcon sx={{ color: 'white' }} /> : <VideoOffIcon sx={{ color: 'white' }} />}
//         //             </IconButton>
//         //             <IconButton onClick={toggleAudio}>
//         //                 {audioEnabled ? <MicIcon sx={{ color: 'white' }} /> : <MicOffIcon sx={{ color: 'white' }} />}
//         //             </IconButton>
//         //             <IconButton>
//         //                 <VolumeUpIcon sx={{ color: 'white' }} />
//         //             </IconButton>
//         //             <IconButton>
//         //                 <SettingsIcon sx={{ color: 'white' }} />
//         //             </IconButton>
//         //         </Box>
//         //     </Box>

//         //     {/* Profile Section */}
//         //     {
//         //         callReceive ?
//         //             <CallDailCard
//         //                 avatar={[callerData?.callerAvatar]}
//         //                 name={callerData.callerName}
//         //                 callHandler={answerCall}
//         //                 // ringTone={INCOMING_RING}
//         //                 calling={true}
//         //                 callType={callerData.callType}
//         //                 callAnswer={answerCall}
//         //             />
//         //             :
//         //             isLoading ? <Skeleton />
//         //                 :
//         //                 <CallDailCard
//         //                     avatar={friendUser?.avatar}
//         //                     name={friendUser?.groupChat ? friendUser?.name : friendUser?.members[0].name}
//         //                     callHandler={callUser}
//         //                     // ringTone={OUTGOING_RING}
//         //                     calling={calling}
//         //                 />
//         //     }
//         // </Box>
//     );
// }
};

export default Call

const CameraBlocked = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'black',
                color: 'white',
                textAlign: 'center',
            }}
        >
            <Box sx={{ mb: 2 }}>
                <SvgIcon
                    component={LockIcon}
                    sx={{
                        fontSize: 80,
                        color: '#3f51b5',
                        mb: 1,
                    }}
                />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                You&apos;ve blocked access to your camera
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300, mb: 2 }}>
                To allow access, click the lock icon <LockIcon fontSize="small" /> in the address bar. Select the Allow option for Camera. Then reload the page for the new settings to take effect.
            </Typography>
            <Button
                variant="contained"
                sx={{ bgcolor: '#3f51b5', color: 'white', mb: 3 }}
                onClick={() => window.location.reload()}
            >
                Reload page
            </Button>
        </Box>
    );
};

const CallDailCard = memo(({ avatar, name, calling, callHandler, callAnswer, callLeave, ringTone, callType }) => {
    const audioRef = useRef(null);
    const dispatch = useDispatch();
    const { callReceive } = useSelector(state => state.call);

    // useEffect(() => {
    //     // Play the ringtone when the notification is displayed
    //     if (audioRef.current) {
    //         audioRef.current.play();

    //         const ringtoneDuration = 30000; // 30 seconds
    //         const timer = setTimeout(() => {
    //             if (audioRef.current) {
    //                 audioRef.current.pause();
    //                 dispatch(setCalling(false));
    //                 dispatch(setCallReceive(false));
    //                 dispatch(setCallerData(null));
    //                 audioRef.current.currentTime = 0;
    //             }
    //         }, ringtoneDuration);


    //         return () => {
    //             clearTimeout(timer);
    //             // Pause the ringtone when the notification is removed
    //             if (audioRef.current) {
    //                 audioRef.current.pause();
    //                 audioRef.current.currentTime = 0;
    //             }
    //         };
    //     }
    // }, [audioRef.current, calling]);
    return (
        <Box
            sx={{
                width: {
                    md: "80%",
                    xs: "100%"
                },
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "space-around",
                bgcolor: '#333',
                padding: 2,
                borderRadius: 2,
            }}
        >
            {
                // calling && <audio ref={audioRef} loop >
                //     <source src={ringTone} type="audio/mp3" />
                //     Your browser does not support the audio element.
                // </audio>
            }
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <AvatarCard
                    avatar={avatar}
                />
                <Typography variant="h6" color="white" mt={2}>
                    {name}
                </Typography>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Typography color="gray" mt={1}>
                    {callReceive ? `Take a ${callType} call` : calling ? `Calling to ${name}` : "Ready to call?"}
                </Typography>
                {
                    callReceive ?
                        (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    gap: "0 0.5rem",
                                    alignItems: "center"
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={callAnswer}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ mt: 2 }}
                                    onClick={callLeave}
                                >
                                    Reject
                                </Button>
                            </Box>
                        )
                        :
                        (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={callHandler}
                                disabled={calling}
                            >
                                {calling ? "Calling..." : "Start call"}
                            </Button>
                        )
                }
            </div>
        </Box>
    )
});