import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const OpenRoute = ({ children }) => {
    // Accessing authentication state from Redux store
    const { isAuthenticate } = useSelector(state => state.auth);
    
    // If the user is not authenticated, render the requested component (children)
    if (!isAuthenticate) {
        return children;
    } else {
        // If authenticated, redirect to the home page
        return <Navigate to={'/'} />;
    }
}

export default OpenRoute;
