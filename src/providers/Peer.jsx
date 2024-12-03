import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from 'simple-peer/simplepeer.min.js';
import { useSocketEvents } from "../hooks";
import {
    setCallAccepted,
    setCallEnded,
    setCallerData,
    setCallReceive,
    setHideCallNotification,
    setUserVideoEnabled,
    setCallDial,
    setCallMessage,
    setVideoEnabled,
    setAudioEnabled,
    setUserAudioEnabled,
} from '../redux/reducers/slice/call';
import { getSocket } from "./socket";

const PeerContext = createContext(null);
export const getPeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const { videoEnabled } = useSelector(state => state.call);
    const [mediaPermission, setMediaPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const { socket } = getSocket();
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef(null);
    const dispatch = useDispatch();

    const createStream = async (videoMedia, audioMedia, type) => {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: audioMedia, video: videoMedia });
        if (type === "video") {
            const videoTrack = newStream.getVideoTracks()[0];
            return videoTrack;
        } else if (type === "audio") {
            const audioTrack = newStream.getAudioTracks()[0];
            return audioTrack;
        } else {
            const tracks = newStream.getTracks();
            return tracks;
        }
    }

    const createPeerInstance = (initiator, trickle, stream) => {
        if (connectionRef.current && !connectionRef.current.destroyed) {
            // If there's already a connection, just return the existing peer connection
            console.log("Reusing existing peer connection.");
            return connectionRef.current;
        }

        // Create a new peer connection if no active connection exists
        const peer = new Peer({ initiator, trickle, stream });
        connectionRef.current = peer;

        peer.on('connect', () => {
            console.log('Peer connection established.');
        });

        peer.on('track', (track, currentStream) => {
            // console.log("Track", currentStream.getTracks()[0].id);
        })

        peer.once('close', () => {
            console.log("Peer connection closed");
            // Clean up state and references
            dispatch(setCallEnded(true));
            peer.removeAllListeners('close')
            connectionRef.current = null;
        });

        return peer;
    }

    const handlePeerError = (err) => {
        console.error("Peer error:", err);
        connectionRef.current?.destroy();
        connectionRef.current = null;
        dispatch(setCallEnded(true));
    };

    const startMedia = (currStream) => {
        if (currStream) {
            setMediaPermission(true);
            setStream(currStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currStream;
            }
        }
    }

    const enbaleStreamTrack = async (enable) => {
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        if (videoTrack.readyState === "ended" && audioTrack.readyState === "ended"
            ||
            !videoTrack.enabled && !audioTrack.enabled) {
            const tracks = await createStream(true, true);
            stream.removeTrack(videoTrack);
            stream.removeTrack(audioTrack);
            tracks.forEach((track) => {
                stream.addTrack(track);
            });
            const newVideoTrack = stream.getVideoTracks()[0];
            newVideoTrack.enabled = enable;
        }
    }

    const controlesHandlerWithOutAcceptCall = async () => {
        if (stream) {
            if (videoEnabled) {
                stream.getTracks().forEach((track) => {
                    track.enabled = false;
                    track.stop();
                })
                myVideo.current.style.display = "none";
                dispatch(setVideoEnabled(false));
            } else {
                enbaleStreamTrack(true);
                myVideo.current.style.display = "block";
                dispatch(setVideoEnabled(true));
            }
        }
    }

    const videoHandler = async (callerIDs = []) => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                if (videoTrack.enabled) {
                    videoTrack.enabled = false;
                    myVideo.current.style.display = "none";
                    dispatch(setVideoEnabled(false));
                } else {
                    videoTrack.enabled = true;
                    myVideo.current.style.display = "block";
                    dispatch(setVideoEnabled(true));
                }
                socket.emit('VIDEO_ENABLE', { videoEnable: videoTrack.enabled, callerIDs });
            }
        }
    }

    const audioHandler = (callerIDs = []) => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                if (audioTrack.enabled) {
                    audioTrack.enabled = false;
                    dispatch(setAudioEnabled(false));
                    console.log(myVideo.current.currentTime, myVideo.current.muted);
                } else {
                    audioTrack.enabled = true;
                    dispatch(setAudioEnabled(true));
                }

                socket.emit('AUDIO_ENABLE', { audioEnable: audioTrack.enabled, callerIDs })
            }
        }
    }

    const callUser = async (mydata, callerIDs, callType, chatId) => {
        if (!videoEnabled) {
            // console.log("track");
            await enbaleStreamTrack(false);
        }
        const peer = createPeerInstance(true, false, stream);
        dispatch(setCallDial(true))

        peer.on('signal', (data) => {
            const endPointData = {
                userToCall: callerIDs,
                signalData: data,
                from: mydata?._id,
                name: mydata?.name,
                callType,
                avatar: mydata?.avatar.url,
                chatId,
                videoEnabled,
            }
            // console.count("signal");
            socket.emit('CALL_USER', endPointData);
        })

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                console.log(currentStream.getVideoTracks());
                userVideo.current.srcObject = currentStream;
            } else {
                console.error("User video reference is missing");
            }
        });

        socket.on('CALL_ACCEPTED', (signal) => {
            if (!peer.destroyed) {
                peer.signal(signal);
                dispatch(setUserVideoEnabled(true));
                dispatch(setCallEnded(false));
                dispatch(setCallDial(false));
                dispatch(setCallMessage({ message: "", error: "" }));
                dispatch(setCallAccepted(true));
                console.log(peer)
            } else {
                console.warn("Attempted to signal a destroyed peer");
            }
        })

        peer.on('error', handlePeerError);
    };

    const answerCall = (id, signal) => {
        dispatch(setCallReceive(false));
        dispatch(setCallEnded(false));
        dispatch(setCallAccepted(true));
        const peer = createPeerInstance(false, false, stream);

        peer.on("signal", (data) => {
            // console.log("signalData", data);
            socket.emit('ANSWER_CALL', { signal: data, id });
        })

        peer.on('stream', (currentStream) => {
            // if(calllerdata)
            userVideo.current.srcObject = currentStream;
        });

        if (!peer.destroyed) {
            peer.signal(signal);
        } else {
            console.warn("Attempted to signal a destroyed peer");
        }

        peer.on('error', handlePeerError);
    }

    const leaveCall = (id, args) => {
        if (connectionRef.current && !connectionRef.current.destroyed) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
        dispatch(setCallAccepted(false));
        dispatch(setCallEnded(true));
        dispatch(setCallDial(false));
        socket.emit("CALL_ENDED", { id, args });
        dispatch(setUserVideoEnabled(false));
        dispatch(setHideCallNotification(false));
        dispatch(setCallerData(null));
        dispatch(setCallReceive(false));
        // window.location.reload();
    };

    const callUserHandler = useCallback((data) => {
        dispatch(setCallerData(data));
        dispatch(setCallReceive(true));
    }, []);

    const callEndedHandler = (data) => {
        // console.log("dataMessage", data);
        if (connectionRef.current && !connectionRef.current.destroyed) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
        dispatch(setCallMessage(data));
        dispatch(setCallEnded(true));
        dispatch(setCallDial(false));
        dispatch(setCallAccepted(false));
        dispatch(setUserVideoEnabled(false));
        dispatch(setCallReceive(false));
        dispatch(setCallerData(null));
        dispatch(setHideCallNotification(false));
        // window.location.reload();
    }

    const remoteVideoEnableHandler = useCallback(({ remoteVideoEnable }) => {
        // console.log(remoteVideoEnable);
        userVideo.current.style.display = remoteVideoEnable ? "block" : "none";
        dispatch(setUserVideoEnabled(remoteVideoEnable));
    }, []);

    const remoteAudioEnableHandler = useCallback(({ remoteAudioEnable }) => {
        console.log(remoteAudioEnable);
        dispatch(setUserAudioEnabled(remoteAudioEnable));
    }, [])

    useSocketEvents(socket, {
        ["CALL_USER"]: callUserHandler,
        ["CALL_ENDED"]: callEndedHandler,
        ["REMOTE_VIDEO_ENABLE"]: remoteVideoEnableHandler,
        ["REMOTE_AUDIO_ENABLE"]: remoteAudioEnableHandler,
    });

    return (
        <PeerContext.Provider
            value={{
                mediaPermission,
                setMediaPermission,
                myVideo,
                userVideo,
                stream,
                callUser,
                answerCall,
                leaveCall,
                startMedia,
                peer: connectionRef,
                videoHandler,
                controlsHandle: controlesHandlerWithOutAcceptCall,
                audioHandler,
            }}>
            {children}
        </PeerContext.Provider>
    )
}