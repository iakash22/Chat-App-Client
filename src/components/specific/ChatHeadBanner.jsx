import {
    ArrowBack as ArrowBackIcon,
    CallOutlined as CallOutlinedIcon,
    InfoOutlined as InfoOutlinedIcon,
    VideocamOutlined as VideocamOutlinedIcon
} from '@mui/icons-material'
import { Avatar, Drawer, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsChatInfo } from '../../redux/reducers/slice/misc'
import AvatarCard from '../shared/AvatarCard'
import { ChatBanner } from '../styles/StyleComponents'
import ChatDetails from './ChatDetails'

const ChatHeadBanner = ({ data }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { name: groupName, groupChat, avatar = [], _id, friendName } = data || {};
    const { isChatInfo } = useSelector(state => state.misc);

    const openHandler = () => {
        dispatch(setIsChatInfo(true));
    }
    const closeHandler = () => {
        dispatch(setIsChatInfo(false));
    }
    const voiceCallHandler = () => {
        const url = `/call/?video=false&chatId=${_id}`;
        navigate(url)
        // console.log('Voice Call');
    }
    const videoCallHandler = () => {
        const url = `/call/?video=true&chatId=${_id}`;
        navigate(url)
        // console.log('Video Call');
    }

    return (
        <ChatBanner>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "1rem",
                }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer"
                    }}
                    onClick={() => navigate('/')}
                >
                    <Tooltip title="back">
                        <ArrowBackIcon
                            sx={{
                                cursor: "pointer"
                            }}
                        />
                    </Tooltip>
                    {
                        groupChat ?
                            <AvatarCard avatar={avatar} />
                            :
                            <Avatar src={avatar[0]} />
                    }
                </div>
                <Typography
                    variant='body1'
                    sx={{
                        textTransform: "capitalize",
                        fontSize: "18px",
                        fontWeight: 500,
                        width: "8rem",
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderRadius: "2px",
                        textAlign: "start",
                        ":hover": {
                            backgroundColor: "rgba(0,0,0,0.09)",
                            transition: "all 0.3s ease"
                        }
                    }}
                >
                    {groupChat ? groupName : friendName}
                </Typography>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                alignItems: "center"
            }}>
                {
                    !groupChat && <TooltipIconButton
                        title={"Voice Call"}
                        Icon={CallOutlinedIcon}
                        handler={voiceCallHandler}
                    />
                }
                {
                    !groupChat && <TooltipIconButton
                        title={"Video Call"}
                        Icon={VideocamOutlinedIcon}
                        handler={videoCallHandler}
                    />
                }
                <TooltipIconButton
                    title={"Chat Info"}
                    Icon={InfoOutlinedIcon}
                    handler={openHandler}
                />
            </div>

            <Drawer
                open={isChatInfo} onClose={closeHandler} anchor={'right'} aria-hidden="true">
                <ChatDetails chatId={_id} />
            </Drawer>

        </ChatBanner>
    )
}

export default ChatHeadBanner

const TooltipIconButton = ({ Icon, handler, title }) => {
    return (
        <Tooltip title={title} placement='top'>
            <Icon
                sx={{
                    fontSize: "2rem",
                    color: "#000",
                    cursor: "pointer",
                }}
                onClick={handler}
            />
        </Tooltip>
    )
};