import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Box } from "@mui/material";
import Grid from "../util/Grid";
import IconButton from "@mui/material/IconButton";
import { AddLinkSharp } from "@mui/icons-material";
import { useEffect } from "react";
import { handleMutationResults } from "../api/ApiUtils";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useLazySearchFilesNotLinkedToTaskQuery } from "../api/TaskApi";
import { handleQueryError } from "../api/ApiUtils";
import { api } from "../api/BaseApi";
import { useAddTaskFilesMutation } from "../api/TaskApi";
import { useNavigate } from "react-router-dom";

export default function TaskFileSearchDialog({taskId, closeFn})
{
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const [filterString, setFilterString] = useState('');

    const [searchFilesFn, searchTaskFilesQueryStatus] = useLazySearchFilesNotLinkedToTaskQuery();
    const searchResults = searchTaskFilesQueryStatus?.currentData?.payload;
    useEffect(() => {  
        if (searchTaskFilesQueryStatus.isError)
            handleQueryError(searchTaskFilesQueryStatus, dispatch, navigate);
    } ,[searchTaskFilesQueryStatus.isError]);

    const [addTaskFiles, addFilesToTaskMutationState] = useAddTaskFilesMutation();
    
    handleMutationResults(addFilesToTaskMutationState, dispatch, navigate, false, "Saving link to file..",
        "Error linking file to task", 
        ()=>addFilesToTaskMutationState.data.payload.forEach(taskFile=>enqueueSnackbar("Added link to file: " + taskFile.matrixFile.name, {variant:'success'})),
        ()=>{ });

    function onClickLink(fileId)
    {
        addTaskFiles([{taskId, fileId}]);

        // remove from cached search results
        dispatch(api.util.updateQueryData('searchFilesNotLinkedToTask',
            searchTaskFilesQueryStatus.originalArgs,
            (cache)=>{
                cache.payload = cache.payload.filter(file=>file.id!==fileId);
                return cache;
            })); 
            
    }

    function removeFileFromResults(fileId)
    {
        // setSearchResults((oldResults)=>oldResults.filter(file=>file.id!==fileId));
        // addFilesToEntityFn([{matrixEntity:entity.id, mFile:fileId}]);
    }

    const rows = searchResults && searchResults.map(file=>(
        {   rowProperties:{id:file.id}, 
            sx:{},
            values: [{value:<IconButton onClick={()=>onClickLink(file.id)}><AddLinkSharp/></IconButton>},
                        {value:file.name}, 
                        {value:file.description}, 
                        {value:file.originalName}]
        })
    );

    function close()
    {
        //setSearchResults([]);
        closeFn();
    }

    return (
        <Dialog open={true} fullWidth={true} maxWidth={'md'} 
                PaperProps={{sx: {minHeight: '80%', maxHeight: '80%'}
                }}>
            <DialogTitle>Search Files</DialogTitle>
            <DialogContent sx={{display:'flex', flexDirection:'column'}}>
                <Box sx={{display:'flex', gap:'10px', justifyContent:'flex-end', pb:2}}>
                    <Button onClick={()=>searchFilesFn({taskId, searchText:filterString})}>Search</Button>
                    <TextField onChange={event=>setFilterString(event.target.value)} fullWidth
                                        size="small" sx={{width:'40ch'}} value={filterString}/>   
                </Box>      
                {
                    <Box sx={{display:'flex', height:'100%', flexGrow:1, overflow:'auto'}}>
                        <Grid columnHeadings={['Link','Name', 'Description', 'Original Name']} 
                                rowValues={searchTaskFilesQueryStatus?.isFetching?[]:rows || []}
                                isFetching={searchTaskFilesQueryStatus.isFetching}
                                noResultsMessage={searchTaskFilesQueryStatus.isSuccess && rows?.length===0 && "No results found"}/>
                    </Box>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>close()}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}