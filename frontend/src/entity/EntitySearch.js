import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Button, Paper } from "@mui/material";
import {
    selectEntitySearchText, setEntitySearchText,
    setEntitySearchEntityDefIdArray,
    selectEntitySearchEntityDefIdArray,
    selectActiveCase
} from "../state/AppSlice";
import { useLazySearchEntitiesQuery } from "../api/EntityApi";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { useEffect } from "react";
import { handleQueryError } from "../api/ApiUtils";
import { setEntitySearchResults } from "../state/AppSlice";
import { selectEntitySearchResults } from "../state/AppSlice";
import { addEntityTab } from "../state/AppSlice";
import { getEntityDefinitionColumnHeadings, getTitle } from "../util/utils";
import { getListComponent } from "../util/DisplayComponentFactory";
import { useTheme } from "@mui/material";
import Grid from "../util/Grid";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";

export default function EntitySearch()
{
    const dispatch = useDispatch();
    const theme = useTheme();   
    const searchText = useSelector(selectEntitySearchText);   
    const entityDefinitionIds = useSelector(selectEntitySearchEntityDefIdArray);
    const activeCase = useSelector(selectActiveCase);

    const { data:entityDefsEnvelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    useEffect(() => {
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch);
    }, [entityDefinitionQueryStatus.isError]);
    const entityDefinitions = entityDefsEnvelope?entityDefsEnvelope.payload:[];

    //
    // code to search for entities
    //
    const [searchEntitiesFn, {data:envelope, ...searchEntitiesQueryStatus}] = useLazySearchEntitiesQuery();
    useEffect(() => {
        if (searchEntitiesQueryStatus.isError) 
            handleQueryError(searchEntitiesQueryStatus, dispatch);
    }, [searchEntitiesQueryStatus.isError]);

    useEffect(() => {
        if (!searchEntitiesQueryStatus.isFetching && searchEntitiesQueryStatus?.isSuccess) 
        {
            dispatch(setEntitySearchResults(envelope.payload));
        }
    }, [searchEntitiesQueryStatus?.isFetching]);

    useEffect(() => {
        if (searchEntitiesQueryStatus?.isError) 
            handleQueryError(searchEntitiesQueryStatus, dispatch);
    }, [searchEntitiesQueryStatus?.isError]);

    const searchResults = useSelector(selectEntitySearchResults);

    const relatedEntityGroups = [];
    for (const entityGroup of searchResults)
    {
        const currentEntityDefinition = entityDefinitions.find(def=>def.id === entityGroup[0].entityDefinition);
        const currentEntityGroup = {entityDefinition: currentEntityDefinition,
                                name: currentEntityDefinition.name,
                                headers: getEntityDefinitionColumnHeadings(currentEntityDefinition).concat(['Relationship','Edit/Unlink']),
                                rows:[]};
        relatedEntityGroups.push(currentEntityGroup); 

        for (const relatedEntity of entityGroup)
        {
            const row = {rowProperties:{id:relatedEntity.id, onClick: ()=>dispatch(addEntityTab({entityId:relatedEntity.id, title:getTitle(entityDefinitions, relatedEntity )}))}, 
            sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
            values: [
                    ...currentEntityGroup.entityDefinition.props.filter(prop=>!prop.deleted && prop.includeInList).map(prop => ({propertyDefinition: prop.id, type: prop.type , value:[
                        getListComponent(prop.type, [relatedEntity.propertyValues.find(pVal=>pVal.propertyDefinition === prop.id)?.value])
                    ]}))]
                };
            currentEntityGroup.rows.push(row);  
        }
    }

    return (
        <>
            <Box sx={{display:'flex',flexDirection:'column', width:'100%'}}>
                <Box sx={{display:'flex',alignItems:'baseline', gap:'20px', width:'100%'}}>
                    <TextField label={'Text'} value={searchText} fullWidth size="small" sx={{mt:1}} 
                            onChange={event=>dispatch(setEntitySearchText(event.target.value))}/>
                    <FormControl fullWidth={true} size="small" sx={{mt:1, flexGrow:1}}>
                        <InputLabel id={'entity_type_select'} >Entity Type</InputLabel>
                        <Select multiple fullWidth={true} label={'EntityType'} labelId={'entity_type_select'} value={entityDefinitionIds}
                            onChange={event=>dispatch(setEntitySearchEntityDefIdArray(event.target.value))}
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
                    <Button onClick={()=>searchEntitiesFn({caseId:activeCase.id, entityDefinitionIds, searchText})}>Search</Button>
                </Box>
                <Box sx={{flexGrow:1, overflow:'auto'}}>
                { 
                    searchEntitiesQueryStatus?.isFetching?<LoadingSkeleton/>
                    :relatedEntityGroups.map((entityGroup,index)=>
                        <Box key={index} sx={{p:1, margin:1, pb:3}}>
                            <h5 style={{paddingBottom:1,margin:0}}>{entityGroup.name}</h5>
                            <Paper elevation={5}>
                            <Grid    
                                    columnHeadings={getEntityDefinitionColumnHeadings(entityGroup.entityDefinition)} 
                                    rowValues={entityGroup.rows}/>
                            </Paper>
                        </Box>)
                }
                </Box>
            </Box>
        </>
    );
}