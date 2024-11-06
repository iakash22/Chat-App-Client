// Import statements for necessary components and icons
import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    Logout as LogoutIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon
} from '@mui/icons-material';
import {
    Box,
    Drawer,
    Grid,
    IconButton,
    Stack,
    styled,
    Typography
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom';
import { setIsMobile } from '../../redux/reducers/slice/misc';
import { logout } from '../../redux/thunks/admin';

// Define the tabs available in the admin sidebar with their respective paths and icons
const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupIcon />
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />
    },
];

// Styled Link component for sidebar links
const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 2rem;
    padding: 2rem;
    color: black;
    &:hover {
        color: rgba(0,0,0,0.54);
    }
`;

// AdminLayout component rendering the layout structure for admin pages
const AdminLayout = ({ children }) => {
    const { isAdmin } = useSelector(state => state.auth);
    const { isMobile } = useSelector(state => state.misc);
    const dispatch = useDispatch();

    // Handles mobile menu open/close
    const handleMobile = () => {
        dispatch(setIsMobile(true));
    };

    const closeHandler = () => {
        dispatch(setIsMobile(false));
    };

    // Redirect to login if not an admin
    if (!isAdmin) {
        return <Navigate to={'/admin'} />;
    }

    return (
        <Grid container minHeight={"100vh"}>
            <Box
                sx={{
                    display: { xs: "block", md: "none" },
                    position: "fixed",
                    right: "1rem",
                    top: "1rem",
                }}
            >
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            
            {/* Sidebar for larger screens */}
            <Grid
                item
                md={4}
                lg={3}
                sx={{ display: { xs: "none", md: "block" } }}
            >
                <SideBar />
            </Grid>

            {/* Main content area */}
            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                sx={{ bgcolor: "#f2f2f2" }}
            >
                {children}
            </Grid>

            {/* Sidebar as drawer for mobile */}
            <Drawer open={isMobile} onClose={closeHandler}>
                <SideBar w={"50vw"} />
            </Drawer>
        </Grid>
    );
};

export default AdminLayout;

// Sidebar component listing admin tabs and logout option
const SideBar = ({ w = "100%" }) => {
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    // Dispatches the logout action
    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>
                Chat Application
            </Typography>
            <Stack spacing={"1rem"}>
                {adminTabs.map((tab) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        sx={
                            pathname === tab.path && {
                                bgcolor: "#0e0e0e",
                                color: "#ffffff",
                                ":hover": {
                                    color: "#ffffff"
                                }
                            }
                        }
                    >
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}
                            <Typography>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))}

                {/* Logout option */}
                <Link onClick={logoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <LogoutIcon />
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    );
};
