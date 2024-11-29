import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Peer from 'simple-peer/simplepeer.min.js';
import { usePeerEvents, useSocketEvents } from "../hooks";
import {
    setCallAccepted,
    setCallEnded,
    setCallerData,
    setCallReceive,
    setHideCallNotification,
    setUserVideoEnabled,
    setCallDial,
    setCallMessage,
} from '../redux/reducers/slice/call';
import { getSocket } from "./socket";

const PeerContext = createContext(null);
export const getPeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [mediaPermission, setMediaPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const { socket } = getSocket();
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const dispatch = useDispatch();

    const handlePeerError = (err) => {
        console.error("Peer Error:", err);
        dispatch(setCallEnded(true)); // Example fallback action
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

    useEffect(() => {
        if (!connectionRef.current) return;

        const peer = connectionRef.current;

        const handleTrack = (track, currStream) => console.log(track, currStream);
        const handleStream = (currStream) => console.log(currStream);
        const handleClose = () => console.log("Peer connection closed");

        peer.on('track', handleTrack);
        peer.on('stream', handleStream);
        peer.on('close', handleClose);
        peer.on('error', handlePeerError);

        return () => {
            peer.off('track', handleTrack);
            peer.off('stream', handleStream);
            peer.off('close', handleClose);
            peer.off('error', handlePeerError);
        };
    }, [connectionRef]);

    const addStreamHandler = (currentStream) => {
        dispatch(setUserVideoEnabled(true));
        userVideo.current.srcObject = currentStream;
    }

    const answerCall = (id, signal) => {
        dispatch(setCallReceive(false));
        dispatch(setCallEnded(false));
        dispatch(setCallAccepted(true));
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            console.log("signalData", data);
            socket.emit('ANSWER_CALL', { signal: data, id });
        })

        peer.on('stream', (currentStream) => {
            dispatch(setUserVideoEnabled(true));
            userVideo.current.srcObject = currentStream;
        });

        if (!peer.destroyed) {
            peer.signal(signal);
        } else {
            console.warn("Attempted to signal a destroyed peer");
        }

        console.log(peer.state);

        peer.on('error', handlePeerError);

        connectionRef.current = peer;
    }

    const callUser = (mydata, callerIDs, callType, chatId) => {
        dispatch(setCallDial(true))
        const peer = new Peer({ initiator: true, trickle: false, stream });
        console.log(peer);
        peer.on('signal', (data) => {
            const endPointData = {
                userToCall: callerIDs,
                signalData: data,
                from: mydata?._id,
                name: mydata?.name,
                callType,
                avatar: mydata?.avatar.url,
                chatId,
            }
            console.count("signal");
            socket.emit('CALL_USER', endPointData);
        })

        // usePeerEvents(
        //     peer,
        //     handlers
        // );

        peer.on('stream', (currentStream) => {
            // console.log("Received remote stream:", currentStream);
            console.count("stream");
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            } else {
                console.error("User video reference is missing");
            }
        });

        socket.on('CALL_ACCEPTED', (signal) => {
            console.log("signal Call user", signal);
            console.count("CALL_ACCEPTED");
            // console.log(peer);
            if (!peer.destroyed) {
                peer.sigal(signal);
                dispatch(setUserVideoEnabled(true));
                dispatch(setCallEnded(false));
                dispatch(setCallDial(false));
                dispatch(setCallAccepted(true));
            } else {
                console.warn("Attempted to signal a destroyed peer");
            }
        })

        peer.on('error', handlePeerError);
        connectionRef.current = peer;
    };

    const leaveCall = (id, args) => {
        dispatch(setCallAccepted(false));
        dispatch(setCallEnded(true));
        dispatch(setCallDial(false));
        socket.emit("CALL_ENDED", { id, args });
        dispatch(setUserVideoEnabled(false));
        dispatch(setHideCallNotification(false));
        dispatch(setCallerData(null));
        dispatch(setCallReceive(false));
        if (connectionRef.current && !connectionRef.current.destroyed) {
            connectionRef.current.destroy();
        }
        // window.location.reload();
    };

    const callUserHandler = (data) => {
        dispatch(setCallerData(data));
        dispatch(setCallReceive(true));
    }

    const callEndedHandler = (data) => {
        // console.log("dataMessage", data);
        dispatch(setCallMessage(data));
        dispatch(setCallEnded(true));
        dispatch(setCallDial(false));
        dispatch(setCallAccepted(false));
        dispatch(setUserVideoEnabled(false));
        dispatch(setCallReceive(false));
        dispatch(setCallerData(null));
        dispatch(setHideCallNotification(false));
        if (connectionRef.current && !connectionRef.current.destroyed) {
            connectionRef.current.destroy();
        }
    }

    useSocketEvents(socket, {
        ["CALL_USER"]: callUserHandler,
        ["CALL_ENDED"]: callEndedHandler,
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
            }}>
            {children}
        </PeerContext.Provider>
    )
}