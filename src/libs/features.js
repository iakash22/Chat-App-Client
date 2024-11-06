import moment from "moment";

// Function to determine the type of file based on the file extension in the URL
const fileformat = (url) => {
    // Extract file extension from the URL
    const fileExtension = url.split('.').pop();

    // Check if file is a video
    if (fileExtension === "mp4" || fileExtension === "webm" || fileExtension === "ogg") {
        return "video";
    }

    // Check if file is an audio
    if (fileExtension === "mp3" || fileExtension === "wav") {
        return "audio";
    }

    // Check if file is an image
    if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "gif") {
        return "image";
    }

    // Return as generic file if no matching type
    return "file";
}

// Function to transform the image URL for different width scaling
const transformImage = (url, width = 100) => {
    // Modify the image URL by adding the width for scaling (example: width=100)
    const newUrl = url.replace('upload/', `upload/dpr_auto/w_${width}/`);
    return newUrl;
};

// Function to get the last 7 days starting from the current day
const getLast7Days = () => {
    const currentDate = moment(); // Get current date
    const last7Days = []; // Array to store last 7 days

    // Loop through the last 7 days and add them to the array
    for (let i = 0; i < 7; i++) {
        const dayDate = currentDate.clone().subtract(i, "days"); // Clone current date and subtract days
        const dayName = dayDate.format("dddd"); // Get the day name (e.g., Monday, Tuesday)

        last7Days.unshift(dayName); // Add day to the beginning of the array
    }

    return last7Days;
};

// Function to interact with localStorage based on the action type (GET, SET, REMOVE, CLEAR_ALL)
const getAndSetFromStorage = ({ key, value, type }) => {
    // Action to get data from localStorage
    if (type === "GET") {
        const res = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null; // Return parsed value or null if not found
        return res;
    } 
    // Action to set data in localStorage
    else if (type === "SET") {
        localStorage.setItem(key, JSON.stringify(value)); // Store value as a JSON string
    } 
    // Action to remove data from localStorage
    else if (type == "REMOVE") {
        localStorage.removeItem(key); // Remove item by key
    } 
    // Action to clear all data in localStorage
    else if (type === "CLEAR_ALL") {
        localStorage.clear(); // Clear all items in localStorage
    }
}

export { fileformat, transformImage, getLast7Days, getAndSetFromStorage };
