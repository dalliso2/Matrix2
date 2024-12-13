import React from "react";
// import { apiGetChildren, apiUnlinkEntities } from "../api/entity";
import { useDispatch } from "react-redux";
// import { addEntityTab, selectReRender, setReRender } from "../state/EntityTabsSlice";
import { useTheme } from "@mui/material";
import Grid from '../util/Grid';
//import { getListComponent } from "../util/DisplayComponentFactory";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGetTasksForEntityQuery } from "../api/TaskApi";
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import LinkOffTwoToneIcon from '@mui/icons-material/LinkOffTwoTone';
import EntityTaskSearchDialog from "./EntityTaskSearchDialog";
import { useDeleteTaskEntityMutation, useStoreTaskEntityMutation } from "../api/TaskApi";
import { handleMutationResults } from "../api/ApiUtils";
import { api } from "../api/BaseApi";
import { enqueueSnackbar } from "notistack";
import Button from "@mui/material/Button";
import { closeSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const headers = ["Task #", "Title", "Description", "Coverage Description", "Status", "Unlink"];

export default function EntityTasks({entityId})
{
    const theme = useTheme();   
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showTaskSearchDialog, setShowTaskSearchDilog] = React.useState(false);

    //
    // code to retrieve related tasks
    //
    const {refetch:refetchRelatedTasks, ...relatedTasksQueryResults} = useGetTasksForEntityQuery(entityId);
    const taskEntities = relatedTasksQueryResults?.currentData?.payload || [];
    useEffect(() => {
        handleQueryResultsWithWaitMessage(relatedTasksQueryResults, dispatch);
    }, [relatedTasksQueryResults.isFetching]);

    //
    // Save task-entity api function
    //
    const [storeTaskEntity, storeTaskEntityMutationState] = useStoreTaskEntityMutation();
    handleMutationResults(storeTaskEntityMutationState, dispatch,
        ()=>{
            console.log("storeTaskEntityMutationState", storeTaskEntityMutationState);
            enqueueSnackbar(storeTaskEntityMutationState.originalArgs.successDescription, {variant:'success'})
        },
        ()=>{});

    //
    // Remove task-entity api function
    //
    const [deleteTaskEntity, deleteTaskEntityMutationState] = useDeleteTaskEntityMutation();
    handleMutationResults(deleteTaskEntityMutationState, 
                            dispatch, 
                            navigate, 
                            true, 
                            "",
                            "Error removing link",
                            ()=>enqueueSnackbar( "Removed link to task: " + deleteTaskEntityMutationState.data.payload.task.title, 
                                {   variant:'success', 
                                    action:(snackbarId)=>(
                                        <Button onClick={()=>{
                                                                storeTaskEntity({   taskId:deleteTaskEntityMutationState.data.payload.task.id,
                                                                                    entityId:deleteTaskEntityMutationState.data.payload.matrixEntity.id, 
                                                                                    description:deleteTaskEntityMutationState.data.payload.description,
                                                                                    successDescription:"Successfully re-linked task to entity "});
                                                                closeSnackbar(snackbarId);            
                                                            }}>Undo</Button>
                                    )
                                }));

    function unlinkTaskAndEntity(taskEntityId)
    {   
        //optimistcally remove the linked entity from the task entities
        dispatch(api.util.updateQueryData('getTasksForEntity',
                            relatedTasksQueryResults.originalArgs,
                            cache=>
                            {
                                cache.payload = cache.payload.filter(taskEntity=>taskEntity.id !== taskEntityId);
                                return cache;
                            }));
     
        deleteTaskEntity(taskEntityId);
    }

    const rows = taskEntities?.map(taskEntity=>
            ({  rowProperties:{}, 
                sx:{},
                values:[    {value:taskEntity.task.caseTaskId}, 
                        {value:taskEntity.task.title}, 
                        {value:taskEntity.task.description}, 
                        {value:taskEntity.task.coverageDescription}, 
                        {value:taskEntity.task.status},
                        {value:
                            (<Box sx={{display:'flex'}}>
                                <IconButton onClick={(event)=>unlinkTaskAndEntity(taskEntity.id)}><LinkOffTwoToneIcon/></IconButton>
                            </Box>)
                        }
                    ]}));

    return (
        <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                <Box sx={{}}><b>Linked Tasks</b></Box>
                <Box>
                <IconButton onClick={() =>refetchRelatedTasks()}><RefreshIcon/></IconButton>
                </Box> 
            </Box>  
            <Box>
                <Box key={2} sx={{width:'100%', pb:3, 
                                        overflow:relatedTasksQueryResults.isFetching?'hidden':undefined}}>
                    <Grid header={""} 
                            columnHeadings={headers} 
                            rowValues={rows} 
                            isFetching={relatedTasksQueryResults.isFetching}
                            noResultsMessage={"No tasks linked to this entity."}/>
                </Box>
            </Box>
            { showTaskSearchDialog && <EntityTaskSearchDialog closeFn={()=>setShowTaskSearchDilog(false)}/> }
        </Box>
    );
}