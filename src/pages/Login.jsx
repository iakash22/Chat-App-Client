import React, { useState } from 'react';
import {
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Stack,
    Avatar,
    IconButton
} from '@mui/material';
import { CameraAlt } from '@mui/icons-material'; // Camera icon for avatar upload
import { VisuallyHiddenInput } from '../components/styles/StyleComponents'; // Custom input for file upload
import { useFileHandler, useInputValidation } from '6pp'; // Custom hooks for file handling and input validation
import { usernameValidator } from '../utils/validator'; // Custom username validator
import axios from "axios"; // Axios for making API requests
import { endPoints } from '../services/api'; // API endpoint constants
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks for state management
import { setAuthentication, setLoading } from '../redux/reducers/slice/auth'; // Redux actions
import { toast } from 'react-hot-toast'; // Toast for notifications
import { getMyProfile } from '../services/operations/auth'; // Action for fetching user profile

// Main Login component
const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register forms
    const name = useInputValidation(""); // Validation hook for name input
    const password = useInputValidation(""); // Validation hook for password input
    const username = useInputValidation("", usernameValidator); // Validation hook for username with custom validator
    const bio = useInputValidation(""); // Validation hook for bio input
    const avatar = useFileHandler("single"); // Hook to handle file input for avatar
    const dispatch = useDispatch(); // Redux dispatch for state management
    const { loading } = useSelector(state => state.auth); // Get loading state from Redux store

    const config = {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Handle login logic
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission default behavior
        const toastId = toast.loading("Loading..."); // Display loading toast
        dispatch(setLoading(true)); // Set loading state to true in Redux
        try {
            const res = await axios.post(
                endPoints.LOGIN_API,
                { username: username.value, password: password.value },
                config
            );
            // On success, update authentication status and fetch profile data
            dispatch(setAuthentication(true));
            localStorage.setItem('auth', JSON.stringify(true)); // Store authentication status in localStorage
            await dispatch(getMyProfile()); // Fetch user profile after login
            toast.success(res.data?.message); // Display success toast
        } catch (error) {
            // Handle error during login
            toast.error(error?.response?.data?.message || "Something Went Wrong!"); // Display error toast
        }
        dispatch(setLoading(false)); // Set loading state to false
        toast.dismiss(toastId); // Dismiss loading toast
    };

    // Handle register logic
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent form submission default behavior
        const formData = new FormData();
        formData.append("avatar", avatar.file); // Add avatar to form data
        formData.append("username", username.value); // Add username to form data
        formData.append("name", name.value); // Add name to form data
        formData.append("password", password.value); // Add password to form data
        formData.append("bio", bio.value); // Add bio to form data

        const toastId = toast.loading("Loading..."); // Display loading toast
        dispatch(setLoading(true)); // Set loading state to true in Redux
        try {
            const res = await axios.post(
                endPoints.REGISTER_API,
                formData,
                { ...config, headers: { "Content-Type": "multipart/form-data" } } // Content-Type for file uploads
            );
            // On success, update authentication status and fetch profile data
            dispatch(setAuthentication(true));
            localStorage.setItem('auth', JSON.stringify(true)); // Store authentication status in localStorage
            await dispatch(getMyProfile()); // Fetch user profile after registration
            toast.success(res.data?.message, { duration: "500" }); // Display success toast
        } catch (error) {
            // Handle error during registration
            console.log(error);
            toast.error(error?.response?.data?.message || "Something Went Wrong!"); // Display error toast
        }
        dispatch(setLoading(false)); // Set loading state to false
        toast.dismiss(toastId); // Dismiss loading toast
    };

    return (
        <Container
            component={"main"}
            maxWidth="xs"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                height: "100%"
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                {isLogin ? (
                    <>
                        <Typography variant='h5'>Login</Typography>
                        <form
                            style={{
                                width: "100%",
                                marginTop: "1rem"
                            }}
                            onSubmit={handleLogin}
                        >
                            {/* Username and password fields for login */}
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                margin='normal'
                                variant='outlined'
                                name="username"
                                value={username.value}
                                onChange={username.changeHandler}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                type='password'
                                margin='normal'
                                variant='outlined'
                                name='password'
                                value={password.value}
                                onChange={password.changeHandler}
                            />
                            <Button
                                sx={{ marginTop: "1rem" }}
                                variant='contained'
                                type='submit'
                                color='primary'
                                fullWidth
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                            {/* Switch between login and register forms */}
                            <Typography textAlign={"center"} marginTop={"1rem"}>
                                Or
                            </Typography>
                            <Button
                                variant='text'
                                fullWidth
                                onClick={() => setIsLogin(false)}
                            >
                                Register
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <Typography variant='h5'>Register</Typography>
                        <form
                            style={{
                                width: "100%",
                                marginTop: "1rem"
                            }}
                            onSubmit={handleRegister}
                        >
                            {/* Avatar upload with camera icon */}
                            <Stack
                                position="relative"
                                width="8rem"
                                margin="auto"
                            >
                                <Avatar
                                    sx={{
                                        width: "8rem",
                                        height: "8rem",
                                        objectFit: "contain"
                                    }}
                                    src={avatar.preview}
                                />
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        bottom: 10,
                                        right: 3,
                                        color: "#fff",
                                        bgcolor: "rgba(0,0,0,0.5)",
                                        ":hover": {
                                            bgcolor: "rgba(0,0,0,0.7)"
                                        }
                                    }}
                                    component="label"
                                >
                                    <CameraAlt sx={{ fontSize: "12px" }} />
                                    <VisuallyHiddenInput
                                        type='file'
                                        accept='image/*'
                                        size={"5600"}
                                        onChange={avatar.changeHandler}
                                    />
                                </IconButton>
                            </Stack>
                            {/* Display error if avatar is invalid */}
                            {avatar.error && (
                                <Typography
                                    m="1rem auto"
                                    width="fit-contain"
                                    display="block"
                                    color="error"
                                    variant='caption'
                                >
                                    {avatar.error}
                                </Typography>
                            )}
                            {/* Input fields for name, bio, username, and password */}
                            <TextField
                                required
                                fullWidth
                                label="Name"
                                name="name"
                                margin='normal'
                                variant='outlined'
                                value={name.value}
                                onChange={name.changeHandler}
                            />
                            <TextField
                                fullWidth
                                label="Bio"
                                margin='normal'
                                variant='outlined'
                                name='bio'
                                value={bio.value}
                                onChange={bio.changeHandler}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                margin='normal'
                                variant='outlined'
                                name="username"
                                value={username.value}
                                onChange={username.changeHandler}
                            />
                            {/* Display error if username is invalid */}
                            {username.error && (
                                <Typography color={"error"} variant='caption'>{username.error}</Typography>
                            )}
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type='password'
                                margin='normal'
                                variant='outlined'
                                value={password.value}
                                onChange={password.changeHandler}
                            />
                            <Button
                                sx={{ marginTop: "1rem" }}
                                variant='contained'
                                type='submit'
                                color='primary'
                                fullWidth
                            >
                                {loading ? "Registering..." : "Register"}
                            </Button>
                            <Typography
                                textAlign={"center"}
                                marginTop={"1rem"}
                            >
                                Or
                            </Typography>
                            <div
                                style={{ fontSize: "14px", width: "60%" }}
                            >
                                If you already have an account,{" "}
                                <span
                                    onClick={() => setIsLogin(true)}
                                    style={{ fontSize: "15px", textDecoration: "underline", cursor: "pointer", color: "#1F75FE" }}
                                >
                                    login
                                </span>
                            </div>
                        </form>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Login;
