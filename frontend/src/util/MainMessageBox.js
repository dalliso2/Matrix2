//  MainMessageBox
//
//  A modal message box displayed through the MatrixAppSlice state.  The data used
//  to configure the message box is retrieved through the selectMessageBoxData 
//  selector.  It is removed when the user clicks the OK button.
//
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessageBoxData, selectMessageBoxData } from '../state/AppSlice';

export default function MainMessageBox()
{ 
    const messageBoxData = useSelector(selectMessageBoxData);    
    const dispatch = useDispatch();
    
    const onClickOk = () =>
    {
        dispatch(removeMessageBoxData(messageBoxData.key));
    }
    
    return (
        messageBoxData?(
        <Dialog     open={true} 
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
            {messageBoxData.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{whiteSpace:'pre-wrap'}}>
                {messageBoxData.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickOk}>Ok</Button>
            </DialogActions>
        </Dialog>
        ):undefined
    );
}