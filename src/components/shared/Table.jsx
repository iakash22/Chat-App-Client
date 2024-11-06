import { Container, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { matBlack } from '../constants/Color'

// Table component to render a data grid with a custom heading and styling

const Table = ({rows, columns, heading, rowHeight=52}) => {
    return (
        // Container to wrap the table and ensure it occupies full height of the viewport
        <Container
            sx={{
                height : "100vh" // Full viewport height
            }}
        >
            {/* Paper component for styling, giving the table a card-like appearance with padding */}
            <Paper
                elevation={3} // Adds shadow to the paper for a card-like appearance
                sx={{
                    padding: "1rem 4rem", // Padding around the table
                    borderRadius: "1rem", // Rounded corners for the table container
                    margin: "auto", // Centering the table horizontally
                    width: "100%", // Full width of the container
                    overflow: "hidden", // Ensures the content doesn't overflow
                    height : "100%", // Full height of the container
                    boxShadow : "none" // Disables default shadow to keep the focus on custom styling
                }}
            >
                {/* Heading section */}
                <Typography
                    textAlign={"center"} // Center-align the text
                    variant='h4' // Heading size (h4)
                    sx={{
                        margin : "2rem", // Margin around the heading for spacing
                        textTransform : "uppercase", // Makes the heading text uppercase
                    }}
                >
                    {heading} {/* Display the heading passed as a prop */}
                </Typography>
                
                {/* DataGrid component to display rows and columns in a table format */}
                <DataGrid
                    rows={rows} // Data rows to be displayed in the table
                    columns={columns} // Column headers and configurations
                    rowHeight={rowHeight} // Set the row height, default 52px
                    style={{
                        height : "80vh", // Table occupies 80% of the viewport height
                    }}
                    sx={{
                        border: "none", // Removes the border from the table
                        ".table-header": {
                            bgcolor: matBlack, // Background color of the table header
                            color : "#FFFFFF", // Text color for the header
                        }
                    }}
                >
                </DataGrid>
            </Paper>
        </Container>
    )
}

export default Table;
