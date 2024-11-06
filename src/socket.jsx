import { createContext, useContext, useMemo } from "react";
import io from 'socket.io-client';

// Create a context for the Socket instance
const SocketContext = createContext();

// Custom hook to access the socket instance throughout the app
const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    // useMemo is used to memoize the socket instance so it only initializes once
    const socket = useMemo(
        () => io(
            import.meta.env.VITE_APP_SERVER || "http://localhost:8000", // Server URL from environment variable or default to localhost
            { withCredentials: true } // Send credentials like cookies with each request
        ), []
    );

    return (
        // Provide the socket instance to the children components
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketProvider, getSocket };
