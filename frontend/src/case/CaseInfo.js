import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import AddEditCaseDialog from "./AddEditCaseDialog";
import LoadingSkeleton from "../util/LoadingSkeleton";

export default function CaseInfo({caseObj})
{
    const [editCase, setEditCase] = React.useState(false);

    return (
        caseObj?
        <Box sx={{width:'100%'}}>
            <Button onClick={()=>setEditCase(true)} sx={{pl:0}}>Edit</Button>
            <IconButton sx={{visibility:'hidden'}}><PersonAddAltTwoToneIcon fontSize="large"/></IconButton>
            <table>
                <tbody>
                <tr><td style={{verticalAlign:'top', paddingRight:'16px', whiteSpace:'nowrap'}}><b>Case Number:</b></td><td style={{verticalAlign:'top', paddingRight:'16px'}}>{caseObj.caseNumber}</td></tr>
                <tr><td style={{verticalAlign:'top', paddingRight:'16px'}}><b>Title:</b></td><td style={{whiteSpace:'pre-wrap', paddingRight:'16px'}}>{caseObj.title}</td></tr>
                <tr><td style={{verticalAlign:'top', paddingRight:'16px', whiteSpace:'normal'}}><b>Description:</b></td><td style={{whiteSpace:'pre-wrap', paddingRight:'16px'}}>{caseObj.description}</td></tr>
                </tbody>    
            </table>
            { editCase && <AddEditCaseDialog caseObj={caseObj} closeFn={()=>setEditCase(false)}/>}
        </Box>:
        <LoadingSkeleton/>
    );
}