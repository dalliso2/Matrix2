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
import { selectAuthToken } from "../state/AppSlice";
import { useSelector } from "react-redux";
import { userCanModifyCase } from "../util/utils";
import { selectActiveCase, selectCurrentUser } from "../state/AppSlice";
import { Tooltip } from "@mui/material";

const headers = ["File name", "Description", "Download", "Unlink"];

export default function EntityFiles({entityId, unlink=true, sx={}})
{
    const dispatch = useDispatch();
    const authToken = useSelector(selectAuthToken); 
    const [showFileSearchDialog, setShowFileSearchDialog] = React.useState(false);

    const currentUserCanModifyCase = userCanModifyCase(useSelector(selectCurrentUser), useSelector(selectActiveCase).id);

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
        await apiGetFile(authToken, fileId,fileName);
    }

    const rows = entityFiles && entityFiles.map((entityFile) => {
        return {rowProperties:{ id:entityFile.id, onClick: ()=>onClickFile(entityFile.id)},
        sx:{cursor:'default'},
        values:[{sx:{p:1},value:[entityFile.mfile.name]}, {sx:{p:1},value:[entityFile.mfile.description]}]
        .concat([{sx:{p:1,width:'0px'},value:[<Tooltip title="Dowload file"><IconButton onClick={(event)=>downloadFile(entityFile.mfile.id, entityFile.mfile.serverFileName)}><DownloadTwoToneIcon/></IconButton></Tooltip>]}])
        .concat([{sx:{p:1,width:'0px'},value:[<Tooltip title="Unlink"><IconButton onClick={(event)=>unlinkFile(event, entityFile.id)}><LinkOffTwoToneIcon/></IconButton></Tooltip>]}])
    }});

    return (
        <Box sx={{display:'flex', flexDirection:'column', ...sx}}>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                <Box sx={{fontWeight:'bold'}}>Linked Files</Box>
                <Box>
                <Tooltip title="Link a file to this entity">
                    <IconButton onClick={()=>setShowFileSearchDialog(true)} sx={{visibility:currentUserCanModifyCase?'visible':'hidden'}}>
                        <AddLinkSharp/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Refresh linked files">
                    <IconButton onClick={() => refetchEntityFiles()}><RefreshIcon/></IconButton>
                </Tooltip>
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