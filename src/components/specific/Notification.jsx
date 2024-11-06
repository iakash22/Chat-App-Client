import React, { memo } from 'react'
import { Avatar, Button, Dialog, DialogTitle, List, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import { sampleNotifications } from '../constants/sampleData' // Sample data for testing notifications
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from '../../redux/api' // Redux hooks to get notifications and accept friend requests
import { useErrors } from '../../hooks' // Custom hook to handle errors
import toast from 'react-hot-toast' // Toast notifications for success and error messages

const Notification = ({ open, setClose }) => {
  // Fetch notifications data using the useGetNotificationQuery hook
  const { isLoading, data, isError, error, refetch } = useGetNotificationQuery();
  
  // Mutation hook for accepting the friend request
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  
  // Handler function for accepting or rejecting friend requests
  const friendRequestHandler = async ({ _id, accept }) => {
    try {
      // Call the API to accept/reject the friend request
      const res = await acceptFriendRequest({ requestId: _id, accept });
      if (res?.data?.success) {
        toast.success(res.data?.message); // Show success message
        if (data?.data.length < 2) {
          setClose(); // Close dialog if there are no more notifications
        } else {
          refetch(); // Refetch notifications if there are still pending ones
        }
      } else {
        toast.error(res.data?.message || "Something Went Wrong"); // Show error message if the response is not successful
      }
    } catch (error) {
      toast.error(error?.message || "Something Went Wrong"); // Show error message if there is an exception
      console.log(error);
    }
  }

  useErrors([{ error, isError }]); // Hook to handle errors

  return (
    <Dialog open={open} onClose={setClose}> {/* Dialog for showing notifications */}
      <Stack
        p={{ xs: "1rem", sm: "2rem" }}
        maxWidth={"25rem"}
      >
        <DialogTitle>Notification</DialogTitle> {/* Dialog Title */}
        
        {isLoading ? 
          <Skeleton /> // Show skeleton loader while data is loading
          :
          <>
            {
              data?.data.length > 0 ? (
                // If there are notifications, render each notification
                data?.data.map((notification) => (
                  <NotificationItem
                    sender={notification?.sender} // Notification sender details
                    _id={notification?._id} // Notification ID
                    handler={friendRequestHandler} // Handler function for accepting/rejecting
                    key={notification?._id} // Unique key for each notification item
                  />))
              ) :
                (
                  <Typography textAlign={"center"}>{data?.message || "0 notification"}</Typography> // If no notifications, show a message
                )
            }
          </>
        }
      </Stack>
    </Dialog>
  )
}

export default Notification;

// Memoized NotificationItem component to optimize re-rendering
const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender; // Extract name and avatar from the sender
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} /> {/* Avatar of the sender */}

        <Typography
          variant='body1'
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {`${name} send you a friend request.`} {/* Notification text */}
        </Typography>
        
        <Stack
          direction={{
            xs: "column", // Stack buttons vertically on mobile
            sm: "row" // Stack buttons horizontally on larger screens
          }}
        >
          <Button
            onClick={() => handler({ _id, accept: true })} // Call handler to accept the friend request
          >
            Accept
          </Button>
          <Button
            color='error'
            onClick={() => handler({ _id, accept: false })} // Call handler to reject the friend request
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  )
});
