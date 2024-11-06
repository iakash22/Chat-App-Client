import { createSlice } from '@reduxjs/toolkit';
import { adminLogin, getAdmin, logout } from '../../thunks/admin';
import toast from 'react-hot-toast';

const initialState = {
    loading: false,
    isAdmin : false,
    isAuthenticate: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAuthentication: (state, action) => {
            state.isAuthenticate = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(adminLogin.fulfilled, (state, action) => {
            state.isAdmin = true;
            toast.success(action.payload, {duration : 2000});
        });
        builder.addCase(adminLogin.rejected, (state, action) => {
            state.isAdmin = false;
            toast.error(action.error.message);
        });
        builder.addCase(getAdmin.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAdmin = true;
            }
            else {
                state.isAdmin = false;                
            }
        });
        builder.addCase(getAdmin.rejected, (state, action) => {
            state.isAdmin = false;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isAdmin = false;
            toast.success(action.payload, {duration : 2000});
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.isAdmin = true;
            toast.error(action.error.message);
        });
    }
});

export default authSlice;
export const { setLoading, setUser, setAuthentication } = authSlice.actions;