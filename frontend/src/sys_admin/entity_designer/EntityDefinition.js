import React, { useState } from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import EntityDefinitionBasic from "./EntityDefinitionBasic";
import PropertyList from "./PropertyList";
import BinaryChoiceMessageBox from "../../util/BinaryChoiceMessageBox";
import { useStoreEntityDefinitionMutation } from "../../api/EntityDefinitionApi";
import { useDispatch } from "react-redux";
import { handleMutationResults } from "../../api/ApiUtils";
import { setSelectedEntityDefinitionId } from "../../state/AppSlice";
import RestorePropertyDialog from "./RestorePropertyDialog";
import { enqueueSnackbar } from 'notistack';

export default function EntityDefinition({selectedEntityDefinition})
{
    const dispatch = useDispatch();
    const [entityDefinition, setEntityDefinition] = useState(selectedEntityDefinition && JSON.parse(JSON.stringify(selectedEntityDefinition))); 

    const [modified, setModified] = useState(false);
    const [validateFields, setValidateFields] = useState(false);
    const [saveChangesMessageBoxOpen, setSaveChangesMessageBoxOpen] = useState(false);
    const [restorePropertyDialogOpen, setRestorePropertyDialogOpen] = useState(false);

    const updatingCreating = selectedEntityDefinition?.id?"Upating ":"Creating ";

    const [storeEntityDefinition, mutationState] = useStoreEntityDefinitionMutation();
    handleMutationResults(mutationState, 
                            useDispatch(), 
                            true, 
                            updatingCreating + " entity definition...", 
                            "Error" +  updatingCreating + " entity definition",
                            ()=>{
                                setModified(()=>false);
                                enqueueSnackbar( (selectedEntityDefinition.id?"Upated ":"Created ") + entityDefinition.name + " entity definition.", 
                                                    {variant:'success'}); 
                            });

    function saveEntityDefinition()
    { 
        const edCopy = JSON.parse(JSON.stringify(entityDefinition));
        // check entity definition, it can't be saved without a name
        if (!edCopy.name || edCopy.name === "")
        {
            setValidateFields(()=>true);
            setSaveChangesMessageBoxOpen(()=>false);
            dispatch(setSelectedEntityDefinitionId(edCopy.id));
        }
        else
        {
            edCopy.props.forEach((prop)=>{if (typeof prop.id === "string") delete prop.id;});
            storeEntityDefinition(edCopy);
        }
    }
    
    // new propps should be a modified copy of the existing properties
    function updateProperties(newProps)
    {
        setEntityDefinition(old=>({...old, props:newProps}));
        setModified(()=>true);
    }

    // update a single first level property of the entity definition
    function updateProperty(name, value)
    {
        console.log(name, value);
        setEntityDefinition(old=>({...old, [name]:value}));
        setModified(()=>true);
    }

    function cancelEdits()
    {
        setModified(()=>false);
        setValidateFields(()=>false);
        setSaveChangesMessageBoxOpen(()=>false);    
        setEntityDefinition(selectedEntityDefinition && JSON.parse(JSON.stringify(selectedEntityDefinition)));
    }

    const enityDefinitionChange = (!!selectedEntityDefinition !== !!entityDefinition) || (selectedEntityDefinition?.id !== entityDefinition?.id);
    if (enityDefinitionChange)
    {
        if (modified)
        {
            if  (!saveChangesMessageBoxOpen)
                setSaveChangesMessageBoxOpen(()=>true);
        }
        else
            setEntityDefinition(selectedEntityDefinition);
    }
    

    console.log("EntityDefinition", entityDefinition);  
    return (
        <>            
            <Box sx={{flexGrow:1, display:'flex', flexDirection:'column'}}>
                <Box ><Button disabled={true}>&nbsp;</Button></Box>
                <Box sx={{ display:'flex', overflow:'auto', flexDirection:'column', flexGrow:1, border:2, borderRadius:2, p:1}}>
                    <Box sx={{ display:'flex', flexGrow:1 }}>
                            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <EntityDefinitionBasic entityDefinition={entityDefinition} 
                                                        validateFields={validateFields}
                                                        setName={value=>updateProperty("name", value)}
                                                        setDescription={value=>updateProperty("description", value)}
                                                        setIncludeInLinkChart={value=>updateProperty("includeInLinkChart", value)}
                                                        />   
                                
                                <Button disabled={!entityDefinition?.props.some(prop=>prop.deleted)} onClick={()=>setRestorePropertyDialogOpen(true)}>Deleted Properties</Button>   
                            </Box>                          
                            <PropertyList properties={entityDefinition?.props} setProperties={(newProps)=>updateProperties(newProps) }/>
                    </Box>
                    <Box sx={{ display:'flex', justifyContent:'center' }}>
                        <Button disabled={!modified} onClick={()=>saveEntityDefinition()}>Save</Button>
                        <Button disabled={!modified} onClick={()=>cancelEdits()}>Cancel</Button>
                    </Box>
                </Box>
            </Box>
            {saveChangesMessageBoxOpen && <BinaryChoiceMessageBox title="Save Changes" message={"Do you want to save your changes?"} 
                                    onYes={()=>saveEntityDefinition(entityDefinition)} onNo={cancelEdits} />}
            {restorePropertyDialogOpen && <RestorePropertyDialog properties={entityDefinition.props} updatePropertiesFn={updateProperties} closeFn={()=>setRestorePropertyDialogOpen(false)}/>}
        </>
    );
}