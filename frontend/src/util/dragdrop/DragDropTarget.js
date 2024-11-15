import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import FileUploadProgressDialog from './FileUploadProgressDialog';
import FileUpload from './FileUpload';
import './dragdroptarget.css';
import { getMessageBoxAPIError } from '../utils';
import { selectAuthToken, setMessageBoxData } from '../../state/AppSlice';
import { useSelector } from 'react-redux';

const DragDropTarget = ({fileIdsCallback, caseId, accept=undefined, multiple=true, dispatch }) =>
{
    const authToken = useSelector(selectAuthToken);

    const messageBoxKey = "DRAG_DROP_TARGET_MESSAGE_BOX_KEY";
    const [dragActive, setDragActive] = useState(false);
    const [uploadsInProgress, setUploadsInProgress] = useState([]);
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [errorMessageDialogOpen, setErrorMessageDialogOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const inputRef = React.useRef(null);

    useEffect(() => 
    {
        if (uploadsInProgress.length === 0)
        {
            setProgressDialogOpen(false);
            if (errorMessages.length)
            {
                dispatch(setMessageBoxData(messageBoxKey,"Upload Errors", errorMessages.join("\n"))); 
            }
        }
    },[uploadsInProgress]);

    useEffect(() =>
    {
    },[errorMessages]);

    const handleDrag = function(e) 
    {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") 
        {
            setDragActive(true);
        } 
        else if (e.type === "dragleave") 
        {
            setDragActive(false);
        }
    };
    
    const handleDrop = function(e) 
    {
        e.preventDefault();
        e.stopPropagation();

        const errors = [];

        const files = e.dataTransfer.files;
        if (files.length > 1 && !multiple)
        {
            // error, only allow 1 file to be dropped
            errors.push("Only one file may be dropped in this location.")
        }

        // check mime types
        if (accept)
        {
            let tempAccept = accept;
            const slashIndex = accept.indexOf('/');
            if (slashIndex > 0)
                tempAccept = accept.slice(0,slashIndex);
            
            for (const file of files)
            {
                if (!file.type.includes(tempAccept))
                {
                    errors.push("File(s) must be of type " + accept);
                    break;
                }
            }
        }

        setDragActive(false);
        if (errors.length)
        {
            setErrorMessages(oldErrors => [...oldErrors].concat(errors));
            // trigger error dialog
            setUploadsInProgress([]);
        }
        else if (e.dataTransfer.files && e.dataTransfer.files.length) 
        {
            uploadFiles(e.dataTransfer.files)
        } 
    };

    const uploadFiles = (files) =>
    {
        setProgressDialogOpen(true);
    
        var tempFileId = -1;
        for (const file of files)
        {
            file.tempFileId = tempFileId--;
            const uploadInProgress = new FileUpload(file, caseId, authToken, (fileUpload) => 
            {   
                if (fileUpload?.completed)
                {
                    fileIdsCallback(fileUpload.fileId);
                }

                setUploadsInProgress((prevState) => 
                {
                    var nextState = [...prevState];

                    if (fileUpload?.completed)
                    {
                        nextState = nextState.filter((item) => item.tempFileId != fileUpload.tempFileId);
                    }
                    if (fileUpload?.error)
                    { 
                        setErrorMessages((oldErrorMessages) => [...oldErrorMessages].concat(["Error uploading file " + fileUpload.fileName + "\n"
                                                    + getMessageBoxAPIError(fileUpload.errorMessage)]));

                        nextState = nextState.filter((item) => item.tempFileId != fileUpload.tempFileId);
                    }
                    if (fileUpload?.abort)
                    {
                        setErrorMessages((oldErrorMessages) => [...oldErrorMessages].concat(["Error uploading file " + fileUpload.fileName + "\n"
                            + getMessageBoxAPIError(fileUpload.errorMessage)]));
                        nextState = nextState.filter((item) => item.tempFileId != fileUpload.tempFileId);
                    }

                    return nextState;
                });
            });
            setUploadsInProgress((prevState) => { [...prevState].push(uploadInProgress); return prevState; });
        };
    }

    // triggers when file is selected with click
    const handleChange = (e) =>
    {
        e.preventDefault();
        
        if (e.target.files && e.target.files.length) 
        {
            uploadFiles(e.target.files); 
        }
    };
    
    // triggers the input when the button is clicked
    const onButtonClick = () => 
    {
        inputRef.current.click();
    }; 

    return (
        <Box className="drag_drop_target">
            <FileUploadProgressDialog open={progressDialogOpen} title="Upload Progress" message="" uploadsInProgress={uploadsInProgress} />
             <Box className={"drag_drop_target--drop_area " + (dragActive ? "drag-active" : "")} 
                onClick={onButtonClick} 
                onDragEnter={handleDrag} 
                onDragLeave={handleDrag} 
                onDragOver={handleDrag} 
                onDrop={handleDrop}>
                <form className="drag_drop_target--form-file-upload" onSubmit={(e) => e.preventDefault()}>
                    <input ref={inputRef} accept={accept} type="file" className="drag_drop_target--input-file_upload"  multiple={true} onChange={handleChange} />
                </form>
            </Box>
        </Box>
    );
}

export default DragDropTarget;