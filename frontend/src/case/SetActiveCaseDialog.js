import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetUserCaseListQuery } from "../api/CaseApi";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { useEffect } from "react";
import LoadingSkeleton from "../util/LoadingSkeleton";
import CaseGrid from "./CaseGrid";
import { setActiveCase } from "../state/AppSlice";

export default function SetActiveCaseDialog()
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeCase = useSelector(selectActiveCase);   
    const [selectedCase, setSelectedCase] = useState(null);

    const userCaseListQueryResults = useGetUserCaseListQuery();
    useEffect(() => {
        handleQueryResultsWithWaitMessage(userCaseListQueryResults, dispatch);
    }, [userCaseListQueryResults.isFetching]);
    const caseList = userCaseListQueryResults?.data?.payload;

    return (
        <Dialog open={!activeCase} fullWidth={true} maxWidth={'sm'} sx={{'& .MuiDialogContent-root': {paddingTop:'24px'}}}>
        {    
            (caseList && !caseList.length)?
            (
                <>
                <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>No Cases Available</DialogTitle>
                <DialogContent>
                    <p>There are no cases available.  Click OK to be taken to the case management screen where you can create a new case.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>navigate("/cases")}>Ok</Button>
                </DialogActions>
                </>
            )
            :
            (
                <>
                <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Set Active Case</DialogTitle>
                <DialogContent sx={{ display:'flex', maxHeight:'400px', overflow:'hidden',}}>
                    <Box sx={{display:'flex', flexDirection:'column', flexGrow:1, overflow:'hidden', mt:3}}>
                    {
                        caseList?
                        <CaseGrid cases={caseList} rowClickFn={(caseObj)=> dispatch(setActiveCase(caseList.find(theCase=>theCase.id === caseObj.id))) } isFetching={userCaseListQueryResults.isFetching} />
                        :<Box sx={{overflow:'hidden', height:'200px'}}><LoadingSkeleton/></Box>
                    }
                    </Box>
                </DialogContent>
                </>
            )
        }
        </Dialog>
    );
}