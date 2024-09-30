import React, { useState } from "react";
import Box from "@mui/material/Box";
import AddEditCaseDialog from "./AddEditCaseDialog";
import { TEXT } from "../util/PropertyType";
import Button from "@mui/material/Button";
import Grid from "../util/Grid";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

const columnHeadings = ["Case Number", "Title", "Description", "Role"];
const columnTypes = [TEXT, TEXT, TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'},{wordBreak:'break-word', whiteSpace:'break-spaces'},{}];

export default function UserCaseList({ caseList, refetchFn, rowClickFn})
{
    const theme = useTheme();
    const [selectedCase, setSelectedCase] = useState(undefined);

    const rowValues = caseList && caseList.map((record) => 
                ({rowProperties: {id:record.id, onClick:()=>rowClickFn(record),},
                    sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                    values:[{value:[record.caseNumber]}, {value:[record.title]}, {value:[record.description]}, [['Owner','Participant','Reviewer'][record.role]]]}));

    return (
        <Box sx={{width:'100%'}}>
            <Box sx={{position:'relative',display:'flex', justifyContent:'space-between', padding:'5px', flexGrow:1}}>
                <IconButton onClick={() => refetchFn()}><RefreshIcon/></IconButton>
                <Button onClick={()=>setSelectedCase({id:undefined, caseNumber:'', title:'', description:''})} 
                    sx={{ mr:1, alignSelf:'flex-end'}}>New Case</Button>
            </Box>
            <Grid columnHeadings={columnHeadings} columnTypes={columnTypes} cellCss={cellCss} rowValues={rowValues} isLoading={!rowValues}/>
            { selectedCase && <AddEditCaseDialog caseObj={selectedCase} closeFn={()=>setSelectedCase(undefined)} />}
        </Box>
    );
}