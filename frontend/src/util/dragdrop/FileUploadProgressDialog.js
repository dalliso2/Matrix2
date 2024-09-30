import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgressWithLabel from '../LinearProgressWithLabel';
import './fileuploadprogressdialog.css';

const FileUploadProgressDialog = ({ open = false, title = undefined, uploadsInProgress = [] }) =>
{  
    return (
        <Dialog     open={open} 
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                {
                    uploadsInProgress.map((upload, index) =>
                    (
                        <div key={index} className="file_upload_progress_dialog--upload_container">
                            <LinearProgressWithLabel value={(upload.loaded * 1.0) / upload.size * 100}/>
                            <div className="file_upload_progress_dialog--message_container">
                                <span>{upload.fileName}</span><Button onClick={upload.abortUpload}>Abort</Button>
                            </div>
                        </div>
                    ))
                }
            </DialogContent>
        </Dialog>
    );
}

export default FileUploadProgressDialog;