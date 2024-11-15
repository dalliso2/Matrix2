import React from "react";
import Fab from '@mui/material/Fab';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddEditLinkChartDialog from "./AddEditLinkChartDialog";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

export default function LinkChartEditButton({ linkChartObj })
{
    const [showAddEditLinkChartDialog, setShowAddEditLinkChartDialog] = useState(false);  

    return (
        <Tooltip title="Edit Name/Description of Link Chart">
            <Fab color="primary" aria-label="add" sx={{}} onClick={()=>setShowAddEditLinkChartDialog(true)}>
                <EditTwoToneIcon/>
            </Fab>
            { showAddEditLinkChartDialog && <AddEditLinkChartDialog linkChartObj={linkChartObj} 
                                                                    closeFn={()=>setShowAddEditLinkChartDialog(false)}/> }
        </Tooltip>
    );
}