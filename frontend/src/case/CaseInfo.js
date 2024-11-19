import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import AddEditCaseDialog from "./AddEditCaseDialog";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

export default function CaseInfo({caseObj})
{
    const [editCase, setEditCase] = React.useState(false);

    return (
        caseObj?
        <Box sx={{width:'100%'}}>
            <Button onClick={()=>setEditCase(true)} sx={{pl:0}}>Edit</Button>
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
            { editCase && <AddEditCaseDialog caseObj={caseObj} closeFn={()=>setEditCase(false)}/>}
        </Box>:
        <LoadingSkeleton/>
    );
}