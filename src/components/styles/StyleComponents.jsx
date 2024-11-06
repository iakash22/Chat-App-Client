import { keyframes, Skeleton, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

// Styled component for a visually hidden input element, used for accessibility purposes
export const VisuallyHiddenInput = styled("input")({
    border: 0,  // Remove border
    clip: "react(0 0 0 0)",  // Clip to hide the input element visually (note the typo)
    height: 1,  // Set the height to 1 to make it visually invisible
    margin: -1,  // Remove any margin
    overflow: "hidden",  // Hide overflow
    padding: 0,  // Remove padding
    position: "absolute",  // Position it absolutely off-screen
    whiteSpace: "nowrap",  // Prevent wrapping of text
    width: 1,  // Set the width to 1 to make it invisible
});

{/* <VisuallyHiddenInput /> */ }  // Usage of VisuallyHiddenInput component

// Styled component for a custom Link component using react-router's Link
export const Link = styled(LinkComponent)`
    text-decoration : none;  // Remove default link underline
    color : black;  // Set the link text color to black
    padding : 1rem;  // Add padding around the link text
    &:hover {  // Add hover effect
        background-color : rgba(0,0,0,0.1);  // Light background on hover
    }
`;

// Styled component for a customizable input box with rounded corners
export const InputBox = styled("input")`
    width : 100%;  // Make the input take the full width
    height : 100%;  // Make the input take the full height
    border : none;  // Remove the default border
    outline: none;  // Remove outline on focus
    border-radius : 1.5rem;  // Apply rounded corners
    padding : 0 3rem;  // Add padding inside the input box
    background-color : rgba(247,247,247,1);  // Set a light background color
`

// Styled component for a search input with padding and rounded corners
export const SearchField = styled("input")`
    padding : 1rem 2rem;  // Add padding to the input
    width : 20vmax;  // Set width to 20% of the viewport width
    border : none;  // Remove the default border
    outline : none;  // Remove outline on focus
    border-radius : 1.5rem;  // Apply rounded corners
    backgroud-color : #f1f1f1;  // Set the background color (misspelled 'background-color')
    font-size : 1.1rem;  // Set the font size
`

// Styled component for a curved button with padding and hover effect
export const CurveButton = styled("button")`
    border-radius : 1.5rem;  // Apply rounded corners to the button
    padding : 1rem 2rem;  // Add padding to the button
    border : none;  // Remove the default border
    outline : none;  // Remove outline on focus
    cursor : pointer;  // Set cursor to pointer on hover
    background-color : black;  // Set black background color
    color : #ffffff;  // Set white text color
    font-size : 1.1rem;  // Set font size
    &:hover {  // Add hover effect
        background-color : rgba(0,0,0,0.8);  // Darken the background on hover
    }
`

// Keyframes for bouncing animation
const bounceAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
`;

const bounceAnimation2 = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(5px); }
    100% { transform: translateY(0px); }
`;

// Styled component for a bouncing skeleton loader with animation
export const BouncingSkeleton = styled(Skeleton)`
    animation: ${bounceAnimation} 1s infinite ease;
`;