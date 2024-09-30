import React from "react";
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import Fab from '@mui/material/Fab';
import NewLinkChartDialog from "./NewLinkChartDialog";

export default function LinkChartSaveButton({ newLinkChartFn })
{
    const [showNewLinkChartDialog, setShowNewLinkChartDialog] = React.useState(false);  

    return (
        <>
            <Fab color="primary" aria-label="add" sx={{}} onClick={newLinkChartFn}>
                <AddchartTwoToneIcon/>
            </Fab>
            { showNewLinkChartDialog && <NewLinkChartDialog/> }
        </>        
    );
}