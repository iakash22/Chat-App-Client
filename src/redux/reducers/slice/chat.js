import { createSlice } from "@reduxjs/toolkit";
import { getAndSetFromStorage } from "../../../libs/features";
import { NEW_MESSAGE_ALERT } from "../../../components/constants/events";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: getAndSetFromStorage({ key: NEW_MESSAGE_ALERT, type: "GET" }) || [
        {
            chatId: "",
            count: 0,
        }
    ],
    userTyping: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotification: (state) => {
            state.notificationCount += 1;
        },
        resetNotification: (state) => {
            state.notificationCount = 0;
        },
        setNewMessagesAlert: (state, action) => {
            const chatId = action.payload.chatId;
            const index = state.newMessagesAlert.findIndex(
                (item) => item.chatId === chatId
            );

            if (index !== -1) {
                state.newMessagesAlert[index].count += 1;
            } else {
                state.newMessagesAlert.push({
                    chatId,
                    count: 1,
                });
            }
            getAndSetFromStorage({ key: NEW_MESSAGE_ALERT, value: state.newMessagesAlert, type: "SET" });
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessagesAlert = state.newMessagesAlert.filter(
                (item) => item.chatId !== action.payload
            );
            getAndSetFromStorage({ key: NEW_MESSAGE_ALERT, value: state.newMessagesAlert, type: "SET" });
        },
        setUserTyping: (state, action) => {
            const exists = state.userTyping.includes(action.payload);

            if (!exists) {
                state.userTyping.push(action.payload);
            }
        },
        removeUserTyping: (state, action) => {
            state.userTyping = state.userTyping.filter((chatId) => chatId !== action.payload);
        }
    }
});

export default chatSlice;
export const {
    incrementNotification,
    resetNotification,
    setNewMessagesAlert,
    removeNewMessagesAlert,
    setUserTyping,
    removeUserTyping,
} = chatSlice.actions