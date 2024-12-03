import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videoEnabled: true,
    audioEnabled: true,
    userAudioEnabled: true,
    userVideoEnabled: false,
    hideCallNotification: false,
    callReceive: false,
    callerData: null,
    callDail: false,
    callAccepted: false,
    callEnded: true,
    callMessage: { message: "", error: "" },
}

const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {
        setVideoEnabled: (state, action) => {
            state.videoEnabled = action.payload;
        },
        setAudioEnabled: (state, action) => {
            state.audioEnabled = action.payload;
        },
        setUserVideoEnabled: (state, action) => {
            state.userVideoEnabled = action.payload;
        },
        setUserAudioEnabled: (state, action) => {
            state.userAudioEnabled = action.payload;
        },
        setCallReceive: (state, action) => {
            state.callReceive = action.payload;
        },
        setCallEnded: (state, action) => {
            state.callEnded = action.payload;
        },
        setCallAccepted: (state, action) => {
            state.callAccepted = action.payload;
        },
        setCallDial: (state, action) => {
            state.callDail = action.payload;
        },
        setCallerData: (state, action) => {
            state.callerData = action.payload;
        },
        setHideCallNotification: (state, action) => {
            state.hideCallNotification = action.payload;
        },
        setCallMessage: (state, action) => {
            state.callMessage = action.payload;
        },
    }
});

export default callSlice;
export const {
    setVideoEnabled,
    setAudioEnabled,
    setUserVideoEnabled,
    setUserAudioEnabled,
    setCallReceive,
    setCallEnded,
    setCallAccepted,
    setCallDial,
    setCallerData,
    setHideCallNotification,
    setCallMessage,
} = callSlice.actions