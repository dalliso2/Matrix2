import React from "react";
import Box from "@mui/material/Box";
import { useGetEntitiesForTaskQuery } from "../api/TaskApi";
import { useEffect } from "react";
import { handleQueryError } from "../api/ApiUtils";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";
import { addEntityTab } from "../state/AppSlice";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import LinkOffTwoToneIcon from '@mui/icons-material/LinkOffTwoTone';
import { getEntityDefinitionColumnHeadings } from "../util/utils";
import { useTheme } from "@mui/material";
import { getListComponent } from "../util/DisplayComponentFactory";
import Grid from "../util/Grid";
import { useState } from "react";
import { useStoreTaskEntityMutation } from "../api/TaskApi";
import { enqueueSnackbar } from "notistack";
import EntityLinkSearchDialog from "./entity_link/EntityLinkSearchDialog";
import TaskEntityLinkDialog from "./entity_link/TaskEntityLinkDialog";
import { api } from "../api/BaseApi";
import { handleMutationResults } from "../api/ApiUtils";
import RefreshIcon from '@mui/icons-material/Refresh';
import AddLinkSharp from '@mui/icons-material/AddLinkSharp';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { useDeleteTaskEntityMutation } from "../api/TaskApi";
import { getTitle } from "../util/utils";
import Button from "@mui/material/Button";
import { closeSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function TaskEntities({taskId})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const activeCase = useSelector(selectActiveCase);

    const [entityLinkSearchDialogOpen, setEntityLinkSearchDialogOpen] = useState(false);
    const [entityToLink, setEntityToLink] = useState(undefined); 
    const [editTaskEntity, setEditTaskEntity] = useState(undefined);    

    // load entity definitions
    const { data:envelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = envelope?envelope.payload:[];
    
    // load task entities
    const { currentData:taskEntitiesEnvelope, refetch:refetchTaskEntities, ...getTaskEntitesQueryStatus } = useGetEntitiesForTaskQuery(taskId);
    const taskEntities = taskEntitiesEnvelope?.payload;

    useEffect(() => {  
        if (getTaskEntitesQueryStatus.isError)
            handleQueryError(getTaskEntitesQueryStatus, dispatch, navigate);
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch, navigate);
    }, [getTaskEntitesQueryStatus.isError, entityDefinitionQueryStatus.isError]);
    
    //
    // Save task-entity api function
    //
    const [storeTaskEntity, storeTaskEntityMutationState] = useStoreTaskEntityMutation();
    handleMutationResults(storeTaskEntityMutationState, dispatch, navigate, false, "","Error linking task and entity",
        ()=>enqueueSnackbar(storeTaskEntityMutationState.originalArgs.successDescription, {variant:'success'}),
        ()=>{});
        
    //
    // code to re-link task/entity that has just been deleted
    //
    const undoRemove = (snackbarId)=>(
        <Button onClick={()=>{
                                storeTaskEntity({   taskId:deleteTaskEntityMutationState.data.payload.task.id,
                                                    entityId:deleteTaskEntityMutationState.data.payload.matrixEntity.id, 
                                                    description:deleteTaskEntityMutationState.data.payload.description,
                                                    successDescription:"Successfully re-linked task to entity "
                                                        + getTitle(entityDefinitions,deleteTaskEntityMutationState.data.payload.matrixEntity)});
                                closeSnackbar(snackbarId);            
                            }}>Undo</Button>
    );

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
                            ()=>{
                                enqueueSnackbar( "Removed link to: " + getTitle(entityDefinitions,deleteTaskEntityMutationState.data.payload.matrixEntity), 
                                {   variant:'success', 
                                    action:(snackbarId)=>(
                                        <Button onClick={()=>{
                                                                storeTaskEntity({   taskId:deleteTaskEntityMutationState.data.payload.task.id,
                                                                                    entityId:deleteTaskEntityMutationState.data.payload.matrixEntity.id, 
                                                                                    description:deleteTaskEntityMutationState.data.payload.description,
                                                                                    successDescription:"Successfully re-linked task to entity "
                                                                                        + getTitle(entityDefinitions,deleteTaskEntityMutationState.data.payload.matrixEntity)});
                                                                closeSnackbar(snackbarId);            
                                                            }}>Undo</Button>
                                    )
                                });
                            },
                            ()=>{});

    function updateTaskEntity(description)
    {   
        storeTaskEntity({taskId, entityId:editTaskEntity.matrixEntity.id, description,
                            successDescription:"Successfully updated task relationship to " + getTitle(entityDefinitions,editTaskEntity.matrixEntity)});
        setEditTaskEntity(undefined);
    }

    function unlinkTaskAndEntity(taskEntityId)
    {   
        //optimistcally remove the linked entity from the task entities
        dispatch(api.util.updateQueryData('getEntitiesForTask',
                                            getTaskEntitesQueryStatus.originalArgs,
                                            cache=>
                                            {
                                                cache.payload = cache.payload.map(entityGroup=>entityGroup.filter(ent=>ent.id!==taskEntityId));
                                                cache.payload = cache.payload.filter(group=>group.length);
                                                return cache;
                                            }));
     
        deleteTaskEntity(taskEntityId);
    }

    function closeEntityLinkSearchDialog()
    {
        setEntityToLink(undefined);
        // clear the search cache
        dispatch(api.util.updateQueryData('searchUnlinkedEntitiesForTask',
                                            unlinkedEntitiesSearchResults.originalArgs,
                                            (cache)=>{cache.length=0;}));
        setEntityLinkSearchDialogOpen(false);
    }

    const relatedEntityGroupsRows = [];
    if (taskEntities && entityDefinitions?.length)
        for (const taskEntityGroup of taskEntities)
        {
            const entityDef = entityDefinitions.find(def=>def.id === taskEntityGroup[0].matrixEntity.entityDefinition);
            if (!entityDef) 
                continue;
            const currentEntityGroup = {entityDefinition: entityDef,
                                    name: entityDef.name,
                                    headers: getEntityDefinitionColumnHeadings(entityDef).concat(['Relationship','Edit/Unlink']),
                                    rows:[]};

            relatedEntityGroupsRows.push(currentEntityGroup);
            for (const taskEntity of taskEntityGroup)
            {
                const row = {rowProperties:{id:taskEntity.id, onClick: ()=>{dispatch(addEntityTab({entityId:taskEntity.matrixEntity.id,title:getTitle(entityDefinitions, taskEntity.matrixEntity)}));navigate('/entities');}}, 
                        sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                        values: [
                                ...currentEntityGroup.entityDefinition.props.filter(prop=>!prop.deleted && prop.includeInList).map(prop => ({propertyDefinition: prop.id, type: prop.type , value:[
                                    getListComponent(prop.type, [taskEntity.matrixEntity.propertyValues.find(pVal=>pVal.propertyDefinition === prop.id)?.value])
                                ]}))]
                                .concat({value:[taskEntity.description]},{sx:{width:'0px'},value:[
                                    <Box sx={{display:'flex'}}>
                                        <IconButton onClick={(event)=>setEditTaskEntity(taskEntity)}><EditTwoToneIcon/></IconButton>
                                        <IconButton onClick={(event)=>unlinkTaskAndEntity(taskEntity.id)}><LinkOffTwoToneIcon/></IconButton>
                                    </Box>
                                ]})
                            };
                currentEntityGroup.rows.push(row);  
            }
        }

    return (
        <>
        <Box sx={{ display:'flex', flexDirection:'column',justifyContent:'space-around',m:2}}>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center',pb:0,mb:0}}>
                <Box sx={{fontWeight:'bold'}}><b>Referenced Entities</b></Box>
                <Box>
                    <IconButton onClick={() => refetchTaskEntities()}><RefreshIcon/></IconButton>
                    <IconButton onClick={()=>{setEntityLinkSearchDialogOpen(true)}}><AddLinkSharp/></IconButton>
                </Box> 
            </Box>  
            <Box>
                <Box sx={{}}>
                {
                    relatedEntityGroupsRows.length===0?
                    <Box key={1} sx={{width:'100%', pb:3, 
                                            overflow:getTaskEntitesQueryStatus.isFetching?'hidden':undefined}}>
                        <Grid header={""} 
                                columnHeadings={[]} 
                                rowValues={[]} 
                                isFetching={getTaskEntitesQueryStatus.isFetching}
                                noResultsMessage={"No linked entities."}/>
                    </Box>
                    :
                    relatedEntityGroupsRows.map((group,index)=>
                    {
                        return (
                            <Box key={index} sx={{width:'100%', pb:3, 
                                overflow:getTaskEntitesQueryStatus.isFetching?'hidden':undefined}}>
                                <Grid header={group.name} columnHeadings={group.headers} rowValues={group.rows} isFetching={getTaskEntitesQueryStatus.isFetching}/>
                            </Box>
                        );
                    })
                }
                </Box>
            </Box>
        </Box>
        { entityLinkSearchDialogOpen && <EntityLinkSearchDialog taskId={taskId}
                closeFn={()=>setEntityLinkSearchDialogOpen(false)} /> }
        { editTaskEntity && <TaskEntityLinkDialog entity={editTaskEntity.matrixEntity}
                                                description={editTaskEntity.description}
                                                saveFn={(description)=>updateTaskEntity(description)} 
                                                closeFn={()=>setEditTaskEntity(undefined)}/> }
        </>
    );
}