import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { List, ListItemButton, ListItemText, ListItem } from "@mui/material";
import { useSelector } from "react-redux";
import { selectActiveCase, setActiveCase, selectAuthToken } from "../state/AppSlice";
import { useLazyGetUserCaseListQuery } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";

export default function SetActiveCaseDialog()
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // app state
    const authToken = useSelector(selectAuthToken);
    const activeCase = useSelector(selectActiveCase);   
    
    // local state
    const [selectedCase, setSelectedCase] = useState(null);

    const [getUserCaseList, { data:envelope, currentData, ...userCaseListQueryStatus }] = useLazyGetUserCaseListQuery();
    handleQueryResultsWithWaitMessage(userCaseListQueryStatus, dispatch, navigate, "Loading cases...");
    const caseList = envelope?.payload;

    useEffect(() => {
        if (authToken && !activeCase)
        {
            getUserCaseList();
        }
    },[activeCase]);


    return (
        <>
        { userCaseListQueryStatus.isSuccess?
            <>
            <Dialog open={!caseList?.length}>
                <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>No Cases Available</DialogTitle>
                <DialogContent sx={{p:24}}>
                    <Box>There are no cases available.  Click OK to be taken to the case management screen.</Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>navigate("/cases")}>Ok</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={!activeCase && !!caseList?.length} onClose={()=>{}}>
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Set Active Case</DialogTitle>
            <DialogContent>
            <List >
                {
                    caseList && caseList.map((aCase, index) =>
                    (
                        <ListItem key={index} disablePadding>
                            <ListItemButton key={index} selected={selectedCase?.id == aCase.id} onClick = {(event) => setSelectedCase({...aCase})}>
                                <ListItemText>
                                    <Box sx={{display:'flex'}}>
                                        <Box sx={{width:'200px'}}>{aCase.caseNumber}</Box>
                                        <Box sx={{whiteSpace:'pre-wrap',width:'300px'}}>{aCase.title}</Box>    
                                    </Box>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
            </DialogContent>
            <DialogActions>
                <Button disabled={!selectedCase} onClick={()=>dispatch(setActiveCase({...selectedCase}))}>Ok</Button>
            </DialogActions>
            </Dialog>
            </>
            :
            undefined
        }
        </>
    );
}