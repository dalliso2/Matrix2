import React, { useState } from "react";
import Box from "@mui/material/Box";
import AddEditCaseDialog from "./AddEditCaseDialog";
import { TEXT } from "../util/PropertyType";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useGetUserCaseListQuery } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { addCaseTab } from "../state/AppSlice";
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import CaseGrid from "./CaseGrid";

const columnHeadings = ["Case Number", "Title", "Description", "Role"];
const columnTypes = [TEXT, TEXT, TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'},{wordBreak:'break-word', whiteSpace:'break-spaces'},{}];

export default function UserCaseList()
{
    console.log("UserCaseList");
    const theme = useTheme();
    const dispatch = useDispatch();
    const [selectedCase, setSelectedCase] = useState(undefined);

    const { refetch, ...caseListQueryResults } = useGetUserCaseListQuery();
    const caseList = caseListQueryResults?.currentData?.payload;
    useEffect(() => {
        handleQueryResultsWithWaitMessage(caseListQueryResults, dispatch);
    }, [caseListQueryResults?.isFetching]);

    const rowValues = caseList?.map((record) => 
                ({rowProperties: {id:record.id, onClick:()=>dispatch(addCaseTab(record.id)),},
                    sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                    values:[{value:[record.caseNumber], sx:{whiteSpace:'pre'}}, 
                            {value:[record.title], sx:{whiteSpace:'pre'}}, 
                            {value:[record.description]}, 
                            {value:[['Owner','Participant','Reviewer'][record.role]]}]}));

    return (
        <Box sx={{display:'flex', flexDirection:'column', height:'100%', flexGrow:1}}>
            <Box sx={{display:'flex', justifyContent:'space-between', flexGrow:0}}>
                <IconButton disabled={caseListQueryResults.isFetching} onClick={() => refetch()}><RefreshIcon/></IconButton>
                <Button disabled={caseListQueryResults.isFetching} onClick={()=>setSelectedCase({id:undefined, caseNumber:'', title:'', description:''})} 
                    sx={{ mr:1, alignSelf:'flex-end'}}>New Case</Button>
            </Box>
            <CaseGrid cases={caseList} rowClickFn={(id)=>dispatch(addCaseTab(id))} isFetching={caseListQueryResults.isFetching} />
            { selectedCase && <AddEditCaseDialog caseObj={selectedCase} closeFn={()=>setSelectedCase(undefined)} />}
        </Box>
    );
}