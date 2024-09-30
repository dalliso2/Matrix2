import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgressWithLabel from '../LinearProgressWithLabel';
import './fileuploadprogressdialog.css';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import { getInputComponent } from '../InputComponentFactory';
import { TEXT, MULTILINE_TEXT } from '../PropertyType';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const FileUploadProgressDialog2 = ({ open = false, title = undefined, uploadsInProgress = [], successFn, closeFn }) =>
{  
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);

    function change(fileId, event)
    {
        const name = event.target.name;
        const value = event.target.value;

        const field = uploadsInProgress.find((upload) => upload.fileId === fileId);
        field[name] = value;
        if (field[name] !== "")
        {
            field.inputError = false;
            field.helperText = "";
        }
        setRender(!render);
    }

    async function onClickSave()
    {
        let errors = false;
        uploadsInProgress.forEach((upload) => {
            if (!upload.error && upload.userName === "")
            {
                upload.inputError = true;
                upload.helperText = "Name is required";
                errors = true;
            }
        }); 

        if (errors)
            setRender(!render);
        else
        {
            const fileDataArray = uploadsInProgress.map((upload) => ({id:upload.fileId, name:upload.userName, 
                                                                description:upload.userDescription,
                                                                originalName:upload.fileName}));

            // const json = await apiCall({    method:() => apiUpdateFiles(files), 
            //     dispatchFn: dispatch,
            //     waitMessage: "Saving files...",});
            
            successFn(fileDataArray);
        }
    }

    const saveDisabled = !uploadsInProgress.reduce((allComplete, upload)=>allComplete && upload.isComplete(),true) 
                            || uploadsInProgress.reduce((allErrors, upload)=>allErrors && upload.error, true);

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
                    upload.error
                    ?
                    (   <Box key={index}>
                            <Box sx={{pt:2}}>{upload.fileName}</Box>
                            <Box sx={{p:2}}>{upload.errorMessage.message}</Box>
                            <Divider/>
                        </Box>)
                    :
                    (
                        <Box key={index} className="file_upload_progress_dialog--upload_container">
                            <LinearProgressWithLabel value={(upload.loaded * 1.0) / upload.size * 100}/>
                            <Box className="file_upload_progress_dialog--message_container">
                                <span>{upload.fileName}</span><Button disabled={upload.completed} onClick={upload.abortUpload}>Abort</Button>
                            </Box>
                            <Box>
                            {getInputComponent({    name: 'userName', 
                                                    label: 'Name', 
                                                    type: TEXT, 
                                                    value: upload.userName , 
                                                    required: true, 
                                                    error:upload.inputError, 
                                                    helperText:upload.helperText, 
                                                    onChange: (event) => change(upload.fileId, event) })}
                            </Box>
                            <Box>
                            {getInputComponent({
                                    name: 'userDescription', 
                                    label: 'Description',
                                    type: MULTILINE_TEXT,
                                    rows: 2,
                                    required: false,
                                    value: upload.userDescription,
                                    onChange: (event) => change(upload.fileId, event)
                                })}
                            </Box>
                            <Divider/>
                        </Box>
                    ))
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickSave} disabled={saveDisabled}>Save</Button>
                <Button onClick={()=>closeFn([])}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FileUploadProgressDialog2;