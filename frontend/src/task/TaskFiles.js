import React from "react";
import Grid from '../util/Grid';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import AddLinkSharp from "@mui/icons-material/AddLinkSharp";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGetFilesForTaskQuery } from "../api/TaskApi";
import { handleQueryError } from "../api/ApiUtils";
import { useEffect } from "react";
import { handleMutationResults } from "../api/ApiUtils";
import TaskFileSearchDialog from "./TaskFileSearchDialog";
import { enqueueSnackbar } from "notistack";
import { useAddTaskFilesMutation } from "../api/TaskApi";
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import LinkOffTwoToneIcon from '@mui/icons-material/LinkOffTwoTone';
import { useRemoveTaskFileMutation } from "../api/TaskApi";
import { api } from "../api/BaseApi";
import DragDropTarget2 from "../util/dragdrop/DragDropTarget2";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { useStoreFilesMutation } from "../api/FileApi";
import { useNavigate } from "react-router-dom";

const headers = ["File name", "Description", "Download", "Unlink"];

export default function TaskFiles({taskId, unlink=true, sx={}})
{
    console.log("TaskFiles");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //const [entityFiles,setEntityFiles] = useState([]);
    const [showFileSearchDialog, setShowFileSearchDialog] = React.useState(false);
    const activeCase = useSelector(selectActiveCase);   

    const {refetch:refetchTaskFiles, ...taskFilesQueryResults} = useGetFilesForTaskQuery(taskId);
    const taskFiles = taskFilesQueryResults?.currentData?.payload;
    useEffect(() => {
        if (taskFilesQueryResults.isError) 
            handleQueryError(taskFilesQueryResults, dispatch, navigate);
    }, [taskFilesQueryResults.isError]);

    const [addTaskFiles, addTaskFileMutationState] = useAddTaskFilesMutation();
    
    handleMutationResults(addTaskFileMutationState, dispatch, navigate, false, "Saving link to file...",
        "Error saving task file link.", 
        ()=>addTaskFileMutationState.data.payload.forEach(taskFile=>enqueueSnackbar("Added link to file: " + taskFile.matrixFile.name, {variant:'success'})),
        ()=>{}); 

    const [removeTaskFile, removeTaskFileMutationState] = useRemoveTaskFileMutation();
    handleMutationResults(removeTaskFileMutationState, dispatch, navigate, false, "Removing file link...",
        "Error removing file link", 
        ()=>enqueueSnackbar("Removed link to file: " + removeTaskFileMutationState.data.payload.matrixFile.name, {variant:'success'}),
        ()=>{}); 

    async function unlinkFile(event, entityFileId)
    {
        event.stopPropagation();
        event.preventDefault();
        // optimistically remove the file from the list

        dispatch(api.util.updateQueryData('getFilesForTask',
            taskFilesQueryResults.originalArgs,
            cache=>
            {
                cache.payload = cache.payload.filter(taskFile=>taskFile.id!==entityFileId);
                return cache;
            }
        ));

        removeTaskFile(entityFileId);
    }
    
    const [storeFiles,storeFilesMutationState] = useStoreFilesMutation();
    handleMutationResults(storeFilesMutationState, dispatch, navigate, false, "Saving files...",
        "Error saving files.", 
        ()=>{}); 

    function addFiles(fileDataArray)
    {
        storeFiles(fileDataArray);
        addTaskFiles(fileDataArray.map((fileData)=>({taskId, fileId:fileData.id})));
    }

    // function onClickFile(fileId)
    // {
    //     console.log("fileId",fileId);
    // } 

    // async function downloadFile(fileId, fileName)
    // {
    //     await apiGetFile(fileId,fileName);
    // }

    const rows = taskFiles && taskFiles.map((taskFile) => {
        return {rowProperties:{ id:taskFile.id, onClick: ()=>onClickFile(taskFile.id)},
        sx:{cursor:'default'},
        values:[{sx:{p:1},value:[taskFile.matrixFile.name]}, {sx:{p:1},value:[taskFile.matrixFile.description]}]
        .concat([{sx:{p:1,width:'0px'},value:[<IconButton onClick={(event)=>downloadFile(taskFile.matrixFile.id, taskFile.matrixFile.serverFileName)}><DownloadTwoToneIcon/></IconButton>]}])
        .concat([{sx:{p:1,width:'0px'},value:[<IconButton onClick={(event)=>unlinkFile(event, taskFile.id)}><LinkOffTwoToneIcon/></IconButton>]}])
    }});

    return (
        <DragDropTarget2 fileUploadCallback={addFiles} caseId={activeCase?.id}  sx={{ borderRadius:'4px'}}>
            <Box sx={{display:'flex', flexDirection:'column', m:2}}>
                <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                    <Box sx={{fontWeight:'bold'}}>Linked Files</Box>
                    <Box>
                    <IconButton onClick={() => refetchTaskFiles()}><RefreshIcon/></IconButton>
                    <IconButton onClick={()=> {setShowFileSearchDialog(true)}}>
                        <AddLinkSharp/>
                    </IconButton>
                    </Box> 
                </Box>  
            {
                
                <Box sx={{width:'100%', pb:3, 
                    overflow:taskFilesQueryResults.isFetching?'hidden':undefined}}>
                    <Grid header={""}
                            columnHeadings={headers} 
                            isFetching={taskFilesQueryResults.isFetching} 
                            rowValues={rows}
                            noResultsMessage={"No files linked to this task."}/>
                </Box>
                
            }
            {showFileSearchDialog && <TaskFileSearchDialog taskId={taskId} closeFn={()=>setShowFileSearchDialog(false)}/>}
            </Box>
        </DragDropTarget2>
    );
}