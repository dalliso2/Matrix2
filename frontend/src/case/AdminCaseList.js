import React from "react";
import Box from "@mui/material/Box";
import { TEXT } from "../util/PropertyType";
import { useTheme } from "@mui/material/styles";
import { useLazySearchCasesQuery } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { addCaseTab, selectAdminCaseSearchText, setAdminCaseSearchText, setAdminCaseSearchList, selectAdminCaseSearchList } from "../state/AppSlice";
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import Grid from "../util/Grid";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddEditCaseDialog from "./AddEditCaseDialog";
import { shortenString } from "../util/utils";

const columnHeadings = ["Case Number", "Title", "Description"];
const columnTypes = [TEXT, TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'},{wordBreak:'break-word', whiteSpace:'break-spaces'},{}];

export default function UserCaseList()
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const searchText = useSelector(selectAdminCaseSearchText);
    const caseSearchList = useSelector(selectAdminCaseSearchList);
    const [createCase,setCreateCase] = React.useState(false);   

    const [ search, caseListQueryResults ] = useLazySearchCasesQuery();
    const caseList = caseListQueryResults?.data?.payload;
    
    useEffect(() => {
        handleQueryResultsWithWaitMessage(caseListQueryResults, dispatch);
        if (!caseListQueryResults?.isFetching && caseListQueryResults.isSuccess)
            dispatch(setAdminCaseSearchList(caseListQueryResults.data.payload));
    }, [caseListQueryResults?.isFetching]);

    function addCase(caseData)
    {
        if (caseData)
            dispatch(addCaseTab(caseData));
        setCreateCase(undefined);
    }

    const rowValues = caseSearchList?.map((record) => 
                ({rowProperties: {id:record.id, key:record.id, onClick:()=>dispatch(addCaseTab(record)),},
                    sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                    values:[{value:[record.caseNumber], sx:{whiteSpace:'pre'}, cellProperties:{key:record.id + "caseNumber"}}, 
                            {value:[record.title], sx:{whiteSpace:'pre'}, cellProperties:{key:record.id + "title"}}, 
                            {value:[shortenString(record.description,300)], cellProperties:{key:record.id + "desc"}},]}));

    return (
        <>
        <Box sx={{display:'flex', flexDirection:'column', height:'100%', flexGrow:1}}>
            <Box sx={{display:'flex', flexGrow:0}}>
                <TextField label={"Search Case number/Title"} onChange={event=>dispatch(setAdminCaseSearchText(event.target.value))} fullWidth
                            size="small" sx={{width:'40ch'}} value={searchText}/>              
                <Button disabled={caseListQueryResults.isFetching} onClick={() => search(searchText)} sx={{ mr:1}}>Search</Button>                  
                <Button disabled={caseListQueryResults.isFetching} onClick={()=>setCreateCase({id:undefined, caseNumber:'', title:'', description:''})} 
                        sx={{ mr:1}}>New Case</Button>
            </Box>            
            <Grid columnHeadings={columnHeadings} 
                                columnTypes={columnTypes} 
                                cellCss={cellCss} 
                                rowValues={rowValues} 
                                isFetching={caseListQueryResults.isFetching}/>
        </Box>
        { createCase && <AddEditCaseDialog caseObj={createCase} closeFn={(caseData)=>addCase(caseData)} />}
        </>
    );
}