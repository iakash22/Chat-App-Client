import { Add as AddIcon, Close as CloseIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Skeleton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sampleUsers } from '../components/constants/sampleData'
import { LayoutLoaders } from '../components/layouts/Loaders'
import AvatarCard from '../components/shared/AvatarCard'
import UserItem from '../components/shared/UserItem'
import { Link } from '../components/styles/StyleComponents'
import { useAsyncMutation, useErrors } from '../hooks'
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupNameMutation } from '../redux/api'
import { setIsAddMember, setIsDeleteGroup, setIsMobile } from '../redux/reducers/slice/misc'
const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));


const Groups = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupNameUpdate, setGroupNameUpdate] = useState("");
    const chatId = useSearchParams()[0].get('group');
    const { isAddMember, isMobile, isDeleteGroup } = useSelector(state => state.misc);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myGroupsData = useMyGroupsQuery("");
    const groupDetailsData = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId })
    const [renameGroupName, isLoadingGroupName] = useAsyncMutation(useRenameGroupNameMutation);
    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);
    // console.log(name,members);

    // console.log();
    const errors = [
        { isError: myGroupsData.isError, error: myGroupsData.error },
        { isError: groupDetailsData.isError, error: groupDetailsData.error }
    ];

    const groupData = groupDetailsData?.data;
    useEffect(() => {
        if (groupDetailsData?.data) {
            setGroupName(groupData?.chat?.name);
            setGroupNameUpdate(groupData?.chat?.name);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdate("");
            setIsEdit(false);
        }
    }, [groupDetailsData?.data])

    useEffect(() => {
        if (chatId) {
            setGroupName("" + chatId);
            setGroupNameUpdate("Group Name " + chatId);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdate("");
            setIsEdit(false);
        }
    }, [chatId])

    const handleMobileMenu = () => {
        dispatch(setIsMobile(true));
    }

    const updateGroupName = async () => {
        if (groupNameUpdate === groupData?.chat?.name) {
            return toast.error("Group Name Same");
        }
        if (groupNameUpdate.includes("Group Name")) {
            return toast.error("Please Enter Group Name");
        }
        setIsEdit(false);
        await renameGroupName("Group Name Updating....", null, { chatId, name: groupNameUpdate })
    }

    const addMemberHandler = () => {
        dispatch(setIsAddMember(true));
    }

    const openConfirmDeleteHandler = () => {
        dispatch(setIsDeleteGroup(true));
    }

    const closeConfirmDeleteHandler = () => {
        dispatch(setIsDeleteGroup(false));
    }

    const deleteHandler = async () => {
        deleteGroup("Group Deleting...", null, chatId);
        closeConfirmDeleteHandler();
        navigate('/groups');
    }

    const removeMemberHandler = async (userId, name) => {
        await removeMember(`${name} removing...`, null, { chatId, userId });
        // console.log("remove", name, chatId, userId);
    }

    useErrors(errors);

    return (
        myGroupsData.isLoading ?
            <LayoutLoaders />
            :
            <Grid container height={"100vh"}>
                <Grid
                    item
                    sm={4}
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block"
                        },
                    }}
                >
                    <GroupList loading={myGroupsData.isLoading} myGroupsData={myGroupsData?.data?.data} chatId={chatId} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={8}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        padding: "1rem 3rem",
                    }}
                >
                    <IconButtons handlerMobile={handleMobileMenu} />
                    {groupName && (
                        <>
                            <GroupName
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                updateGroupName={updateGroupName}
                                value={groupName}
                                setValue={setGroupName}
                                updateValue={groupNameUpdate}
                                setUpdateValue={setGroupNameUpdate}
                                loading={isLoadingGroupName}
                            />

                            <Typography
                                margin={"2rem"}
                                alignSelf={"flex-start"}
                                variant='body1'
                            >
                                Members
                            </Typography>
                            <Stack
                                maxWidth={"45rem"}
                                width={"100%"}
                                boxSizing={"border-box"}
                                padding={{
                                    sm: "1rem",
                                    xs: "0",
                                    md: "1rem 4rem",
                                }}
                                spacing={"0rem"}
                                height={"50vh"}
                                overflow={"auto"}
                            >
                                {
                                    sampleUsers.length > 0 ?
                                        (
                                            isLoadingRemoveMember ?
                                                <CircularProgress />
                                                :
                                                groupData?.chat?.members.map((user) => (
                                                    <UserItem
                                                        key={user?._id}
                                                        user={user}
                                                        isAdded={true}
                                                        handler={removeMemberHandler}
                                                        styling={{
                                                            boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                                            padding: "1rem 2rem",
                                                            borderRadius: "1rem",
                                                        }}
                                                    />
                                                ))
                                        )
                                        :
                                        (
                                            <Typography textAlign={"center"} color={"gray"}>
                                                No Member
                                            </Typography>
                                        )
                                }
                            </Stack>

                            <ButtonGroup
                                deleteHandler={openConfirmDeleteHandler}
                                addHandler={addMemberHandler}
                            />
                        </>
                    )}
                </Grid>

                {
                    isAddMember && (
                        <Suspense fallback={<Backdrop open />}>
                            <AddMemberDialog
                                chatId={chatId}
                            />
                        </Suspense>
                    )
                }
                {
                    isDeleteGroup && (
                        <Suspense fallback={<Backdrop open />}>
                            <ConfirmDeleteDialog
                                open={isDeleteGroup}
                                closeHandler={closeConfirmDeleteHandler}
                                deleteHandler={deleteHandler}
                            />
                        </Suspense>
                    )
                }

                <Drawer
                    sx={{
                        display: {
                            xs: "block",
                            sm: "none"
                        },
                    }}
                    open={isMobile}
                    onClose={() => dispatch(setIsMobile(false))}
                >
                    <GroupList w={"60vw"} myGroupsData={myGroupsData?.data?.data} chatId={chatId} />
                </Drawer>
            </Grid>
    )
}

