import React from "react";
import Draggable from "react-draggable";
import { Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { useGetAllLinkChartEntitiesForCaseQuery } from "../api/EntityApi";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { Checkbox, List, ListItem } from "@mui/material";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function LinkChartEditEntitiesDialog({ existingEntitiesIdsFn, 
                                                        addEntitiesFn, removeEntitiesFn, closeFn })
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const activeCase = useSelector(selectActiveCase);

    const [reRender, setReRender] = useState(false);

    // get all link chart entities for the active case
    const getAllLinkChartEntitiesForCaseResults = useGetAllLinkChartEntitiesForCaseQuery(activeCase.id);
    const allEntities = getAllLinkChartEntitiesForCaseResults?.data?.payload;//.filter(entity=>!existingEntitiesFn().includes(entity.id.toString())) || [];

    // check for query errors
    useEffect(() => {  
        handleQueryResultsWithWaitMessage(getAllLinkChartEntitiesForCaseResults,dispatch);
    } ,[getAllLinkChartEntitiesForCaseResults.isFetching]);

    function entityClicked(entityId)
    {
        if(existingEntitiesIdsFn().includes(entityId))
            removeEntitiesFn([entityId]);
        else
            addEntitiesFn([entityId]);
        
        setReRender(!reRender);
    }

    function addAllEntities()
    {
        const existingEntityIds = existingEntitiesIdsFn();
        addEntitiesFn(allEntities.map(entity=>entity.id.toString()).filter(id=>!existingEntityIds.includes(id)));
        setReRender(!reRender);
    }

    function removeAllEntities()
    {
        removeEntitiesFn(existingEntitiesIdsFn());
        setReRender(!reRender);
    }

    const selectedEntityIds = existingEntitiesIdsFn();
    return (
        <Draggable sx={{ borderRadius:'5px' }}>
            <Paper elevation={5} sx={{  position:'fixed', 
                                        right: '10px',
                                        top:'calc(50% - 200px)', 
                                        width:'300px', 
                                        height:'400px', 
                                        borderRadius:'5px',
                                        display:'flex',
                                        flexDirection:'column', 
                                        zIndex:20000}}>
                <Typography component="h2" variant="h6" className="MuiDialogTitle-root"
                            sx={{   padding:'8px 16px', 
                                    flex:'0 0 auto', 
                                    display:'flex',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    borderTopLeftRadius:'5px',
                                    borderTopRightRadius:'5px',
                                    backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText  
                            }}>Add Entities<IconButton sx={{}} onClick={() =>console.log("AAAAAA")}><RefreshIcon sx={{'&.MuiSvgIcon-root':{fill:theme.palette.secondary.contrastText}}}/></IconButton></Typography>

                    <Box sx={{width:'100%', height:'100%', overflow:'auto', display:'flex'}}>
                    {
                        getAllLinkChartEntitiesForCaseResults.isFetching?
                        <LoadingSkeleton/>:
                        allEntities.length > 0?
                            <List sx={{width:'100%'}}>
                                {allEntities.map((entity, index) => (
                                    <ListItem key={entity.id}
                                            secondaryAction={<Checkbox checked={selectedEntityIds.includes(entity.id.toString())} 
                                            onClick={()=>entityClicked(entity.id.toString())} 
                                            name={entity.id}  />}>
                                            <Typography>{entity.title}</Typography>
                                    </ListItem>    
                                ))}
                            </List>
                            :
                            <Box sx={{width:'100%', height:'100%', p:2, display:'flex', justifyContent:'center', alignItems:'center'}}>
                                All available entities have been added to the chart.
                            </Box>
                    }
                    </Box>
                <Box>
                    <Button onClick={()=>closeFn()} sx={{m:1, float:'right'}}>Close</Button>
                    <Button onClick={()=>addAllEntities()} 
                            sx={{m:1, float:'right'}}>Add All</Button>
                    <Button onClick={()=>removeAllEntities()} 
                            sx={{m:1, float:'right'}}>Remove All</Button>
                </Box>
            </Paper>
        </Draggable>
    );
}