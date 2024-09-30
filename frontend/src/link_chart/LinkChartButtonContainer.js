import React from "react";
import { Box } from "@mui/material";
import LinkChartSaveButton from "./LinkChartSaveButton";
import LinkChartNewButton from "./LinkChartNewButton";
import LinkChartAddEntitiesButton from "./LinkChartAddEntitiesButton";

export default function LinkChartButtonContainer({ addEntitiesFn, saveLinkChartFn, newLinkChartFn})
{
    return (
        <Box sx={{position:'absolute', right:10, bottom:10, display:'flex', flexDirection:'column', gap:1  }}>
            <LinkChartSaveButton saveLinkChartFn={saveLinkChartFn}/>
            <LinkChartNewButton newLinkChartFn={newLinkChartFn}/>
            <LinkChartAddEntitiesButton addEntitiesFn={addEntitiesFn}/>
        </Box>
    );
}