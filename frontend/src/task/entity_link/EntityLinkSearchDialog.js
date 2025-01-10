import { Box, Divider } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import SetActiveCaseDialog from "../../case/SetActiveCaseDialog";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { handleQueryResultsWithWaitMessage } from "../../api/ApiUtils";
import LoadingSkeleton from "../../util/LoadingSkeleton";
import { useEffect } from "react";
import { useGetAllEntityDefinitionsQuery } from "../../api/EntityDefinitionApi";
import { getEntityDefinitionColumnHeadings } from "../../util/utils";
import { useTheme } from "@mui/material";
import { getListComponent } from "../../util/DisplayComponentFactory";
import Grid from "../../util/Grid";
import { AddLinkSharp } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { useLazySearchUnlinkedEntitiesForTaskQuery } from "../../api/TaskApi";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../../state/AppSlice";
import TaskEntityLinkDialog from "./TaskEntityLinkDialog";
import { useStoreTaskEntityMutation } from "../../api/TaskApi";
import { handleMutationResults } from "../../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { api } from "../../api/BaseApi";
import { getTitle } from "../../util/utils";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

export default function EntityLinkSearchDialog({ taskId, closeFn})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedEntityDefIdArray, setSelectedEntityDefIdArray] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [editTaskEntity, setEditTaskEntity] = useState(undefined);    

    const activeCase = useSelector(selectActiveCase);

    //
    // load entity definitions
    //
    const { refetch, ...entityDefinitionQueryResults } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefinitionQueryResults?.data?.payload || [];

    //
    // Task Search function
    //
    const [searchUnlinkedEntitiesFn, unlinkedEntitiesSearchResults] = useLazySearchUnlinkedEntitiesForTaskQuery();
    const unlinkedEntities = unlinkedEntitiesSearchResults?.data?.payload || [];

    useEffect(() => {
        handleQueryResultsWithWaitMessage(unlinkedEntitiesSearchResults, dispatch);
        handleQueryResultsWithWaitMessage(entityDefinitionQueryResults, dispatch);
    }, [entityDefinitionQueryResults.isFetching,unlinkedEntitiesSearchResults.isFetching]);

    //
    // Save task-entity api function
    //
    const [storeTaskEntity, storeTaskEntityMutationState] = useStoreTaskEntityMutation();
    handleMutationResults(storeTaskEntityMutationState, dispatch,
        ()=>enqueueSnackbar("Successfully linked task to " + getTitle(entityDefinitions,storeTaskEntityMutationState.data.payload.matrixEntity), 
            {variant:'success'}),
        ()=>{});

    function linkTaskAndEntity(description)
    {   
        //optimistcally remove the linked entity from the unlinked search results
        dispatch(api.util.updateQueryData('searchUnlinkedEntitiesForTask',
                                            unlinkedEntitiesSearchResults.originalArgs,
                                            (cache)=>{
                                                const payload = [];
                                                cache.payload.forEach(entityGroup=>{
                                                    const newGroup = entityGroup.filter(ent=>ent.id!==editTaskEntity.id);
                                                    if (newGroup.length)
                                                        payload.push(newGroup);
                                                });
                                                cache.payload = payload;
                                                return cache;
                                            })); 
                                            
        storeTaskEntity({taskId, entityId:editTaskEntity.id, description});
        setEditTaskEntity(undefined);
    }

    const relatedEntityGroupsRows = [];
    if (unlinkedEntities)
        for (const entityGroup of unlinkedEntities)
        {
            const entityDef = entityDefinitions.find(def=>def.id === entityGroup[0].entityDefinition);
            const currentEntityGroup = {entityDefinition: entityDef,
                                    name: entityDef.name,
                                    headers: ["",...getEntityDefinitionColumnHeadings(entityDef)],
                                    rows:[]};

            relatedEntityGroupsRows.push(currentEntityGroup);
            for (const entity of entityGroup)
            {
                const row = {rowProperties:{}, sx:{},
                        values: [{cellProperties:{  }, sx:{ width:0}, 
                                    value:[<Tooltip title="Link entity to task"><IconButton onClick={()=>setEditTaskEntity(entity)}><AddLinkSharp/></IconButton></Tooltip>]},
                                ...currentEntityGroup.entityDefinition.props.filter(prop=>!prop.deleted && prop.includeInList).map(prop => ({propertyDefinition: prop.id, type: prop.type , value:[
                                    getListComponent(prop.type, [entity.propertyValues.find(pVal=>pVal.propertyDefinition === prop.id)?.value])
                                ]}))]
                            };
                currentEntityGroup.rows.push(row);  
            }
        }

    function removeEntityById(id)
    {
        setEntities(old => {
            const newEntities = [];
            old.forEach(entityDef => {
                const newDef = entityDef.filter(entity=>entity.id !== id);
                if (newDef.length)
                    newEntities.push(newDef);
            });
            return newEntities;
        });
    }

    function closeEntityLinkSearchDialog()
    {
        setEntityToLink(undefined);
        // clear the search cache
        dispatch(api.util.updateQueryData('searchUnlinkedEntitiesForTask',
                                            unlinkedEntitiesSearchResults.originalArgs,
                                            (cache)=>{cache.length=0;}));
    }

    return (
        <>
        <Dialog open={true} fullWidth={true} maxWidth={'md'} 
                PaperProps={{sx: {minHeight: '80%', maxHeight: '80%'}
                }}>
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Link Entities</DialogTitle>
            <DialogContent sx={{display:'flex', position:'relative'}}>
            <Box sx={{display:'flex',flexDirection:'column', width:'100%', overflow:'hidden', }}>
                <Box sx={{flexGrow:0,pt:1,pb:1}}>
                    <Box>Search for Entities</Box>
                    <Divider orientation="horizontal" flexItem />
                    <Box sx={{display:'flex',alignItems:'baseline', gap:'20px', width:'100%'}}>
                        <TextField label={'Text'} value={searchText} fullWidth size="small" sx={{mt:1}} 
                                onChange={event=>setSearchText(event.target.value)}/>
                        <FormControl fullWidth={true} size="small" sx={{mt:1, flexGrow:1}}>
                            <InputLabel id={'entity_type_select'} >Entity Type</InputLabel>
                            <Select multiple fullWidth={true} label={'EntityType'} labelId={'entity_type_select'} value={selectedEntityDefIdArray}
                                onChange={event=>setSelectedEntityDefIdArray(event.target.value)}
                                renderValue={(selectedEntityDefIdArray) => {
                                    return (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {
                                        selectedEntityDefIdArray.map((value) =><Chip key={value} sx={{height:'auto'}} 
                                                    label={entityDefinitions.find(def=>def.id === value).name} />)
                                    }
                                    </Box>
                            )}}>
                            {
                                entityDefinitions?.map((item,index) =>
                                (
                                    <MenuItem key={index} value={item.id}>
                                            <span>{item.name}</span>
                                    </MenuItem>
                                ))
                            }
                            </Select>
                        </FormControl>
                        <Button onClick={()=>searchUnlinkedEntitiesFn({taskId, caseId:activeCase.id, entityDefinitionIds:selectedEntityDefIdArray, searchText})}>Search</Button>
                    </Box> 
                </Box>
                <Box sx={{display:'flex', flexDirection:'column', flexGrow:1, overflow:unlinkedEntitiesSearchResults.isFetching?'hidden':'auto'}}>
                    {
                        unlinkedEntitiesSearchResults.isFetching?<LoadingSkeleton />
                        :relatedEntityGroupsRows?.length? 
                            relatedEntityGroupsRows.map(group=>
                            {
                                return (
                                    <Box key={group.name} sx={{mt:2}}>
                                    <Grid header={group.name} columnHeadings={group.headers} rowValues={group.rows}/>
                                    </Box>
                                );
                            })
                            :unlinkedEntitiesSearchResults.isSuccess &&   <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center', flexGrow:1}}>
                                                <h2 style={{p:0, textAlign:'center', opacity:0.5}}>No entities found.</h2>
                                            </Box> 
                    } 
                </Box>
            </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>closeFn()}>Close</Button>
            </DialogActions>
        </Dialog>
        <SetActiveCaseDialog />
        { editTaskEntity && <TaskEntityLinkDialog entity={editTaskEntity}
                                description={""}
                                saveFn={(description)=>linkTaskAndEntity(description)} 
                                closeFn={()=>setEditTaskEntity(undefined)}/> }
        </>
    );
}