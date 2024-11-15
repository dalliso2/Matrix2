import React from "react";
import './EntityTabContent.css';
import Entity from "./Entity";
import RelatedEntities from "./RelatedEntities";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import DragDropTarget2 from "../util/dragdrop/DragDropTarget2";
//import { apiCall } from "../api/base";
import EntityFiles from "./EntityFiles";
import { useAddFilesToEntityMutation } from "../api/EntityApi";
import { useStoreFilesMutation } from "../api/FileApi";
import { useSelector } from "react-redux";
import { selectActiveCase, selectAuthToken } from "../state/AppSlice";
import { handleMutationResults } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import EntityTasks from "./EntityTasks";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EntityTabContent({entityId})
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authToken = useSelector(selectAuthToken);
    const activeCase = useSelector(selectActiveCase);
    
    const [addFilesToEntity,addFileMutationState] = useAddFilesToEntityMutation();
    
    const { data:entityDefsEnvelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefsEnvelope?entityDefsEnvelope.payload:[];
    useEffect(() => {
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch, navigate);
    }, [entityDefinitionQueryStatus.isError]);

    handleMutationResults(addFileMutationState, dispatch, navigate, false, "Adding file link...",
        "Error adding file link", 
        ()=>addFileMutationState.data.payload.forEach(entityFile=>enqueueSnackbar("Added link to file: " + entityFile.mfile.name, {variant:'success'}))); 

    const [storeFiles,storeFilesMutationState] = useStoreFilesMutation();
    handleMutationResults(storeFilesMutationState, dispatch, navigate, false, "Saving files...",
        "Error saving files.", 
        ()=>{}); 

    function closeDialog()
    {
        setEditEntityDialogOpen(()=>false);
        setLinkEntityDialogOpen(()=>false);   
    }
    
    function addFiles(fileDataArray)
    {
        storeFiles(fileDataArray);
        addFilesToEntity(fileDataArray.map((fileData)=>({matrixEntity:entityId, mFile:fileData.id})));
    }
    
    return (
        <> 
        <Box sx={{display:'flex', flexDirection:'column', width:'100%', position:'relative', alignItems:'stretch'}}>      
            <Box sx={{flexGrow:1, display:'flex',  width:'100%', flexDirection:'column', overflow:'auto'}}>
                    <Box sx={{p:0,m:1}}>
                        <Paper>
                            <Entity entityId={entityId} entityDefinitions={entityDefinitions}/>
                        </Paper>
                        <Paper>
                            <Box sx={{ display:'flex', flexDirection:'column',justifyContent:'space-around',m:2}}>                        
                                <RelatedEntities entityId={entityId} entityDefinitions={entityDefinitions}/>
                            </Box>
                        </Paper>
                        <Paper>
                            <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'space-around',m:2, mb:0}}>
                                <DragDropTarget2 fileUploadCallback={addFiles} caseId={activeCase?.id}  sx={{ borderRadius:'4px'}}>
                                    <EntityFiles entityId={entityId}/>
                                </DragDropTarget2>
                            </Box>
                        </Paper>
                        <Paper>
                            <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'space-around',m:2, mb:0}}>
                                <EntityTasks entityId={entityId}/>
                            </Box>
                        </Paper>
                    </Box>
            </Box>
        </Box>
        </>
    );
}