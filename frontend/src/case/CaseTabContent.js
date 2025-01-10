import React from "react";
import CaseInfo from "./CaseInfo";
import Box from "@mui/material/Box";
import CaseUsers from "./CaseUsers";

export default function CaseTabContent({caseId})
{
    return (
        <Box sx={{display:'flex', flexDirection:'column',height:'100%', width:'100%'}}>
            <Box sx={{display:'flex', width:'100%', flexDirection:'row', gap:'30px', flexGrow:1, height:'1px'}}>
                <CaseInfo caseId={caseId}/>
                <CaseUsers caseId={caseId}/>
            </Box>
        </Box>
    );
}