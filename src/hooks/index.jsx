import { useEffect, useState } from "react"
import toast from "react-hot-toast";


const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({ isError, error, fallback }) => {
            // Check if there's an error
            if (isError) {
                // If a fallback function is provided, call it
                if (fallback) fallback(); 
                else 
                    // Display error toast with the error message or default message
                    toast.error(error?.data?.message || "Something Went Wrong");
            }
        })
    }, [errors]); // Re-run effect whenever the errors change
};

const useAsyncMutation = (mutationHook) => {
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [data, setData] = useState(null); // Store mutation response data

    const [mutateFunc] = mutationHook(); // Get mutation function from the hook

    const executeMutation = async (toastMessage, toastIcon, ...args) => {
        setIsLoading(true); // Set loading state to true
        const toastId = toast.loading(toastMessage || "Updating Data"); // Show loading toast
        const toastOptions = {
            id: toastId,
            duration: 1500, // Set toast duration
        }
        toastIcon ? toastOptions.icon = toastIcon : toastOptions; // Add custom icon to toast if provided

        try {
            const res = await mutateFunc(...args); // Execute mutation with passed arguments
            if (!res.data) {
                // If response doesn't contain data, throw error
                throw new Error(res?.error?.data?.message);
            }
            setData(res?.data); // Set response data
            toast.success(
                res?.data?.message || "Updating Data",
                toastOptions // Show success toast
            );
        } catch (error) {
            // Show error toast if mutation fails
            toast.error("Something Went Wrong", { id: toastId });
        } finally {
            setIsLoading(false); // Set loading state to false when mutation is done
        }
    };
    
    return [executeMutation, isLoading, data]; // Return the execute function, loading state, and data
};

const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
        // Attach event listeners for each event in handlers object
        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        // Cleanup event listeners on component unmount or handlers change
        return () => {
            Object.entries(handlers).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
        }
    }, [socket, handlers]); // Re-run effect when socket or handlers change
}


export { useErrors, useAsyncMutation, useSocketEvents };