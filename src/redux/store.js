import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers';
import api from './api';

const store = configureStore({
    reducer: rootReducer,
    middleware : (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});

export default store;