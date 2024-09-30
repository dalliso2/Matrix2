import React from "react";
// import { apiGetChildren, apiUnlinkEntities } from "../api/entity";
import { useDispatch } from "react-redux";
// import { addEntityTab, selectReRender, setReRender } from "../state/EntityTabsSlice";
import { useTheme } from "@mui/material";
import Grid from '../util/Grid';
//import { getListComponent } from "../util/DisplayComponentFactory";
import Box from "@mui/material/Box";
import { useGetRelatedEntitiesQuery } from "../api/EntityApi";
import { handleQueryError } from "../api/ApiUtils";
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

export default function RelatedEntities({unlink=true, entityDefinitions, entityId})
{
    const theme = useTheme();   
    const dispatch = useDispatch();
    // the related entity that is being linked to the current entity
    const [linkDialogRelatedEntity, setLinkDialogRelatedEntity] = React.useState(undefined);
    // setting this to true will cause the dialog that allows searching for entities to link 
    // to the current entity to open
    const [linkEntityDialogOpen, setLinkEntityDialogOpen] = React.useState(false);

    //
    // retrieve the entity from store/server
    //
    const {data:envelope, refetch:refetchEntity, ...getEntityStatus} = useGetEntityQuery(entityId);
    useEffect(() => {
        if (getEntityStatus.isError) 
            handleQueryError(getEntityStatus, dispatch);
    }, [getEntityStatus.isError]);
    const entity = envelope?.payload;   

    //
    // code to retrieve related entities
    //
    const {refetch:refetchRelatedEntities, ...relatedEntitiesQueryResults} = useGetRelatedEntitiesQuery(entityId);
    const relatedEntities = relatedEntitiesQueryResults?.currentData?.payload || [];
    useEffect(() => {
        if (relatedEntitiesQueryResults.isError)
            handleQueryError(relatedEntitiesQueryResults, dispatch);
    }, [relatedEntitiesQueryResults.isError]);

    const entityObjName = getTitle(entityDefinitions, entity);
    const entityToLinkName = linkDialogRelatedEntity && getTitle(entityDefinitions, linkDialogRelatedEntity.child);

    //
    // code to link entities
    //
    const [linkEntities, linkEntitiesMutationStatus] = useLinkEntitiesMutation();
    handleMutationResults(linkEntitiesMutationStatus, dispatch, false, "Linking entities...",
        "Error creating link between entities", 
        ()=> enqueueSnackbar("Successfully linked " 
                                + entityObjName 
                                + " and " 
                                + linkEntitiesMutationStatus.originalArgs.entityToLinkName, {variant:'success'}),
        ()=>{});

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
                                            childId:deleteEntityLinkMutationState.originalArgs.child.id, 
                                            parentChildRelationshipDescription:deleteEntityLinkMutationState.originalArgs.parentToChildDescription, 
                                            childParentRelationshipDescription:deleteEntityLinkMutationState.originalArgs.childToParentDescription,
                                            entityToLinkName});
                                closeSnackbar(snackbarId);            
                            }}>Undo</Button>
    );

    // 
    // code to unlink entities
    //
    const [deleteEntityLink, deleteEntityLinkMutationState] = useUnlinkEntitiesMutation();
    handleMutationResults(deleteEntityLinkMutationState, 
                            dispatch, 
                            false, 
                            "Removing link...", 
                            "Error removing link",
                            ()=>{
                                enqueueSnackbar( "Removed link to " + getTitle(entityDefinitions,deleteEntityLinkMutationState.data.payload.child), 
                                {variant:'success', action:undoRemove});
                            }
                        );
                        
    function unlinkEntity(event, relationship)
    {
        event.stopPropagation();
        console.log(relationship);
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
                                    headers: getEntityDefinitionColumnHeadings(currentEntityDefinition).concat(['Relationship','Edit/Unlink']),
                                    rows:[]};
            relatedEntityGroups.push(currentEntityGroup); 
        }
        const row = {rowProperties:{id:relatedEntity.id, onClick: ()=>dispatch(addEntityTab({entityId:relatedEntity.child.id, title:getTitle(entityDefinitions, relatedEntity.child )}))}, 
                sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                values: [
                        ...currentEntityGroup.entityDefinition.props.filter(prop=>!prop.deleted && prop.includeInList).map(prop => ({propertyDefinition: prop.id, type: prop.type , value:[
                            getListComponent(prop.type, [relatedEntity.child.propertyValues.find(pVal=>pVal.propertyDefinition === prop.id)?.value])
                        ]}))]
                        .concat({value:[relatedEntity.parentToChildDescription + '/' + relatedEntity.childToParentDescription]},{sx:{width:'0px'},value:[
                            <Box sx={{display:'flex'}}>
                                <IconButton onClick={(event)=>{event.stopPropagation();setLinkDialogRelatedEntity({...relatedEntity});}}><EditTwoToneIcon/></IconButton>
                                <IconButton onClick={(event)=>unlinkEntity(event, {...relatedEntity})}><LinkOffTwoToneIcon/></IconButton>
                            </Box>
                        ]})
                    };
        currentEntityGroup.rows.push(row);  
    }

    return (
        <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                <Box sx={{}}><b>Linked Entities</b></Box>
                <Box>
                <IconButton onClick={() => refetchRelatedEntities()}><RefreshIcon/></IconButton>
                <IconButton onClick={()=>setLinkEntityDialogOpen(true)}>
                    <AddLinkSharp/>
                </IconButton>
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