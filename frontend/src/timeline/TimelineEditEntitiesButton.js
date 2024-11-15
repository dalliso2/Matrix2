import React from "react";
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

export default function TimelineEditEntitiesButton({ openFn })
{
    return (
        <>
            <Tooltip title="Edit Entities">
                <Fab color="primary" aria-label="add" sx={{}} onClick={()=>openFn()}>
                    <AddCircleOutlineTwoToneIcon/>
                </Fab>
            </Tooltip>
        </>
    );
}