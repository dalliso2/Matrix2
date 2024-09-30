import React from "react";
import Draggable from "react-draggable";
import { Paper, Typography } from "@mui/material";
import LinkChartEntityList from "./LinkChartEntityList";
import { useTheme } from "@emotion/react";
import { Box, Button } from "@mui/material";

export default function LinkChartAddEntitiesDialog({ addEntitiesFn, closeFn })
{
    const theme = useTheme();

    return (
        <Draggable sx={{ borderRadius:'5px'}}>
            <Paper elevation={5} sx={{  position:'fixed', 
                                        left:'calc(50% - 150px)', 
                                        top:'calc(50% - 150px)', 
                                        width:'300px', 
                                        height:'400px', 
                                        borderRadius:'5px',
                                        display:'flex',
                                        flexDirection:'column'}}>
                <Typography component="h2" variant="h6" className="MuiDialogTitle-root"
                            sx={{   padding:'16px 24px', 
                                    flex:'0 0 auto', 
                                    borderTopLeftRadius:'5px',
                                    borderTopRightRadius:'5px',
                                    backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText  
                            }}>Add Entities</Typography>
                <LinkChartEntityList addEntitiesFn={addEntitiesFn}/>
                <Box>
                    <Button onClick={()=>closeFn()} sx={{m:1, float:'right'}}>Close</Button>
                    <Button onClick={()=>closeFn()} sx={{m:1, float:'right'}}>Add All</Button>
                </Box>
            </Paper>
        </Draggable>
    );
}