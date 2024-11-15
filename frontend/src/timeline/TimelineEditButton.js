import React from "react";
import Fab from '@mui/material/Fab';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddEditTimelineDialog from "./AddEditTimelineDialog";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

export default function TimelineEditButton({ TimelineObj })
{
    const [showAddEditTimelineDialog, setShowAddEditTimelineDialog] = useState(false);  

    return (
        <Tooltip title="Edit Name/Description of Link Chart">
            <Fab color="primary" aria-label="add" sx={{}} onClick={()=>setShowAddEditTimelineDialog(true)}>
                <EditTwoToneIcon/>
            </Fab>
            { showAddEditTimelineDialog && <AddEditTimelineDialog TimelineObj={TimelineObj} 
                                                                    closeFn={()=>setShowAddEditTimelineDialog(false)}/> }
        </Tooltip>
    );
}