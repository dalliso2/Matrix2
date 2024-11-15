import React from "react";
import { Box } from "@mui/material";

// export default function LinkChartButtonContainer({ cyRef, addEntitiesFn, saveLinkChartFn, /* newLinkChartFn, setLayoutFn*/})
// {
export default function LinkChartButtonContainer({ children })
{
        // return (
    //     <Box sx={{position:'absolute', right:10, bottom:10, display:'flex', flexDirection:'column', gap:1  }}>
    //         <LinkChartSaveButton saveLinkChartFn={saveLinkChartFn}/>
    //         <LinkChartNewButton newLinkChartFn={newLinkChartFn}/>
    //         <LinkChartAddEntitiesButton addEntitiesFn={addEntitiesFn}/>
    //         <LinkChartLayoutsSelect setLayoutFn={setLayoutFn}/>
    //     </Box>
    // );
    return (
        <Box sx={{position:'absolute', right:10, bottom:10, display:'flex', flexDirection:'column', gap:1  }}>
            {children}
        </Box>
    );
}