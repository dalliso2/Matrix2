import { Box, Divider } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectActiveCase } from "../../state/AppSlice";
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
import Collapse from "@mui/material/Collapse";
import { handleQueryResultsWithWaitMessage } from "../../api/ApiUtils";
import LoadingSkeleton from "../../util/LoadingSkeleton";
import { useLazySearchEntitiesNotLinkedQuery } from "../../api/EntityApi";
import { useEffect } from "react";
import { AddLinkSharp } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { getListComponent } from "../../util/DisplayComponentFactory";
import Grid from "../../util/Grid";
import Paper from "@mui/material/Paper";
import LinkDialog from "./LinkDialog";
import { useLinkEntitiesMutation } from "../../api/EntityApi";
import { handleMutationResults } from "../../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { getTitle } from "../../util/utils";
import { api } from "../../api/BaseApi";
import { useNavigate } from "react-router-dom";

export default function EntityLinkDialog({entityObj, entityDefinitions, closeFn})
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedEntityDefIdArray, setSelectedEntityDefIdArray] = useState([]);
    const [searchEntityText, setSearchEntityText] = useState('');
    const [entityToLink, setEntityToLink] = useState(undefined);
    const activeCase = useSelector(selectActiveCase);

    const entityObjName = getTitle(entityDefinitions, entityObj);
    const entityToLinkName = entityToLink && getTitle(entityDefinitions, entityToLink);

    const [searchEntitiesFn, searchResultsStatus ] = useLazySearchEntitiesNotLinkedQuery();
    const searchResults = searchResultsStatus?.data?.payload;
    useEffect(() => {
        handleQueryResultsWithWaitMessage(searchResultsStatus, dispatch,);
    }, [searchResultsStatus.isFetching]);

    const [linkEntities, linkEntitiesMutationResults] = useLinkEntitiesMutation();
    handleMutationResults(linkEntitiesMutationResults, dispatch, 
        ()=> enqueueSnackbar("Successfully linked " 
                                + entityObjName 
                                + " and " 
                                + linkEntitiesMutationResults.originalArgs.entityToLinkName, {variant:'success'}),
        ()=>{});

    function createEntityLink(parentChildRelationshipDescription,childParentRelationshipDescription)
    {
        linkEntities({parentId:entityObj.id, 
                        childId:entityToLink.id, 
                        parentChildRelationshipDescription, 
                        childParentRelationshipDescription, 
                        entityToLinkName});

        //optimistcally remove the linked entity from the search results
        dispatch(api.util.updateQueryData('searchEntitiesNotLinked',
                    {parentId:entityObj.id, caseId:activeCase.id, entityDefinitionIds:selectedEntityDefIdArray, searchText:searchEntityText},
                    cache=>
                    {
                        const newPayload = [];
                        cache.payload.forEach(entityTypeArray=>
                        {
                            const newEntityTypeArray = entityTypeArray.filter(entity=>entity.id!==entityToLink.id);
                            if (newEntityTypeArray.length > 0)
                                newPayload.push(newEntityTypeArray);
                        });

                        cache.payload = newPayload;
                        return cache;
                    }));

        setEntityToLink(undefined);
    }

    function executeSearch()
    {
        searchEntitiesFn({parentId:entityObj.id, caseId:activeCase.id, entityDefinitionIds:selectedEntityDefIdArray, searchText:searchEntityText});
    }

    // search results is an array of arrays of entities of the same entityDefinition
    const entityTypeList = [];
    if (searchResults)
        searchResults.forEach((entityTypeArray,index) =>
        {
            entityTypeList.push(
                {   
                    entityDefinition: entityDefinitions.find(def=>def.id === entityTypeArray[0].entityDefinition),
                    rows: entityTypeArray.filter(entity=>entity.id !== entityObj.id).map((entity,index)=>{
                            const entityDefinition = entityDefinitions.find(def=>def.id === entity.entityDefinition);
                            const row = {rowProperties:{id:entity.id}, values:[{cellProperties:{  }, sx:{ width:0}, 
                                        value:[<Tooltip title="Link Entities"><IconButton onClick={()=>setEntityToLink(entity)}><AddLinkSharp/></IconButton></Tooltip>]},
                                        ...entityDefinition.props.filter(prop=>prop.includeInList).map(prop => {return{propertyDefinition: prop.id, type:prop.type, value:[]}})
                                    ]};
                            for (let prop of entity.propertyValues)
                                row.values.find(value=>value.propertyDefinition === prop.propertyDefinition)?.value.push(prop.value);
                                
                            row.values.forEach(value=>value.value = getListComponent(value.type, value.value));
                            return row;
                    })
                        
                });
        });   

    return (
        <>
        <Dialog open={true} fullWidth={true} maxWidth={'md'} 
                PaperProps={{sx: {minHeight: '80%', maxHeight: '80%'}
                }}>
            <DialogTitle>Link Entities</DialogTitle>
            <DialogContent sx={{display:'flex', position:'relative'}}>
            <Box sx={{display:'flex',flexDirection:'column', width:'100%', overflow:'hidden', }}>
                <Box sx={{flexGrow:0, pb:2}}>
                    <Box>Search for Entities</Box>
                    <Divider orientation="horizontal" flexItem />
                    <Box sx={{display:'flex',alignItems:'baseline', gap:'20px', width:'100%'}}>
                        <TextField label={'Text'} value={searchEntityText} fullWidth size="small" sx={{mt:1}} 
                                onChange={event=>setSearchEntityText(event.target.value)}/>
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
                        <Button onClick={()=>executeSearch()}>Search</Button>
                    </Box>
                </Box>
                <Box sx={{flexGrow:1, overflow:searchResultsStatus.isFetching?'hidden':'auto'}}>
                    <Collapse in={!searchResultsStatus.isFetching} > 
                    <Box sx={{flexGrow:1}}>
                    { 
                        entityTypeList.map((entityType,index)=>
                            <Box key={index} sx={{padding:1, margin:1}}>
                            <Paper elevation={10} sx={{p:2}}>
                                <Grid header={""} 
                                    columnHeadings={["",...entityType.entityDefinition.props.filter(prop=>prop.includeInList).map(prop => prop.name)]} 
                                    rowValues={entityType.rows}/>
                            </Paper>
                            </Box>

                        )
                    }
                    </Box>
                    </Collapse>
                    <Collapse in={searchResultsStatus.isFetching} sx={{overflow:'hidden'}}>
                        <LoadingSkeleton />
                    </Collapse>
                </Box>
            </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeFn}>Close</Button>
            </DialogActions>
        </Dialog>
        <SetActiveCaseDialog />
        {entityToLink && <LinkDialog entityOne={entityObj} 
                            entityTwo={entityToLink} 
                            entity1Entity2Description={''} 
                            entity2Entity1Description={''} 
                            entityDefinitions={entityDefinitions}
                            linkFn={(p2c,c2p)=>createEntityLink(p2c,c2p)}
                            closeFn={()=>setEntityToLink(undefined)}/>}
        </>
    );
}