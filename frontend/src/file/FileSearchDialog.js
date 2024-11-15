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
import { useLazySearchFilesNotLinkedToEntityQuery } from "../api/FileApi";
import IconButton from "@mui/material/IconButton";
import { AddLinkSharp } from "@mui/icons-material";
import { useAddFilesToEntityMutation } from "../api/EntityApi";
import { useEffect } from "react";
import { handleMutationResults } from "../api/ApiUtils";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function FileSearchDialog({entityId, closeFn})
{
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const [filterString, setFilterString] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [searchFilesFn, searchFilesQueryStatus] = useLazySearchFilesNotLinkedToEntityQuery();
    useEffect(() => {   
        if (searchFilesQueryStatus.isSuccess)
            setSearchResults(searchFilesQueryStatus.data.payload);
    }, [searchFilesQueryStatus?.isFetching]);


    const [addFilesToEntityFn, addFilesToEntityMutationState] = useAddFilesToEntityMutation();
    handleMutationResults(addFilesToEntityMutationState, dispatch, navigate, true, "Linking file to entity..",
        "Error linking file to entity", 
        ()=>addFilesToEntityMutationState.data.payload.forEach(entityFile=>enqueueSnackbar("Added link to file: " + entityFile.mfile.name, {variant:'success'})),
        ()=>{ searchFilesFn({entityId:entityId, searchString:filterString});});
    
    function removeFileFromResults(fileId)
    {
        setSearchResults((oldResults)=>oldResults.filter(file=>file.id!==fileId));
        addFilesToEntityFn([{matrixEntity:entityId, mFile:fileId}]);
    }

    const rows = searchResults && searchResults.map(file=>(
        {   rowProperties:{id:file.id}, 
            sx:{},
            values: [{value:<IconButton onClick={()=>removeFileFromResults(file.id)}><AddLinkSharp/></IconButton>},
                        {value:file.name}, 
                        {value:file.description}, 
                        {value:file.originalName}]
        })
    );

    function close()
    {
        setSearchResults([]);
        closeFn();
    }

    return (
        <Dialog open={true} fullWidth={true} maxWidth={'md'} 
                PaperProps={{sx: {minHeight: '80%', maxHeight: '80%'}
                }}>
            <DialogTitle>Search Files</DialogTitle>
            <DialogContent sx={{display:'flex', flexDirection:'column'}}>
                <Box sx={{display:'flex', gap:'10px', justifyContent:'flex-end', pb:2}}>
                    <Button onClick={()=>searchFilesFn({entityId:entityId, searchString:filterString})}>Search</Button>
                    <TextField onChange={event=>setFilterString(event.target.value)} fullWidth
                                        size="small" sx={{width:'40ch'}} value={filterString}/>   
                </Box>      
                {
                    <Box sx={{display:'flex', height:'100%', flexGrow:1, overflow:'auto'}}>
                        <Grid columnHeadings={['Link','Name', 'Description', 'Original Name']} 
                                rowValues={searchFilesQueryStatus?.isFetching?[]:rows || []}
                                isLoading={searchFilesQueryStatus.isFetching}
                                noResultsMessage={searchFilesQueryStatus.isSuccess && rows.length===0 && "No results found"}/>
                    </Box>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>close()}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}