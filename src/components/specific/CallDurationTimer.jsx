import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CallDurationTimer = () => {
    const [callTime, setCallTime] = useState(0); // Total call time in seconds
    const { callAccepted } = useSelector(state => state.call);
    let timer;

    // Format time in HH:MM:SS
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
    };

    useEffect(() => {
        if (callAccepted) {
            // Start a timer to increment the call time
            timer = setInterval(() => {
                setCallTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            setCallTime(0);
        }

        return () => {
            // Cleanup the timer when the component unmounts or call ends
            clearInterval(timer);
        };
    }, [callAccepted]);
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#FFF",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                borderRadius: "10px",
                padding: "4px 10px"
            }}
        >
            <div
                style={{
                    width: "8px",
                    height: "8px",
                    background: "#F95454",
                    borderRadius: "50%"
                }}
            />
            <span style={{ fontSize: "14px", color: "#2D3648", marginTop: "1px" }}>
                {formatTime(callTime)}
            </span>
        </Box>
    )
}

export default CallDurationTimer