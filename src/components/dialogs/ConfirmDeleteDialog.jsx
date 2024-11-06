import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

const ConfirmDeleteDialog = ({ open, closeHandler, deleteHandler }) => {
    return (
        <Dialog open={open} onClose={closeHandler}>
            {/* Dialog title indicating the purpose of the dialog */}
            <DialogTitle>
                Confirm Delete
            </DialogTitle>

            {/* Dialog content with message text */}
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this group?
                </DialogContentText>
            </DialogContent>

            {/* Dialog actions for user response */}
            <DialogActions>
                <Button onClick={closeHandler}>No</Button> {/* Button to close the dialog without deleting */}
                <Button onClick={deleteHandler} color='error'>Yes</Button> {/* Button to confirm deletion */}
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDeleteDialog;
