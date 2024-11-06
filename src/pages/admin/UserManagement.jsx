import { useFetchData } from '6pp'; // Custom hook to fetch data
import { Avatar, Skeleton } from '@mui/material'; // Material UI components
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout'; // Admin layout component
import Table from '../../components/shared/Table'; // Custom table component
import { useErrors } from '../../hooks'; // Custom hook for error handling
import { transformImage } from '../../libs/features'; // Utility function to transform avatar image

// Column configuration for the user table
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
            <Avatar alt={params.row.name} src={params.row.avatar} /> // Display user avatar
        )
    },
    {
        field: "name",
        headerName: "Name",
        width: 200,
        headerClassName: "table-header"
    },
    {
        field: "username",
        headerName: "Username",
        width: 200,
        headerClassName: "table-header"
    },
    {
        field: "friends",
        headerName: "Friends",
        width: 150,
        headerClassName: "table-header"
    },
    {
        field: "groups",
        headerName: "Groups",
        width: 150,
        headerClassName: "table-header"
    },
];

// API base URL
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const UserManagement = () => {
    const [rows, setRows] = useState([]); // State to store transformed rows data

    // Fetch user data from the API
    const { loading, data, error, refetch } = useFetchData(
        `${BASE_URL}/admin/users`, // API endpoint for fetching users
        "dashbaord-users"
    );
    const users = data?.data || []; // Extract users from the response

    // Effect hook to transform the fetched users into the required format
    useEffect(() => {
        if (data) {
            setRows(users.map((user) =>
                ({ ...user, id: user._id, avatar: transformImage(user.avatar, 50) }) // Add transformed avatar
            ));
        }
    }, [data]);

    // Handle any errors that might occur during data fetching
    useErrors([
        { isError: error, error },
    ]);

    return (
        <AdminLayout>
            {loading ? 
                <Skeleton height={"100vh"} /> // Show skeleton loader if data is loading
                :
                <Table
                    heading={"All Users"} // Table heading
                    rows={rows} // Rows data
                    columns={columns} // Column configuration
                    rowHeight={52} // Row height
                />
            }
        </AdminLayout>
    );
}

export default UserManagement;
