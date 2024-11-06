import { useFetchData } from '6pp' // Custom hook to fetch data
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon
} from '@mui/icons-material' // Material-UI icons for various components
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material' // Material-UI components
import moment from 'moment' // Library to format and manipulate dates
import React from 'react' // React library
import { matBlack } from '../../components/constants/Color' // Color constants
import AdminLayout from '../../components/layouts/AdminLayout' // Admin layout wrapper
import { DoughnutChart, LineChart } from '../../components/specific/Charts' // Custom charts for the dashboard
import { CurveButton, SearchField } from '../../components/styles/StyleComponents' // Custom styled components
import { useErrors } from '../../hooks' // Custom hook for handling errors

const BASE_URL = import.meta.env.VITE_APP_BASE_URL; // Fetching base URL from environment variables

const Dashboard = () => {
    const { loading, data, error, refetch } = useFetchData(
        `${BASE_URL}/admin/dashboard/stats`, // API endpoint to fetch stats data
        "dashbaord-stats" // Unique identifier for the request
    );
    const stats = data?.data || {}; // Extracting the stats data from the response

    // Handling errors (if any)
    useErrors([
        { isError: error, error },
    ])
    
    return (
        <AdminLayout >
            {loading ? // Show loading skeleton while data is being fetched
                <Skeleton height={"100vh"} />
                :
                <Container>
                    <AppBar /> {/* Header section with search and date */}

                    <Stack
                        direction={{
                            xs: "column", // Stack layout for small screens: column
                            lg: "row", // Stack layout for large screens: row
                        }}
                        justifyContent={"center"} // Center items horizontally
                        alignItems={{
                            xs: "center", // Center vertically for small screens
                            lg: "stretch" // Stretch vertically for large screens
                        }}
                        sx={{ gap: "2rem" }} // Spacing between items
                    >
                        {/* Render LineChart and DoughnutChart with respective values */}
                        <LineChartLayout
                            values={stats.messageChart || []} // Passing data for the LineChart
                        />

                        <DoughnutChartLayout
                            values={[stats.singleChatCount || 0, stats.groupsCount || 0]} // Passing data for the DoughnutChart
                            labels={["Single chats", "Group chats"]} // Labels for the DoughnutChart
                        />
                    </Stack>

                    {/* Widgets displaying counts for users, chats, and messages */}
                    <Widgets data={stats} />
                </Container>}
        </AdminLayout>
    )
}

export default Dashboard;

const AppBar = () => {
    return (
        <Paper
            elevation={3} // Paper component with shadow
            sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }} // Styling for the AppBar
        >
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}> {/* Layout for header */}
                <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} /> {/* Admin icon */}
                <SearchField placeholder='Search...' /> {/* Search field component */}
                <CurveButton>Search</CurveButton> {/* Search button */}
                <Box flexGrow={1} /> {/* Empty space to push items to the right */}
                <Typography
                    sx={{
                        display: {
                            xs: "none", // Hide date on small screens
                            lg: "block" // Show date on large screens
                        },
                        color: "rgba(0,0,0,0.7)",
                        textAlign: "center",
                    }}
                >
                    {moment().format('MMMM Do YYYY')} {/* Display current date */}
                </Typography>

                <NotificationsIcon /> {/* Notifications icon */}
            </Stack>
        </Paper>
    )
}

const Widgets = ({ data }) => {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }} // Column layout for small screens, row layout for medium and up
            justifyContent={"space-between"} // Space out widgets
            alignItems={"center"}
            margin={"2rem 0"} // Margin between widgets
            spacing={"2rem"} // Spacing between widgets
        >
            {/* Each widget displays a different stat (Users, Chats, Messages) */}
            <Widget title={"Users"} value={data?.usersCount || 0} Icon={PersonIcon} />
            <Widget title={"Chats"} value={data?.totalChatsCount || 0} Icon={GroupIcon} />
            <Widget title={"Messages"} value={data?.messagesCount || 0} Icon={MessageIcon} />
        </Stack>
    )
}

const Widget = ({ title, value, Icon }) => {
    return (
        <Paper
            elevation={3} // Paper component with shadow
            sx={{
                padding: "2rem",
                margin: "2rem 0",
                borderRadius: "1.5rem",
                width: "20rem" // Fixed width for each widget
            }}
        >
            <Stack alignItems={"center"} spacing={"1rem"} color={matBlack} >
                <Typography
                    sx={{
                        color: matBlack,
                        borderRadius: "50%", // Circle shape
                        border: "5px solid rgba(0,0,0,0.9)", // Border around the number
                        width: "5rem", // Fixed width
                        height: "5rem", // Fixed height
                        display: "flex",
                        justifyContent: "center", // Center number horizontally
                        alignItems: "center", // Center number vertically
                    }}
                >
                    {value} {/* Display value */}
                </Typography>
                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                    {Icon && <Icon />} {/* Render icon if provided */}
                    <Typography>{title}</Typography> {/* Display title of the widget */}
                </Stack>
            </Stack>
        </Paper>
    )
}

const DoughnutChartLayout = ({ labels, values = [] }) => {
    return (
        <Paper
            elevation={3} // Paper component with shadow
            sx={{
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "100%", lg: "50%" }, // Full width on small screens, half-width on large screens
                position: "relative",
                maxWidth: "25rem" // Max width for the chart
            }}
        >
            <DoughnutChart
                labels={labels} // Labels for the chart
                value={values} // Values for the chart
            />

            {/* Text in the center of the chart */}
            <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
            >
                <GroupIcon /> <Typography>Vs</Typography> <PersonIcon /> {/* Text showing comparison */}
            </Stack>
        </Paper>
    )
}

const LineChartLayout = ({ values = [] }) => {
    return (
        <Paper
            sx={{
                padding: "2rem 3.5rem",
                borderRadius: "1rem",
                width: { xs: "100%", lg: "60%" }, // Full width on small screens, 60% on large screens
                maxWidth: "45rem", // Max width for the chart
            }}
            elevation={3}
        >
            <Typography variant='h4' margin={"2rem 0"}>
                Last Messages {/* Title of the chart */}
            </Typography>

            <LineChart
                value={values} // Data for the LineChart
            />
        </Paper>
    )
}
