import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slice/auth';
import api from '../api';
import miscSlice from './slice/misc';
import chatSlice from './slice/chat';
import callSlice from './slice/call';

const rootReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name] : chatSlice.reducer,
    [callSlice.name] : callSlice.reducer,
});

export default rootReducer;