import React from 'react'
import { Helmet } from 'react-helmet-async' // Importing the Helmet component for managing document head

// Title component to set dynamic title and description for the page
const Title = ({
    title = "Chat App", // Default title if no title is provided as a prop
    description = "Real time chat with friends" // Default description if no description is provided as a prop
}) => {
    return (
        <Helmet>
            {/* Set the title of the document (browser tab) */}
            <title>{title}</title>

            {/* Set the meta description for the page */}
            <meta name='description' content={description} />
        </Helmet>
    )
}

export default Title;
