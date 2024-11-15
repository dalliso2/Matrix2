import React from "react";
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

export default function LinkChartSaveButton({ saveLinkChartFn })
{
    return (
        <Tooltip title="Save Link Chart">
            <Fab color="primary" aria-label="add" 
                sx={{}} onClick={saveLinkChartFn}><SaveTwoToneIcon/></Fab>
        </Tooltip>
    );
}