import { useInputValidation } from '6pp'; // Importing custom hook for input validation
import { Button, Container, Paper, TextField, Typography } from '@mui/material'; // Importing Material-UI components
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Importing Redux hooks
import { Navigate } from 'react-router-dom'; // For navigation redirection
import { adminLogin, getAdmin } from '../../redux/thunks/admin'; // Importing actions for admin login and fetching admin data

const AdminLogin = () => {
    const { isAdmin } = useSelector(state => state.auth); // Retrieving `isAdmin` status from Redux state
    const dispatch = useDispatch(); // Dispatch hook to trigger actions
    const secretKey = useInputValidation(""); // Custom hook for input validation

    useEffect(() => {
        // Dispatch action to check if admin is already logged in when the component mounts
        dispatch(getAdmin());
    }, [dispatch]);

    const submitHandler = (e) => {
        // Submit handler for the login form
        e.preventDefault();
        dispatch(adminLogin(secretKey.value)); // Dispatch login action with the secret key value
        console.log("Submit");
    }

    // Redirect to the admin dashboard if the user is already an admin
    if (isAdmin) {
        return <Navigate to={'/admin/dashboard'} />
    }

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
                <>
                    <Typography variant='h5'>Admin Login</Typography> {/* Heading for Admin Login */}
                    <form
                        style={{
                            width: "100%",
                            marginTop: "1rem"
                        }}
                        onSubmit={submitHandler} // Attach submit handler to the form
                    >
                        <TextField
                            required
                            fullWidth
                            label="Secret Key"
                            margin='normal'
                            variant='outlined'
                            name="secretKey"
                            type='password'
                            value={secretKey.value} // Bind value of input to state
                            onChange={secretKey.changeHandler} // Update state value on input change
                        />
                        <Button
                            sx={{ marginTop: "1rem" }}
                            variant='contained'
                            type='submit'
                            color='primary'
                            fullWidth
                        >
                            Login
                        </Button> {/* Login button */}
                    </form>
                </>
            </Paper>
        </Container>
    )
}

export default AdminLogin;
