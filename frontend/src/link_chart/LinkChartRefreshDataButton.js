import React from "react";
import Fab from '@mui/material/Fab';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import Tooltip from "@mui/material/Tooltip";

export default function LinkChartRefreshDataButton({ refreshFn })
{
    return (
        <Tooltip title="Refresh Link Chart Data">
            <Fab color="primary" aria-label="add" sx={{}} onClick={()=>refreshFn()}>
                <RefreshTwoToneIcon/>
            </Fab>
        </Tooltip>
    );
}