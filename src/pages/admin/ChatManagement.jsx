import React, { useEffect, useState } from 'react' // React and hooks import
import AdminLayout from '../../components/layouts/AdminLayout' // Layout component for the admin page
import Table from '../../components/shared/Table'; // Table component to display data in tabular format
import { dashboardData } from '../../components/constants/sampleData'; // Sample data for dashboards (unused here)
import { transformImage } from '../../libs/features'; // Helper function to transform image URLs
import { Avatar, Skeleton, Stack } from '@mui/material'; // Material-UI components for Avatar, Skeleton loading, and Stack layout
import AvatarCard from '../../components/shared/AvatarCard'; // AvatarCard to display avatars
import { useFetchData } from '6pp'; // Custom hook for fetching data
import { useErrors } from '../../hooks'; // Custom hook for handling errors

// Columns for the Table component, defining the fields and rendering logic
const columns = [
    {
        field: "id",
        headerName: "ID",
        width: 200,
        headerClassName: "table-header"
    },
    {
        field: "avatar",
        headerName: "Avatar",
        width: 150,
        headerClassName: "table-header",
        renderCell: (params) => (
            <AvatarCard avatar={params.row.avatar} />
        )
    },
    {
        field: "name",
        headerName: "Name",
        width: 300,
        headerClassName: "table-header"
    },
    {
        field: "GroupChat",
        headerName: "Group",
        width: 100,
        headerClassName: "table-header",
        renderCell: (params) => {
            return params.row?.groupChat ? "Yes" : "No"; // Render "Yes" or "No" based on whether groupChat exists
        }
    },
    {
        field: "totalMembers",
        headerName: "Total Members",
        width: 120,
        headerClassName: "table-header"
    },
    {
        field: "members",
        headerName: "Members",
        width: 400,
        headerClassName: "table-header",
        renderCell: (params) => (
            <AvatarCard max={100} avatar={params.row?.members} />
        ),
    },
    {
        field: "totalMessages",
        headerName: "Total Messages",
        width: 150,
        headerClassName: "table-header"
    },
    {
        field: "creator",
        headerName: "Created By",
        width: 250,
        headerClassName: "table-header",
        renderCell: (params) => (
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
                <span>{params.row?.creator?.name}</span> {/* Display creator's name with avatar */}
            </Stack>
        )
    },
];

const BASE_URL = import.meta.env.VITE_APP_BASE_URL; // Fetching base URL from environment variables

const ChatManagement = () => {
    const [rows, setRows] = useState([]); // State to store rows of data
    const { loading, data, error, refetch } = useFetchData(
        `${BASE_URL}/admin/chats`, // API endpoint for fetching chat data
        "dashbaord-chats"
    );
    const chats = data?.data || []; // Extract chat data from the response

    useEffect(() => {
        // Map the data to match the table's structure
        if (data) {
            setRows(chats.map(chat => ({
                ...chat,
                id: chat._id, // Assigning unique ID for each chat
                avatar: chat.avatar.map(img => transformImage(img, 50)), // Transform avatar images
                members: chat.members.map(member => transformImage(member.avatar, 50)), // Transform member avatars
                creator: {
                    name: chat.creator.name,
                    avatar: transformImage(chat.creator.avatar, 50), // Transform creator avatar
                }
            })))
        }
    }, [data]); // Re-run effect when the data changes

    useErrors([ // Handling any errors by displaying toast notifications
        { isError: error, error },
    ])

    return (
        <AdminLayout> {/* Wrapping the layout in the AdminLayout component */}
            {loading ? // Show loading skeleton while data is being fetched
                <Skeleton height={"100vh"} />
                :
                <Table
                    heading={"All Chats"} // Table heading
                    rows={rows} // Table rows
                    columns={columns} // Table columns configuration
                    rowHeight={52} // Height of each row
                />
            }
        </AdminLayout>
    )
}

export default ChatManagement; // Export the component for use in other parts of the app
