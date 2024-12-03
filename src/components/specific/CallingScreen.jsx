import { Box, Skeleton, Typography, useTheme } from '@mui/material'
import React, { memo } from 'react'
import VideoPlayer from '../shared/VideoPlayer';
import CallingOptions from '../shared/CallingOptions';
import { getPeer } from '../../providers/Peer';
import { useSelector } from 'react-redux';
import IncommingCallScreen from './IncommingCallScreen';

const CallingScreen = ({ myData, userData, isLoading }) => {
    const theme = useTheme();
    const { callerData, callReceive, videoEnabled, audioEnabled, callMessage, callAccepted, callEnded, userVideoEnabled, userAudioEnabled } = useSelector(state => state.call);
    // console.log(userAudioEnabled);
    const { myVideo, userVideo } = getPeer();
    // console.log(callReceive);
    const userName = userData?.members[0].name;
    return (
        <Box
            sx={{
                [theme.breakpoints.up('xs')]: {
                    display: "block",
                    color: "#fff",
                    width: "100%",
                    height: "100vh",
                    minHeight: "auto",
                },
                [theme.breakpoints.up('sm')]: { display: "none" }
            }}
        >
            {
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: !callReceive ? "flex" : "none",
                    flexDirection: "column",
                    gap: "2px"
                }}>
                    <VideoPlayer
                        videoRef={myVideo}
                        videoVisible={videoEnabled}
                        data={myData}
                        audioEnabled={audioEnabled}
                        name={myData.name}
                        avatar={[myData?.avatar?.url]}
                        callTimer={true}
                    />
                    {isLoading ? <Skeleton />
                        :
                        <VideoPlayer
                            videoRef={userVideo}
                            name={userName}
                            videoVisible={userVideoEnabled}
                            callMessage={callMessage}
                            groupChat={userData?.groupChat}
                            avatar={userData?.avatar}
                            remoteAudio={userAudioEnabled}
                        >
                            <CallingOptions callerData={userData} />
                        </VideoPlayer>
                    }

                </div>
            }
            {/* Incomming Screen  */}
            {
                callReceive && !callAccepted && callEnded && callerData &&
                <IncommingCallScreen />
            }

        </Box>
    )
}

export default memo(CallingScreen);