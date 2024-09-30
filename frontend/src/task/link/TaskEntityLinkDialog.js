import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import Collapse from "@mui/material/Collapse";
import { getEntityDefinitions, selectEntityDefinitionArray, selectActiveCase } from "../../state/AppSlice";
import { useSelector } from "react-redux";
import { apiCall } from "../../api/base";
import { apiSearchUnlinkedEntitiesForTask } from "../../api/task";
import TaskEntityListLink from "./TaskEntityListLink";

export default function TaskEntityLinkDialog({taskObj, closeFn, reRenderFn})
{
    const dispatch = useDispatch();
    const entityDefinitions = useSelector(selectEntityDefinitionArray)
    const [selectedEntityDefIdArray, setSelectedEntityDefIdArray] = useState([]);
    const [searchEntityText, setSearchEntityText] = useState('');
    const [results, setResults] = useState([]);
    const activeCase = useSelector(selectActiveCase);

    useEffect(() => 
    {
        if (!entityDefinitions || entityDefinitions.length == 0)
            dispatch(getEntityDefinitions());
    }, [])

    async function executeSearch()
    {  
        const searchResults = await apiCall({    method:() => apiSearchUnlinkedEntitiesForTask(taskObj.id, activeCase.id, selectedEntityDefIdArray,searchEntityText), 
            dispatchFn: dispatch,
            waitMessage: "Searching entities...",});

        if (!searchResults.api_error)
            setResults(searchResults);
    }

    function removeEntityById(id)
    {
        // setResults(old => {
        //     const newResults = [];
        //     old.forEach(entityDef => {
        //         const newDef = entityDef.filter(entity=>entity.id !== id);
        //         if (newDef.length)
        //             newResults.push(newDef);
        //     });
        //     return newResults;
        // });
    }

    // group results by entityDefinitionType

    console.log(results);
    return (
        <>
        <Dialog open={true} maxWidth='lg' fullWidth>
            <DialogTitle>Link Entity</DialogTitle>
            <DialogContent>
            <Box sx={{display:'flex',flexDirection:'column', width:'100%'}}>
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
                <Collapse in={!!results.length}>
                <Box sx={{flexGrow:1, overflow:'auto'}}>
                {
                    results.map((entityDef,index) =>                    
                        <TaskEntityListLink key={index} 
                                            taskObj={taskObj} 
                                            entityDefinition={entityDefinitions.length > 0 && entityDefinitions.find(def=>def.id === (!!entityDef && entityDef.length > 0 && entityDef[0].entityDefinition))} 
                                            entityList={entityDef}
                                            reRenderFn={reRenderFn} />
                    )
                }
                </Box>
                </Collapse>
            </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeFn}>Close</Button>
            </DialogActions>
        </Dialog>
        <SetActiveCaseDialog />
        </>
    );
}