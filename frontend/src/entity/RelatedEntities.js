import React from "react";
import { useDispatch } from "react-redux";
import { Tooltip, useTheme } from "@mui/material";
import Grid from '../util/Grid';
import Box from "@mui/material/Box";
import { useGetRelatedEntitiesQuery } from "../api/EntityApi";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { IconButton } from "@mui/material";
import LinkOffTwoToneIcon from '@mui/icons-material/LinkOffTwoTone';
import { getEntityDefinitionColumnHeadings } from "../util/utils";
import { getListComponent } from "../util/DisplayComponentFactory";
import { addEntityTab } from "../state/AppSlice";
import { useUnlinkEntitiesMutation } from "../api/EntityApi";
import { handleMutationResults } from "../api/ApiUtils";
import EntityLinkDialog from "./link/EntityLinkDialog";
import AddLinkSharp from '@mui/icons-material/AddLinkSharp';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import LinkDialog from "./link/LinkDialog";
import { useGetEntityQuery } from "../api/EntityApi";
import { useEffect } from "react";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { getTitle } from "../util/utils";
import { Button } from "@mui/material";
import { useLinkEntitiesMutation } from "../api/EntityApi";
import RefreshIcon from '@mui/icons-material/Refresh';
import { api } from "../api/BaseApi";
import { useSelector } from "react-redux";
import { selectActiveCase, selectCurrentUser } from "../state/AppSlice";
import { userCanModifyCase } from "../util/utils";

