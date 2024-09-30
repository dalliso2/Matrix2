import React from "react";
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import Fab from '@mui/material/Fab';
import LinkChartAddEntitiesDialog from "./LinkChartAddEntitiesDialog";

export default function LinkChartAddEntitiesButton({ addEntitiesFn })
{
    const [showLinkChartAddEntitiesDialog, setShowLinkChartAddEntitiesDialog] = React.useState(false);  

    return (
        <>
            <Fab color="primary" aria-label="add" sx={{}} onClick={()=>setShowLinkChartAddEntitiesDialog(true)}>
                <AddchartTwoToneIcon/>
            </Fab>
            { showLinkChartAddEntitiesDialog && <LinkChartAddEntitiesDialog addEntitiesFn={addEntitiesFn} closeFn={()=>setShowLinkChartAddEntitiesDialog(false)}/> }
        </>
    );
}