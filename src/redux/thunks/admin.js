import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
    try {
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post(
            `${BASE_URL}/admin/login`,
            { secretKey },
            config
        )
        // console.log(res);
        return res?.data?.message;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
});

const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
    try {
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.get(
            `${BASE_URL}/admin`,
            config
        )
        // console.log(res);
        return res?.data?.admin;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
});

const logout = createAsyncThunk("admin/logout", async () => {
    try {
        const res = await axios.post(
            `${BASE_URL}/admin/logout`,
            null,
            {
                withCredentials: true,
            }
        )
        // console.log(res);
        return res?.data?.message;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
});

export { adminLogin, getAdmin, logout };