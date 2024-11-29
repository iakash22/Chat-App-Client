import React from 'react'
import VideoPlayer from '../components/shared/VideoPlayer'
import { getPeer } from '../providers/Peer'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CallingScreenTemp = (props) => {
    const [params] = useSearchParams();
    const { user } = useSelector(state => state.auth);
    const { callReceive, callerData } = useSelector(state => state.call);
    const { myVideo, userVideo, callAccepted, callEnded, callUser, answerCall, leaveCall, userVideoEnabled, callDial } = getPeer();
    const callerIDs = props.callerData?.members.map(({ _id }) => _id);
    console.log(callerData?.signal);
    const callUserHandler = () => {
        const callType = params.get('video') === "true" ? "video" : "audio";
        const chatId = params.get('chatId') || props.callerData?._id;
        callUser(user, callerIDs, callType, chatId);
    }
    const answerCallHandler = () => {
        answerCall(callerData?.callerId, callerData.signal);
    }
    const leaveCallHandler = () => {
        console.log(callerData);
        leaveCall([callerData?.callerId], {});
    }
    console.log(callAccepted);
    return (
        <div>
            <VideoPlayer videoRef={myVideo} audioEnabled={true} videoVisible={true} />
            <VideoPlayer videoRef={userVideo} videoVisible={userVideoEnabled} />

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
            }}>
                {
                    !callDial && !callAccepted &&
                    <button
                        style={{
                            padding: "12px"
                        }}
                        onClick={callUserHandler}
                    >
                        Call
                    </button>
                }
                {
                    callAccepted &&
                    <button
                        style={{
                            padding: "12px"
                            }}
                            onClick={leaveCallHandler}
                    >
                        Hang up
                    </button>
                }
            </div>

            {
                callReceive && callerData && (
                    <div >
                        <p>Call from {callerData.callerName}</p>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "5px",
                        }}>
                            <button style={{
                                padding: "12px"
                            }}
                                onClick={answerCallHandler}
                            >
                                Answer Call
                            </button>
                            <button style={{
                                padding: "12px"
                            }}
                                onClick={leaveCallHandler}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CallingScreenTemp