import React from "react";
import Grid from '../util/Grid';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinkOffTwoToneIcon from '@mui/icons-material/LinkOffTwoTone';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import { apiGetFile } from "../api/file";
import { useGetEntityFilesQuery, useRemoveEntityFileMutation } from "../api/EntityApi";
import FileSearchDialog from "../file/FileSearchDialog";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import AddLinkSharp from "@mui/icons-material/AddLinkSharp";
import { handleMutationResults } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import RefreshIcon from '@mui/icons-material/Refresh';
import { api } from "../api/BaseApi";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";

const headers = ["File name", "Description", "Download", "Unlink"];

export default function EntityFiles({entityId, unlink=true, sx={}})
{
    const dispatch = useDispatch();
    const [showFileSearchDialog, setShowFileSearchDialog] = React.useState(false);

    //
    // function to fetch entity files
    //
    const {refetch:refetchEntityFiles, ...entityFilesQueryResults} = useGetEntityFilesQuery(entityId);
    const entityFiles = entityFilesQueryResults?.data?.payload;
    useEffect(() => {
        handleQueryResultsWithWaitMessage(entityFilesQueryResults, dispatch);
    }, [entityFilesQueryResults.isFetching]);

    //
    // code to unlink a file
    //
    const [removeEntityFile, removeEntityFileMutationState] = useRemoveEntityFileMutation();
    handleMutationResults(removeEntityFileMutationState, dispatch,
        ()=>enqueueSnackbar("Removed link to file " + removeEntityFileMutationState.data.payload.mfile.name, {variant:'success'}),
        ()=>enqueueSnackbar("Unable to removed link to file " + removeEntityFileMutationState.data.payload.mfile.name, {variant:'error'})
    );

    function unlinkFile(event, entityFileId)
    {
        event.stopPropagation();
        event.preventDefault();
        // optimistically remove the file from the list
        dispatch(api.util.updateQueryData('getEntityFiles',
            entityFilesQueryResults.originalArgs,
            cache=>
            {
                cache.payload = cache.payload.filter(entityFile=>entityFile.id!==entityFileId);
                return cache;
            }));

        removeEntityFile(entityFileId);
    }
    
    function onClickFile(fileId)
    {
        console.log("fileId",fileId);
    } 

    async function downloadFile(fileId, fileName)
    {
        await apiGetFile(fileId,fileName);
    }

    const rows = entityFiles && entityFiles.map((entityFile) => {
        return {rowProperties:{ id:entityFile.id, onClick: ()=>onClickFile(entityFile.id)},
        sx:{cursor:'default'},
        values:[{sx:{p:1},value:[entityFile.mfile.name]}, {sx:{p:1},value:[entityFile.mfile.description]}]
        .concat([{sx:{p:1,width:'0px'},value:[<IconButton onClick={(event)=>downloadFile(entityFile.mfile.id, entityFile.mfile.serverFileName)}><DownloadTwoToneIcon/></IconButton>]}])
        .concat([{sx:{p:1,width:'0px'},value:[<IconButton onClick={(event)=>unlinkFile(event, entityFile.id)}><LinkOffTwoToneIcon/></IconButton>]}])
    }});

    return (
        <Box sx={{display:'flex', flexDirection:'column', ...sx}}>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                <Box sx={{fontWeight:'bold'}}>Linked Files</Box>
                <Box>
                <IconButton onClick={() => refetchEntityFiles()}><RefreshIcon/></IconButton>
                <IconButton onClick={()=>setShowFileSearchDialog(true)}>
                    <AddLinkSharp/>
                </IconButton>
                </Box> 
            </Box>  
        {
            
            <Box sx={{width:'100%', pb:3, 
                overflow:entityFilesQueryResults.isFetching?'hidden':undefined}}>
                <Grid header={""}
                        columnHeadings={headers} 
                        isFetching={entityFilesQueryResults.isFetching} 
                        rowValues={rows}
                        noResultsMessage={"No files linked to this entity."}/>
            </Box>
            
        }
        {showFileSearchDialog && <FileSearchDialog closeFn={()=>setShowFileSearchDialog(false)} entityId={entityId}/>}
        </Box>
    );
}