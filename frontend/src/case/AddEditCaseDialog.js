import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { getInputComponent } from "../util/InputComponentFactory";
import { TEXT, MULTILINE_TEXT } from "../util/PropertyType";
import { validate } from "../validation/validation";
import { useDispatch } from "react-redux";
import { useStoreCaseMutation } from "../api/CaseApi";
import { handleMutationResults } from "../api/ApiUtils";

const fields = [
    {   name: 'id', label: 'id', type: 'hidden', required: false },
    {   name: 'caseNumber', label: 'Case Number', type: TEXT, required: true, onChange: (event) => change(event) },
    {   name: 'title', label: 'Title', type: MULTILINE_TEXT, rows:4, maxLength:255, required: true,onChange: (event) => change(event) },
    {   name: 'description', label: 'Description', type: MULTILINE_TEXT, rows:4, maxLength:255, required: false, onChange: (event) => change(event) }
];

export default function AddEditCaseDialog({caseObj, closeFn}) 
{ 
    const theme = useTheme();    
    const [caseData, setCaseData] = useState(caseObj);

    const [storeCase, mutationState] = useStoreCaseMutation();
    handleMutationResults(mutationState, useDispatch(), true, "Updating case...", "Error Updating Case", ()=>closeFn());

    async function onSave()
    {
        if (!validate(fields))
            setCaseData(prev=>({...prev}));
        else
            storeCase(caseData);
    }

    caseData && fields.forEach(field => 
    { 
        field.value = caseData[field.name]; 
        field.onChange=event => setCaseData(prev=>{return {...prev, [event.target.name]: event.target.value}})
    });

    return (
        <>
        <Dialog open={true} fullWidth={true} maxWidth={'xs'}>
        <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>{caseObj?("Edit case: " + caseObj.caseNumber):"Add new case"}</DialogTitle>
        <DialogContent sx={{mt:2}}> 
        {
            fields.map((field, index) => 
            (
                <Box key={index}>
                    {getInputComponent(field, index)}
                </Box>
            ))
        }
        </DialogContent>
        <DialogActions> 
            <Button onClick={onSave}>Save</Button>
            <Button onClick={closeFn}>Cancel</Button>
        </DialogActions>
        </Dialog>
        </>
  ) ;
}   