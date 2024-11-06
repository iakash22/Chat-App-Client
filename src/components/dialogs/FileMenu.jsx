import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/slice/misc';
import {
    AudioFile as AudioFileIcon,
    Image as ImageIcon,
    UploadFile as UploadFileIcon,
    VideoFile as VideoFileIcon,
} from '@mui/icons-material';
import { useSendAttachmentsMutation } from '../../redux/api';
import toast from 'react-hot-toast';

const FileMenu = ({ anchorE1, chatId }) => {
    // Refs for each input to simulate click for file selection
    const imageRef = useRef();
    const audioRef = useRef();
    const videoRef = useRef();
    const fileRef = useRef();

    // Redux selectors and dispatch for managing state
    const { isFileMenu } = useSelector(state => state.misc);
    const dispatch = useDispatch();
    const [sendAttachments] = useSendAttachmentsMutation();

    // Closes the file menu
    const closeHandler = () => dispatch(setIsFileMenu(false));

    // Simulates a click event on the respective file input
    const onClickHandler = (ref) => {
        ref.current?.click();
    };

    // Handles file selection and uploads them to the server
    const fileChangeHandler = async (e, key) => {
        const files = Array.from(e.target.files);

        // Return if no files selected
        if (files.length <= 0) return;

        // Limit file count to 5
        if (files.length > 5) {
            return toast.error(`You can send only 5 ${key} at a time`);
        }

        // Show uploading loader and toast notification
        dispatch(setUploadingLoader(true));
        const toastId = toast.loading(`Sending ${key}...`);
        closeHandler();

        try {
            const myform = new FormData();
            myform.append("chatId", chatId);
            files.forEach((file) => myform.append("files", file));

            // Send attachments
            const res = await sendAttachments(myform);
            if (res.data) {
                toast.success(`${key} sent successfully`, { id: toastId });
            } else {
                toast.error(`Failed to send ${key}`, { id: toastId });
            }
        } catch (error) {
            toast.error(error, { id: toastId });
            console.log(error);
        } finally {
            dispatch(setUploadingLoader(false));
        }
    };

    return (
        <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeHandler}>
            <div style={{ width: "10rem" }}>
                <MenuList>
                    {/* Image upload menu item */}
                    <MenuItem onClick={() => onClickHandler(imageRef)}>
                        <Tooltip title="Image" placement='left'>
                            <ImageIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
                        <input
                            type='file'
                            multiple
                            accept='image/png, image/jpeg, image/gif'
                            style={{ display: "none" }}
                            onChange={e => fileChangeHandler(e, "Images")}
                            ref={imageRef}
                        />
                    </MenuItem>

                    {/* Audio upload menu item */}
                    <MenuItem onClick={() => onClickHandler(audioRef)}>
                        <Tooltip title="Audio" placement='left'>
                            <AudioFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
                        <input
                            type='file'
                            multiple
                            accept='audio/mpeg, audio/wav'
                            style={{ display: "none" }}
                            onChange={e => fileChangeHandler(e, "Audios")}
                            ref={audioRef}
                        />
                    </MenuItem>

                    {/* Video upload menu item */}
                    <MenuItem onClick={() => onClickHandler(videoRef)}>
                        <Tooltip title="Video" placement='left'>
                            <VideoFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
                        <input
                            type='file'
                            multiple
                            accept='video/mp4, video/webm, video/ogg'
                            style={{ display: "none" }}
                            onChange={e => fileChangeHandler(e, "Videos")}
                            ref={videoRef}
                        />
                    </MenuItem>

                    {/* General file upload menu item */}
                    <MenuItem onClick={() => onClickHandler(fileRef)}>
                        <Tooltip title="File" placement='left'>
                            <UploadFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
                        <input
                            type='file'
                            multiple
                            accept='*'
                            style={{ display: "none" }}
                            onChange={e => fileChangeHandler(e, "Files")}
                            ref={fileRef}
                        />
                    </MenuItem>
                </MenuList>
            </div>
        </Menu>
    );
}

export default FileMenu;
