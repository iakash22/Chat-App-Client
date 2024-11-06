import {
    Add as AddIcon,
    Group as GroupIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Notifications as NotificationIcon,
    Search as SearchIcon,
} from '@mui/icons-material'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/operations/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/slice/misc'
import { resetNotification } from '../../redux/reducers/slice/chat'

// Lazy load dialogs to optimize performance
const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationDialog = lazy(() => import('../specific/Notification'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

const Header = () => {
    const navigate = useNavigate();
    const { isSearch, isNewGroup, isNotification } = useSelector(state => state.misc);  // Get states from Redux store
    const { notificationCount } = useSelector(state => state.chat);  // Get notification count from Redux
    const dispatch = useDispatch();

    // Mobile menu handler
    const handleMobile = () => {
        dispatch(setIsMobile(true));  // Set the mobile menu state
    }

    // Open the search dialog
    const openSearch = () => {
        dispatch(setIsSearch(true));  // Trigger the search dialog visibility
    }

    // Open the new group dialog
    const openNewGroup = () => {
        dispatch(setIsNewGroup(true));  // Trigger the new group dialog visibility
    }

    // Open the notification dialog
    const openNotification = () => {
        dispatch(setIsNotification(true));  // Trigger notification dialog visibility
        dispatch(resetNotification());  // Reset notification count
    }

    // Navigate to the groups page
    const navigateToGroup = () => {
        navigate('/groups');  // Redirect to the groups page
    }

    // Handle logout functionality
    const logoutHandler = async () => {
        await dispatch(logout());  // Dispatch logout action to Redux
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar position='static' sx={{ backgroundColor: "#ea7070" }}>
                    <Toolbar>
                        {/* App name for larger screens */}
                        <Typography variant='h6' sx={{ display: { xs: "none", sm: "block" } }}>
                            Chat App
                        </Typography>

                        {/* Mobile menu button */}
                        <Box sx={{ display: { xs: "block", sm: "none" } }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Spacer to push icons to the right */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Icons for different functionalities */}
                        <Box>
                            {/* Search icon */}
                            <IconBtn title={"Search"} handler={openSearch} icon={<SearchIcon />} />
                            {/* New Group icon */}
                            <IconBtn title={"New Group"} handler={openNewGroup} icon={<AddIcon />} />
                            {/* Manage Group icon */}
                            <IconBtn title={"Manage Group"} handler={navigateToGroup} icon={<GroupIcon />} />
                            {/* Notification icon with badge */}
                            <IconBtn title={"Notification"} handler={openNotification} icon={<NotificationIcon />} value={notificationCount} />
                            {/* Logout icon */}
                            <IconBtn title={"Logout"} handler={logoutHandler} icon={<LogoutIcon />} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            {/* Conditionally render dialogs based on state */}
            {
                isSearch && (
                    <Suspense fallback={<Backdrop open />}>
                        <SearchDialog open={isSearch} setClose={() => dispatch(setIsSearch(false))} />
                    </Suspense>
                )
            }
            {
                isNotification && (
                    <Suspense fallback={<Backdrop open />}>
                        <NotificationDialog open={isNotification} setClose={() => dispatch(setIsNotification(false))} />
                    </Suspense>
                )
            }
            {
                isNewGroup && (
                    <Suspense fallback={<Backdrop open />}>
                        <NewGroupDialog />
                    </Suspense>
                )
            }
        </>
    )
}

// Reusable Icon Button component with tooltip and optional badge
const IconBtn = ({ title, icon, handler, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={handler}>
                {
                    // Show badge if there's a value (e.g., notification count)
                    value ?
                        <Badge badgeContent={value} color='error'>{icon}</Badge>
                        :
                        icon
                }
            </IconButton>
        </Tooltip>
    )
}

export default Header;
