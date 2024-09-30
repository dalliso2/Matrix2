import React from "react";
import { Dialog, DialogContent, DialogTitle, Box, DialogActions, Button } from "@mui/material";
import { getTitle } from "../../util/utils";
import { IMAGE_ARRAY, PROFILE_IMAGE } from "../../util/PropertyType";
import { RETRIEVE_FILE_URL } from "../../api/file";
import './LinkDialog.css';
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetAllEntityDefinitionsQuery } from "../../api/EntityDefinitionApi";
import { useEffect } from "react";
import { handleQueryError } from "../../api/ApiUtils";
import { getInputComponent } from "../../util/InputComponentFactory";
import { MULTILINE_TEXT } from "../../util/PropertyType";
import { useStoreTaskEntityMutation } from "../../api/TaskApi";
import { handleMutationResults } from "../../api/ApiUtils";
//import { apiLinkEntities } from "../../api/entity";
//import { setReRender } from "../../state/EntityTabsSlice";

function getImageId(entityDefinitions, entityOne)
{
    console.log(entityDefinitions);
    console.log(entityOne);
    if (!entityDefinitions || !entityOne)
        return undefined;

    let imageId = undefined;

    const entityDefinition = entityDefinitions.find((defs) => defs.id === entityOne.entityDefinition );
    let defProp = entityDefinition.props.find((def) => def.type == PROFILE_IMAGE);
    if (defProp) // no PROFILE_IMAGE property in the entity definition
        imageId = entityOne.propertyValues.find((pVal) => defProp.id === pVal.propertyDefinition)?.value;

    // if no imageId found for PROFILE IMAGE use 
    if (!imageId)
    {
        console.log(entityDefinition);
        console.log(entityOne);
        defProp = entityDefinition.props.find((def) => def.type === IMAGE_ARRAY);
        if (defProp)
            imageId = entityOne.propertyValues.find((val) => val.propertyDefinition === defProp.id)?.value;
    }

    return imageId;
}

export default function TaskEntityLinkDialog({entity, description, saveFn, closeFn})
{
    console.log("TaskEntityLinkDialog");
    console.log(entity);
    const theme = useTheme();
    const dispatch = useDispatch();

    const [referenceDescription, setReferenceDescription] = React.useState(description);

    //
    // load entity definitions
    //
    const { data:envelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    useEffect(() => {
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch);
    }, [entityDefinitionQueryStatus.isError]);
    const entityDefinitions = envelope?envelope.payload:[];

    const entityName = entityDefinitions && getTitle(entityDefinitions, entity);
    const entityImageId = entityDefinitions && getImageId(entityDefinitions, entity);

    //
    // Save task-entity api function
    //
    const [storeTaskEntity, storeTaskEntityMutationState] = useStoreTaskEntityMutation();
    handleMutationResults(storeTaskEntityMutationState, dispatch, false, "","Error linking task and entity",
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
                                                    const newGroup = entityGroup.filter(ent=>ent.id!==editTaskEntity.entity.id);
                                                    if (newGroup.length)
                                                        payload.push(newGroup);
                                                });
                                                cache.payload = payload;
                                                return cache;
                                            })); 
                                            
        storeTaskEntity({taskId, entityId:editTaskEntity.entity.id, description});
    }

    // function createEntityLink()
    // {
    //     linkEntities({parentId:entityOne.id, 
    //                     childId:entityTwo.id, 
    //                     parentChildRelationshipDescription:entity1Entity2DescriptionState, 
    //                     childParentRelationshipDescription:entity2Entity1DescriptionState});
    // }

    return (
        <Dialog open={true} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Add/Edit Entity Reference</DialogTitle>
            <DialogContent>
                <Box sx={{ display:'flex', flexDirection:'column' }}>
                <Box sx={{ display:'flex', justifyContent:'center', flexDirection:'column', width:'100%' }}>
                    <Box sx={{p:1}}>{entityName}</Box>
                </Box>
                <Box sx={{ display:'flex',flexDirection:'row', gap:'20px' }}>
                    <Box sx={{ display:'flex', justifyContent:'center', flexDirection:'column' }}>
                        
                        <Box>                        
                        {
                            entityImageId && 
                            <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'200px', width:'200px', border: entityImageId?undefined:'1px solid grey', borderRadius: 5 }}>
                                <img className="label-profile-image" style={{maxWidth:'100%', maxHeight:'100%'}} src={RETRIEVE_FILE_URL + entityImageId} />
                            </Box>
                        }
                        </Box>
                    </Box>     
                    <Box sx={{ display:'flex', justifyContent:'center', flexDirection:'column', width:'100%' }}>
                        <Box>{getInputComponent({   name: 'referenceDescription', 
                                                    label: 'Reference Description', 
                                                    type: MULTILINE_TEXT, 
                                                    rows:6, 
                                                    value:referenceDescription,  
                                                    required: false, 
                                                    onChange: (event) => setReferenceDescription(event.target.value) },
                    )}</Box>
                    </Box>    
                </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() =>saveFn(referenceDescription)}>Submit</Button>
                <Button onClick={()=>closeFn()}>Cancel</Button>
            </DialogActions> 
        </Dialog>
    );
}