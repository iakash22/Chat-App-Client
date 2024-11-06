import React from 'react'
import { transformImage } from '../../libs/features';
import { FileOpen as FileOpenIcon} from '@mui/icons-material';

// RenderAttachment component renders different types of file attachments based on the file type.
const RenderAttachment = ({ file, url }) => {
    // Switch based on the file type (video, image, audio, or other)
    switch (file) {
        case "video":
            // Renders a video player for video attachments
            return <video src={url} preload='none' width={"200px"} controls /> // The `controls` attribute allows the user to play, pause, and control volume
        case "image":
            // Renders an image for image attachments
            return <img
                src={transformImage(url, 200)} // Transforms the image URL (likely resizes it to fit the display)
                width={"200px"} // Set the width of the image
                height={"150px"} // Set the height of the image
                alt='attachment' // Alt text for accessibility
                style={{
                    objectFit: "contain", // Ensures the image is contained within the specified dimensions without stretching
                }}
            />
        case "audio":
            // Renders an audio player for audio attachments
            return <audio src={url} preload='none' controls /> // The `controls` attribute allows the user to play/pause the audio and control volume
        default:
            // If the file type is not recognized, display a default File Open icon
            return <FileOpenIcon /> // Icon for unsupported file types
    }
}

// Export the component for use in other parts of the application
export default RenderAttachment;