export default function RelatedEntities({unlink=true, entityDefinitions, entityId})
{
    const theme = useTheme();   
    const dispatch = useDispatch();

    const currentUserCanModifyCase = userCanModifyCase(useSelector(selectCurrentUser), useSelector(selectActiveCase).id);

    // the related entity that is being linked to the current entity
    const [linkDialogRelatedEntity, setLinkDialogRelatedEntity] = React.useState(undefined);
    // setting this to true will cause the dialog that allows searching for entities to link 
    // to the current entity to open
    const [linkEntityDialogOpen, setLinkEntityDialogOpen] = React.useState(false);

    //
    // retrieve the entity from store/server
    //
    const { refetch:refetchEntity, ...getEntityResults} = useGetEntityQuery(entityId);
    const entity = getEntityResults?.data?.payload;   

    //
    // code to retrieve related entities
    //
    const {refetch:refetchRelatedEntities, ...relatedEntitiesQueryResults} = useGetRelatedEntitiesQuery(entityId);
    const relatedEntities = relatedEntitiesQueryResults?.currentData?.payload || [];

    useEffect(() => {
        handleQueryResultsWithWaitMessage(relatedEntitiesQueryResults, dispatch);
        handleQueryResultsWithWaitMessage(getEntityResults, dispatch);
    }, [getEntityResults.isFetching,relatedEntitiesQueryResults.isFetching]);

    const entityObjName = getTitle(entityDefinitions, entity);
    const entityToLinkName = linkDialogRelatedEntity && getTitle(entityDefinitions, linkDialogRelatedEntity.child);

    //
    // code to link entities
    //
    const [linkEntities, linkEntitiesMutationResults] = useLinkEntitiesMutation();
    handleMutationResults(linkEntitiesMutationResults, dispatch, 
        ()=> enqueueSnackbar("Successfully linked " 
                                + entityObjName 
                                + " and " 
                                + linkEntitiesMutationResults.originalArgs.entityToLinkName, {variant:'success'}),
        ()=>enqueueSnackbar("Unable to link " 
            + entityObjName 
            + " and " 
            + linkEntitiesMutationResults.originalArgs.entityToLinkName, {variant:'error'}));

    function createEntityLink(parentChildRelationshipDescription,childParentRelationshipDescription)
    {
        linkEntities({parentId:entity.id, 
                        childId:linkDialogRelatedEntity.child.id, 
                        parentChildRelationshipDescription, 
                        childParentRelationshipDescription, 
                        entityToLinkName});

        setLinkDialogRelatedEntity(undefined);
    }

    //
    // code to re-link entities that have just been unlinked
    //
    const undoRemove = (snackbarId)=>(
        <Button onClick={()=>{
                                linkEntities({parentId:entity?.id, 
                                            childId:deleteEntityLinkMutationResults.originalArgs.child.id, 
                                            parentChildRelationshipDescription:deleteEntityLinkMutationResults.originalArgs.parentToChildDescription, 
                                            childParentRelationshipDescription:deleteEntityLinkMutationResults.originalArgs.childToParentDescription,
                                            entityToLinkName});
                                closeSnackbar(snackbarId);            
                            }}>Undo</Button>
    );

    // 
    // code to unlink entities
    //
    const [deleteEntityLink, deleteEntityLinkMutationResults] = useUnlinkEntitiesMutation();
    handleMutationResults(deleteEntityLinkMutationResults, dispatch, 
                            ()=>{
                                enqueueSnackbar( "Removed link to " + getTitle(entityDefinitions,deleteEntityLinkMutationResults.data.payload.child), 
                                {variant:'success', action:undoRemove});
                            },
                            ()=>{
                                enqueueSnackbar( "Unable to remove link to " + getTitle(entityDefinitions,deleteEntityLinkMutationResults.data.payload.child), 
                                {variant:'error'});
                            },
                        );
                        
    function unlinkEntity(event, relationship)
    {
        event.stopPropagation();
        
        //optimistcally remove the linked entity from the task entities
        dispatch(api.util.updateQueryData('getRelatedEntities',
            relatedEntitiesQueryResults.originalArgs,
            cache=>
            {
                cache.payload = cache.payload.filter(link=>link.id!==relationship.id);
                return cache;
            }));

        deleteEntityLink(relationship);
    }   

    // there has to be at least one entity definition
    // the following code groups related entities by entity definition
    // and organized the data to be displayed in the grid component
    var currentEntityDefId = undefined;
    const relatedEntityGroups = [];
    var currentEntityGroup = undefined;
    for (const relatedEntity of relatedEntities)
    {
        if (currentEntityDefId !== relatedEntity.child.entityDefinition)
        {
            const currentEntityDefinition = entityDefinitions.find(def=>def.id === relatedEntity.child.entityDefinition);
            //console.log(currentEntityDefinition);
            currentEntityDefId = currentEntityDefinition.id;
            currentEntityGroup = {entityDefinition: currentEntityDefinition,
                                    name: currentEntityDefinition.name,
                                    headers: getEntityDefinitionColumnHeadings(currentEntityDefinition).concat(currentUserCanModifyCase?['Relationship','Edit/Unlink']:['Relationship']),
                                    rows:[]};
            relatedEntityGroups.push(currentEntityGroup); 
        }
        
        //console.log("relatedEntity",relatedEntity.child.propertyValues.filter(pVal=>pVal.propertyDefinition === prop.id).map(pVal2=>pVal2.value));
        const row = {rowProperties:{id:relatedEntity.id, onClick: ()=>dispatch(addEntityTab({entityId:relatedEntity.child.id, title:getTitle(entityDefinitions, relatedEntity.child )}))}, 
                sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                values: [
                        ...currentEntityGroup.entityDefinition.props.filter(prop=>!prop.deleted && prop.includeInList).map(prop => ({propertyDefinition: prop.id, type: prop.type , value:[
                            getListComponent(prop.type, relatedEntity.child.propertyValues.filter(pVal=>pVal.propertyDefinition === prop.id).map(pVal2=>pVal2.value))
                        ]}))]
                        .concat([{value:[relatedEntity.parentToChildDescription + '/' + relatedEntity.childToParentDescription],
                                    sx:{width:'0px'}},])
                    };

        currentUserCanModifyCase && row.values.push({value:[
            <Box sx={{display:'flex'}}>
                <Tooltip title="Edit link">
                    <IconButton onClick={(event)=>{event.stopPropagation();setLinkDialogRelatedEntity({...relatedEntity});}}><EditTwoToneIcon/></IconButton>
                </Tooltip>
                <Tooltip title="Unlink">
                    <IconButton onClick={(event)=>unlinkEntity(event, {...relatedEntity})}><LinkOffTwoToneIcon/></IconButton>
                </Tooltip>
            </Box>]});
        currentEntityGroup.rows.push(row);  
    }

    return (
        <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                <Box sx={{}}><b>Linked Entities</b></Box>
                <Box>
                <Tooltip title="Link an entity to this entity">
                    <IconButton onClick={()=>setLinkEntityDialogOpen(true)} sx={{visibility:currentUserCanModifyCase?'visible':'hidden'}}>
                        <AddLinkSharp/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Refresh Linked Entities">
                    <IconButton onClick={() => refetchRelatedEntities()}><RefreshIcon/></IconButton>
                </Tooltip>
                </Box> 
            </Box>  
            <Box>
            {
                relatedEntityGroups.length===0?
                <Box key={1} sx={{width:'100%', pb:3, 
                                        overflow:relatedEntitiesQueryResults.isFetching?'hidden':undefined}}>
                    <Grid header={""} 
                            columnHeadings={[]} 
                            rowValues={[]} 
                            isFetching={relatedEntitiesQueryResults.isFetching}
                            noResultsMessage={"No linked entities."}/>
                </Box>
                :
                relatedEntityGroups.map((relatedEntityGroup,index)=>
                (
                    <Box key={index} sx={{width:'100%', pb:3, 
                                            overflow:relatedEntitiesQueryResults.isFetching?'hidden':undefined}}>
                        <Grid header={relatedEntityGroup.name} 
                                columnHeadings={relatedEntityGroup.headers} 
                                rowValues={relatedEntityGroup.rows} 
                                isFetching={relatedEntitiesQueryResults.isFetching}
                                noResultsMessage={"No linked entities."}/>
                    </Box>
                ))
            }
            </Box>
        { linkEntityDialogOpen && <EntityLinkDialog  entityObj={entity} entityDefinitions={entityDefinitions} closeFn={()=>setLinkEntityDialogOpen(false)}/> }
        { linkDialogRelatedEntity && 
            <LinkDialog entityOne={entity} 
                                        entityTwo={linkDialogRelatedEntity.child} 
                                        entity1Entity2Description={linkDialogRelatedEntity.parentToChildDescription} 
                                        entity2Entity1Description={linkDialogRelatedEntity.childToParentDescription} 
                                        entityDefinitions={entityDefinitions}
                                        linkFn={(p2c,c2p)=>createEntityLink(p2c,c2p)}
                                        closeFn={()=>setLinkDialogRelatedEntity(undefined)}/>
         }
        </Box>
    );
}