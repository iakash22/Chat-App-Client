import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, Skeleton, Stack, styled, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useErrors } from '../../hooks';
import { useChatDetailsQuery } from '../../redux/api';
import { setIsChatInfo } from '../../redux/reducers/slice/misc';
import AvatarCard from '../shared/AvatarCard';
import { Link } from '../styles/StyleComponents';


const ChatDetails = memo(({ chatId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { data, isLoading, isError, error } = useChatDetailsQuery({ chatId, populate: true });
    const chat = data?.chat;
    // console.log(chat);
    useErrors([{ isError, error }]);
    // console.log(chat);
    return (
        <Box
            component={"section"}
            sx={{
                width: "30vh",
                padding: "1rem 0",
            }}
        >
            <Stack
                alignItems={"center"}
                direction={"row"}
                marginBottom={"0.5rem"}
                spacing={"0.2rem"}
            >
                <Tooltip title={"back"} placement='left'>
                    <IconButton onClick={() => dispatch(setIsChatInfo(false))}>
                        <ArrowBackIcon
                            sx={{
                                cursor: "pointer"
                            }}
                        />
                    </IconButton>
                </Tooltip>
                <Typography
                    variant='h5'
                >
                    Details
                </Typography>
            </Stack>

            <Divider flexItem />

            <Stack
                direction={"column"}
            >
                <Typography
                    variant='h7'
                    sx={{ margin: "1.2rem 0", paddingX: "1rem", fontWeight: "600" }}
                >
                    Members
                </Typography>

                <Stack
                    direction={"column"}
                    spacing={"0.1rem"}
                >
                    {
                        isLoading ?
                            <Skeleton />
                            :
                            chat?.members ?
                                chat?.members.map((member) => (
                                    user._id !== member._id && (
                                        <ChatMember
                                            key={member?._id}
                                            avatar={member?.avatar}
                                            name={member?.name}
                                            username={member?.username}
                                        />)
                                ))
                                :
                                <>No members</>
                    }
                </Stack>
            </Stack>
        </Box>
    )
})



export default ChatDetails

const ChatMember = ({
    username,
    avatar,
    _id,
    groupChat,
    name,
    index,
}) => {
    const StyledMotionDiv = styled(motion.div)`
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: #fff;
        color: white;
        gap: 1rem;
        position: relative;
        width: 100%;
        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
    `;
    return (
        <Link
            sx={{ padding: "0", width: "100%" }}
            to={`/user/${username}`}
        >
            <StyledMotionDiv
                initial={{ opacity: 0, x: "100%" }}
                whileInView={{ opacity: 1, x: "0" }}
                transition={{ delay: index * 0.1 }}
            >
                <Avatar
                    sx={{ width: 45, height: 45 }}
                    src={avatar}
                    alt={name}
                />
                <Typography
                    sx={{
                        textTransform: "capitalize",
                        color: "#000",
                        fontWeight: "500",
                    }}>
                    {name}
                </Typography>
            </StyledMotionDiv>
        </Link>
    )
}