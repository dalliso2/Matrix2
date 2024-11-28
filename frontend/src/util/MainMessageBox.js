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
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

import { useDispatch, useSelector } from 'react-redux';
import { removeMessageBoxData, selectMessageBoxData } from '../state/AppSlice';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

export default function MainMessageBox()
{ 
    const theme = useTheme();
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
            <DialogTitle id="alert-dialog-title" sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>
            {messageBoxData.title}
            </DialogTitle>
            <Box>
            <Typography variant="body1" sx={{m:2, whiteSpace:'pre-wrap'}}>
                {messageBoxData.message}
            </Typography>
            </Box>
            <DialogActions>
                <Button onClick={onClickOk}>Ok</Button>
            </DialogActions>
        </Dialog>
        ):undefined
    );
}