export default Groups

const IconButtons = memo(({ handlerMobile }) => {
    const navigate = useNavigate();
    const navigateBack = () => navigate('/');
    return (
        <>
            <Box
                sx={{
                    display: {
                        sx: "block",
                        sm: "none",
                    },
                    position: "fixed",
                    top: "1rem",
                    right: "1rem",
                }}>
                <IconButton onClick={handlerMobile}>
                    <MenuIcon />
                </IconButton>
            </Box>

            <Tooltip title="back">
                <IconButton sx={{
                    position: "absolute",
                    top: "2rem",
                    left: "2rem",
                    bgcolor: "#1c1c1c",
                    color: "#fff",
                    ":hover": {
                        bgcolor: "rgba(0,0,0,0.75)"
                    }
                }}
                    onClick={navigateBack}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>
            </Tooltip>
        </>
    )
})

const ButtonGroup = ({ deleteHandler, addHandler }) => {
    return (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row"
            }}
            spacing={"1rem"}
            p={{
                xs: "0rem",
                sm: "1rem",
                md: "1rem 4rem",
            }}
        >
            <Button size='large' color='error' startIcon={<DeleteIcon />} onClick={deleteHandler}>
                Delete Group
            </Button>
            <Button variant='contained' size='large' startIcon={<AddIcon />} onClick={addHandler}>
                Add Member
            </Button>
        </Stack>
    )
}

const GroupName = ({ isEdit, setIsEdit, updateGroupName, value, setValue, updateValue, setUpdateValue, loading }) => {
    return (
        <Stack
            direction={"row"}
            alignContent={"center"}
            justifyContent={"center"}
            spacing={"1rem"}
            padding={"3rem"}
        >
            {isEdit ? (
                <>
                    <TextField
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                    />
                    <IconButton onClick={() => setIsEdit(false)} disabled={loading} >
                        <CloseIcon />
                    </IconButton>
                    <IconButton onClick={updateGroupName} disabled={loading} >
                        <DoneIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <Typography variant='h4'>{value}</Typography>
                    <IconButton onClick={() => setIsEdit(true)} disabled={loading}>
                        <EditIcon />
                    </IconButton>
                </>
            )}
        </Stack>
    )
}

const GroupList = memo(({ w = "100%", myGroupsData = [], chatId, loading }) => {
    return (
        <Stack width={w} bgcolor={"#45474B"} height={"100vh"}  >
            {
                loading ? <Skeleton />
                    :
                    myGroupsData.length > 0 ? (
                        myGroupsData.map((group) => {
                            return (
                                <GroupListItem
                                    group={group}
                                    chatId={chatId}
                                    key={group?._id}
                                />
                            )
                        })
                    ) : (
                        <Typography textAlign={"center"} padding={"1rem"}>
                            No groups
                        </Typography>
                    )
            }
        </Stack>
    )
})

const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;
    return (
        <Link to={`?group=${_id}`} onClick={(e) => {
            if (chatId === _id) e.preventDefault();
        }}>
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AvatarCard avatar={avatar} />
                <Typography>{name}</Typography>
            </Stack>
        </Link>
    )
})