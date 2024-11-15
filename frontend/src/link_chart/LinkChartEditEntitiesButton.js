import React from "react";
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

export default function LinkChartEditEntitiesButton({ openFn })
{
    return (
        <>
            <Tooltip title="Edit Entities">
                <Fab color="primary" aria-label="add" sx={{}} onClick={()=>openFn()}>
                    <AddchartTwoToneIcon/>
                </Fab>
            </Tooltip>
        </>
    );
}