import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Table from '../../components/shared/Table'; // Custom Table component
import { Avatar, Box, Skeleton, Stack } from '@mui/material'; // Material UI components
import { dashboardData } from '../../components/constants/sampleData'; // Sample data (not used in this case)
import { fileformat, transformImage } from '../../libs/features'; // Utility functions
import moment from 'moment'; // Library to format timestamps
import RenderAttachment from '../../components/shared/RenderAttachment'; // Custom attachment rendering
import { useFetchData } from '6pp'; // Custom hook for fetching data
import { useErrors } from '../../hooks'; // Custom hook for error handling

// Column configuration for the table
const columns = [
    {
        field: "id",
        headerName: "ID",
        width: 200,
        headerClassName: "table-header"
    },
    {
        field: "attachments",
        headerName: "Attachments",
        width: 200,
        headerClassName: "table-header",
        renderCell: (params) => {
            const { attachments } = params.row;
            return attachments.length > 0 ? (
                attachments.map((attach, index) => {
                    const url = attach.url;
                    const file = fileformat(url);
                    return (
                        <Box key={`${attach?.public_id}-${index}`}>
                            <a
                                href={url}
                                download
                                target='_blank'
                                style={{ color: "#000" }}
                            >
                                <RenderAttachment file={file} url={url} />
                            </a>
                        </Box>
                    )
                })
            ) : "No Attachments";
        }
    },
    {
        field: "content",
        headerName: "Content",
        width: 400,
        headerClassName: "table-header"
    },
    {
        field: "sender",
        headerName: "Sent By",
        width: 200,
        headerClassName: "table-header",
        renderCell: (params) => (
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
                <span>{params.row?.sender?.name}</span>
            </Stack>
        )
    },
    {
        field: "chat",
        headerName: "Chat",
        width: 220,
        headerClassName: "table-header",
        renderCell: (params) => <span>{params.row?.chat?._id}</span>
    },
    {
        field: "groupChat",
        headerName: "Group Chat",
        width: 200,
        headerClassName: "table-header"
    },
    {
        field: "createdAt",
        headerName: "Time",
        width: 250,
        headerClassName: "table-header"
    },
];

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const MessageManagement = () => {
    const [rows, setRows] = useState([]); // State to store transformed rows data
    const { loading, data, error, refetch } = useFetchData(
        `${BASE_URL}/admin/messages`, // API endpoint for fetching messages
        "dashbaord-messages"
    );
    const messages = data?.data || []; // Extract messages from the response

    // Effect hook to transform the fetched messages into the required format
    useEffect(() => {
        if (data) {
            setRows(messages.map(message => ({
                ...message,
                id: message._id, // Map _id to id for the row
                sender: {
                    name: message.sender.name,
                    avatar: transformImage(message.sender.avatar, 50) // Transform sender's avatar
                },
                createdAt: moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a'), // Format time
            })))
        }
    }, [data]);

    // Handle any errors that might occur during data fetching
    useErrors([
        { isError: error, error },
    ])

    return (
        <AdminLayout>
            {loading ?
                <Skeleton height={"100vh"} /> // Show skeleton loader if data is loading
                :
                <Table
                    heading={"All Messages"} // Table heading
                    rows={rows} // Rows data
                    columns={columns} // Column configuration
                    rowHeight={180} // Row height
                />
            }
        </AdminLayout>
    )
}

export default MessageManagement;
