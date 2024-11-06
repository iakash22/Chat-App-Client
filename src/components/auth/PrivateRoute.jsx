import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Retrieve authentication status from the Redux store
    const { isAuthenticate } = useSelector(state => state.auth);

    // If the user is authenticated, render either the passed children or an <Outlet />
    if (isAuthenticate) {
        return children ? children : <Outlet />; // Outlet renders nested routes if no children are specified
    } else {
        // If not authenticated, redirect to the login page
        return <Navigate to={'/login'} replace />; // 'replace' prevents adding the login route to the history stack
    }
}

export default PrivateRoute;
