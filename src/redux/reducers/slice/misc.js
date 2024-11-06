import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu : false,
    isDeleteGroup: false,
    uploadingLoader: false,
    selectDeleteChat: {
        chatId: "",
        groupChat: false,
    },
    onlineUsers: [],
}

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload;
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload;
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload;
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;
        },
        setIsDeleteGroup: (state, action) => {
            state.isDeleteGroup = action.payload;
        },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload;
        },
        setSelectDeleteChat: (state, action) => {
            state.selectDeleteChat = action.payload;
        },
        setOlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    }
});

export default miscSlice;
export const {
    setIsAddMember,
    setIsDeleteGroup,
    setIsDeleteMenu,
    setIsFileMenu,
    setIsMobile,
    setIsNewGroup,
    setIsNotification,
    setIsSearch,
    setSelectDeleteChat,
    setUploadingLoader,
    setOlineUsers,
} = miscSlice.actions