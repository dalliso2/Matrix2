import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useBlocker } from "react-router";

function sortProperties(props)
{
    let order = 0;
    props.map((prop) => ({...prop, propOrder:order++}));
    props.sort((a,b)=> !a.deleted && b.deleted?-1:0 );
    order = 0;
    props.forEach(prop=>prop.propOrder = order++);
}

export default function EntityDefinition({selectedEntityDefinition})
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [entityDefinition, setEntityDefinition] = useState(selectedEntityDefinition && JSON.parse(JSON.stringify(selectedEntityDefinition))); 
    const [modified, setModified] = useState(false);    
    const [nextRoute, setNextRoute] = useState(undefined);

    const [validateFields, setValidateFields] = useState(false);
    const [saveChangesMessageBoxOpen, setSaveChangesMessageBoxOpen] = useState(false);
    const [restorePropertyDialogOpen, setRestorePropertyDialogOpen] = useState(false);

    const [storeEntityDefinition, mutationState] = useStoreEntityDefinitionMutation();
    handleMutationResults(mutationState, dispatch, ()=>{setModified(()=>false);});

    useEffect(()=>{
        if (entityDefinition)
        {
            sortProperties(entityDefinition.props);
         }
    },[entityDefinition]);

    function saveEntityDefinition()
    { 
        setSaveChangesMessageBoxOpen(()=>false);
        const edCopy = JSON.parse(JSON.stringify(entityDefinition));
        // check entity definition, it can't be saved without a name
        if (!edCopy.name || edCopy.name === "")
        {
            setValidateFields(()=>true);
            dispatch(setSelectedEntityDefinitionId(edCopy.id));
        }
        else
        {
            edCopy.props.forEach((prop)=>{if (typeof prop.id === "string") delete prop.id;});
            storeEntityDefinition(edCopy);
            if (nextRoute)
                navigate(nextRoute);
        }
    }

    // new propps should be a modified copy of the existing properties
    function updateProperties(newProps)
    {
        sortProperties(newProps);
        setEntityDefinition(old=>({...old, props:newProps}));
        setModified(()=>true);
    }

    // update a single first level property of the entity definition
    function updateProperty(name, value)
    {
        setEntityDefinition(old=>({...old, [name]:value}));
        setModified(()=>true);
    }

    // user has cancelled edits, reset validation flag, close the save confirmation message box
    // and set modified to false.  This will trigger the useEffect to reset the entity definition
    function cancelEdits()
    {
        setValidateFields(()=>false);
        setSaveChangesMessageBoxOpen(()=>false);    
        setModified(()=>false);
    }

    // if user selects a different entity definition ask if they want to save the changes.
    useEffect(() => {
        if (modified)
            setSaveChangesMessageBoxOpen(()=>true);
        else if (selectedEntityDefinition)
            setEntityDefinition(JSON.parse(JSON.stringify(selectedEntityDefinition)));
    }, [selectedEntityDefinition]);

    // if user tries to navigate away from the page with unsaved changes
    // block the navigation and ask the user if they want to save the changes
    useBlocker((tx) => {
        if (modified && !nextRoute)
        {
            setSaveChangesMessageBoxOpen(()=>true);
            setNextRoute(tx.nextLocation.pathname);
            return true;
        }
        else 
            return false;
    });
    
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
                        <Button disabled={!modified} onClick={()=>setSaveChangesMessageBoxOpen(true)}>Cancel</Button>
                    </Box>
                </Box>
            </Box>
            {saveChangesMessageBoxOpen && <BinaryChoiceMessageBox title="Save Changes" message={"Do you want to save your changes?"} 
                                    onYes={()=>saveEntityDefinition()} onNo={()=>{cancelEdits();setEntityDefinition(JSON.parse(JSON.stringify(selectedEntityDefinition)));}} />}
            {restorePropertyDialogOpen && <RestorePropertyDialog properties={entityDefinition.props} updatePropertiesFn={updateProperties} closeFn={()=>setRestorePropertyDialogOpen(false)}/>}
        </>
    );
}