import React from "react";
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import Fab from '@mui/material/Fab';

export default function LinkChartSaveButton({ saveLinkChartFn })
{
    return (
        <Fab color="primary" aria-label="add" 
            sx={{}} onClick={saveLinkChartFn}><SaveTwoToneIcon/></Fab>
    );
}