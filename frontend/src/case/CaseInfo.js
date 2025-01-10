import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import AddEditCaseDialog from "./AddEditCaseDialog";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useGetCaseQuery } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../state/AppSlice";
import { userCanModifyCase } from "../util/utils";

export default function CaseInfo({caseId})
{
    const dispatch = useDispatch();
    const [editCase, setEditCase] = React.useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const currentUserCanEditCase = userCanModifyCase(currentUser, caseId);

    // load case data
    const getCaseQueryResults = useGetCaseQuery(caseId);
    const caseObj = getCaseQueryResults?.data?.payload;
 
    useEffect(() => {
        handleQueryResultsWithWaitMessage(getCaseQueryResults, dispatch);
    }, [getCaseQueryResults?.isFetching]);

    return (
        caseObj?
        <Box sx={{width:'100%'}}>
        {
            currentUserCanEditCase &&
            <Button onClick={()=>setEditCase(true)} sx={{pl:0}}>Edit</Button>
        }
            <IconButton sx={{visibility:'hidden'}}><PersonAddAltTwoToneIcon fontSize="large"/></IconButton>
            <Table>
                <TableBody>
                <TableRow>
                    <TableCell sx={{verticalAlign:'top', paddingRight:'16px', whiteSpace:'nowrap', border:'none'}}><b>Case Number:</b></TableCell>
                    <TableCell sx={{verticalAlign:'top', paddingRight:'16px', border:'none'}}>{caseObj.caseNumber}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{verticalAlign:'top', paddingRight:'16px', border:'none'}}><b>Title:</b></TableCell>
                    <TableCell sx={{whiteSpace:'pre-wrap', paddingRight:'16px', border:'none'}}>{caseObj.title}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{verticalAlign:'top', paddingRight:'16px', whiteSpace:'normal', border:'none'}}><b>Description:</b></TableCell>
                    <TableCell sx={{whiteSpace:'pre-wrap', paddingRight:'16px', border:'none'}}>{caseObj.description}</TableCell>
                </TableRow>
                </TableBody>    
            </Table>
            { editCase && <AddEditCaseDialog caseObj={caseObj} closeFn={()=>setEditCase(undefined)}/>}
        </Box>:
        <LoadingSkeleton/>
    );
}