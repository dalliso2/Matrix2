import React from "react";
import Draggable from "react-draggable";
import { Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { Checkbox, List, ListItem } from "@mui/material";
import { useState } from "react";

export default function TimelineEditEntitiesDialog({ timelineRef, timelineEntities,
                                                        addEntitiesFn, removeEntitiesFn, closeFn })
{
    const theme = useTheme();
    const activeCase = useSelector(selectActiveCase);

    const [reRender, setReRender] = useState(false);

    function entityClicked(entityId)
    {
        if(timelineRef.current.itemsData.getIds().includes(entityId))
            removeEntitiesFn([entityId]);
        else
            addEntitiesFn([entityId]);
        
        setReRender(!reRender);
    }

    function addAllEntities()
    {
        const existingEntityIds = timelineRef.current.itemsData.getIds();
        addEntitiesFn(timelineEntities.map(entity=>entity.id).filter(id=>!existingEntityIds.includes(id)));
        setReRender(!reRender);
    }

    function removeAllEntities()
    {
        removeEntitiesFn(timelineRef.current.itemsData.getIds());
        setReRender(!reRender);
    }

    const selectedEntityIds = timelineRef.current.itemsData.getIds();

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
                            sx={{   padding:'16px 24px', 
                                    flex:'0 0 auto', 
                                    borderTopLeftRadius:'5px',
                                    borderTopRightRadius:'5px',
                                    backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText  
                            }}>Add Entities</Typography>

                    <Box sx={{width:'100%', height:'100%', overflow:'auto', display:'flex'}}>
                        {timelineEntities.length > 0?
                            <List sx={{width:'100%'}}>
                                {timelineEntities.map((entity, index) => (
                                    <ListItem key={entity.id}
                                            secondaryAction={<Checkbox checked={selectedEntityIds.includes(entity.id)} 
                                            onClick={()=>entityClicked(entity.id)} 
                                            name={entity.id}  />}>
                                        {entity.title}
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