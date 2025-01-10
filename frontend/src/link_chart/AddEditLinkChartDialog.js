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
import { handleMutationResults } from "../api/ApiUtils";
import { useUpdateLinkChartNameDescriptionMutation } from "../api/LinkChartApi";
import { addLinkChartTab, updateLinkChartTabTitle } from "../state/AppSlice";
import { useNavigate } from "react-router-dom";

const fields = [
    {   name: 'id', label: 'id', type: 'hidden', required: false },
    {   name: 'name', label: 'Name', type: TEXT, required: true, onChange: (event) => change(event) },
    {   name: 'description', label: 'Description', type: MULTILINE_TEXT, rows:4, maxLength:255, required: false, onChange: (event) => change(event) }
];

export default function AddEditLinkChartDialog({linkChartObj, closeFn}) 
{ 
    const theme = useTheme();    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [linkChartData, setLinkChartData] = useState({id:linkChartObj.id, matrixCase:linkChartObj.matrixCase, name:linkChartObj.name, description:linkChartObj.description});
    
    const [updateLinkChart, mutationState] = useUpdateLinkChartNameDescriptionMutation();
    handleMutationResults(mutationState, 
                            dispatch, 
                            ()=>{
                                const payload = mutationState.data.payload;
                                dispatch(addLinkChartTab({id:payload.id, title:payload.name}));
                                dispatch(updateLinkChartTabTitle({id:linkChartData.id, title:linkChartData.name}));
                                closeFn();
                            }
                        );

    async function onSave()
    {
        if (!validate(fields))
            setLinkChartData(prev=>({...prev}));
        else
        {
            updateLinkChart(linkChartData);
        }
    }

    linkChartData && fields.forEach(field => 
    { 
        field.value = linkChartData[field.name]; 
        field.onChange=event => setLinkChartData(prev=>{return {...prev, [event.target.name]: event.target.value}})
    });

    return (
        <>
        <Dialog open={true} fullWidth={true} maxWidth={'xs'}>
        <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>{linkChartData?.id?("Edit link chart: " + linkChartData.name):"Add new link chart"}</DialogTitle>
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