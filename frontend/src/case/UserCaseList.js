import React, { useState } from "react";
import Box from "@mui/material/Box";
import AddEditCaseDialog from "./AddEditCaseDialog";
import { TEXT } from "../util/PropertyType";
import Button from "@mui/material/Button";
import Grid from "../util/Grid";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useGetUserCaseListQuery } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { addCaseTab } from "../state/AppSlice";
const columnHeadings = ["Case Number", "Title", "Description", "Role"];
const columnTypes = [TEXT, TEXT, TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'},{wordBreak:'break-word', whiteSpace:'break-spaces'},{}];

//export default function UserCaseList({ caseList, refetchFn, rowClickFn})
export default function UserCaseList()
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const [selectedCase, setSelectedCase] = useState(undefined);

    const { data:caseListEnvelope, refetch, ...caseListQuery } = useGetUserCaseListQuery();
    const caseList = caseListEnvelope?.payload;

    const rowValues = caseList && caseList.map((record) => 
                ({rowProperties: {id:record.id, onClick:()=>dispatch(addCaseTab(record.id)),},
                    sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                    values:[{value:[record.caseNumber]}, {value:[record.title]}, {value:[record.description]}, [['Owner','Participant','Reviewer'][record.role]]]}));

    return (
        <Box sx={{display:'flex', flexDirection:'column', height:'100%', flexGrow:1}}>
            <Box sx={{display:'flex', justifyContent:'space-between',}}>
                <IconButton disabled={caseListQuery.isFetching} onClick={() => refetch()}><RefreshIcon/></IconButton>
                <Button disabled={caseListQuery.isFetching} onClick={()=>setSelectedCase({id:undefined, caseNumber:'', title:'', description:''})} 
                    sx={{ mr:1, alignSelf:'flex-end'}}>New Case</Button>
            </Box>
            <Grid columnHeadings={columnHeadings} columnTypes={columnTypes} cellCss={cellCss} rowValues={rowValues} isFetching={caseListQuery.isFetching}/>
            { selectedCase && <AddEditCaseDialog caseObj={selectedCase} closeFn={()=>setSelectedCase(undefined)} />}
        </Box>
    );
}