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
import { addTimelineTab, updateTimelineTabTitle } from "../state/AppSlice";
import { useStoreTimelineMutation } from "../api/TimelineApi";
import { useNavigate } from "react-router-dom";

const fields = [
    {   name: 'id', label: 'id', type: 'hidden', required: false },
    {   name: 'name', label: 'Name', type: TEXT, required: true, onChange: (event) => change(event) },
    {   name: 'description', label: 'Description', type: MULTILINE_TEXT, rows:4, maxLength:255, required: false, onChange: (event) => change(event) }
];

export default function AddEditTimelineDialog({timelineObj, closeFn}) 
{ 
    const theme = useTheme();    
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [timelineData, setTimelineData] = useState({id:timelineObj.id, matrixCaseId:timelineObj.matrixCaseId, name:timelineObj.name, description:timelineObj.description});
    
    console.log("timelineData", timelineData);  
    const [updateTimeline, mutationState] = useStoreTimelineMutation();
    handleMutationResults(mutationState, 
                            dispatch, 
                            navigate,
                            true, 
                            "Updating timeline...", "Error updating timeline", 
                            ()=>{
                                const payload = mutationState.data.payload;
                                dispatch(addTimelineTab({id:payload.id, title:payload.name}));
                                dispatch(updateTimelineTabTitle({id:timelineData.id, title:timelineData.name}));
                                closeFn();
                            }
                        );

    async function onSave()
    {
        if (!validate(fields))
            setTimelineData(prev=>({...prev}));
        else
        {
            updateTimeline(timelineData);
        }
    }

    timelineData && fields.forEach(field => 
    { 
        field.value = timelineData[field.name]; 
        field.onChange=event => setTimelineData(prev=>{return {...prev, [event.target.name]: event.target.value}})
    });

    return (
        <>
        <Dialog open={true} fullWidth={true} maxWidth={'xs'}>
        <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>{timelineData?.id?("Edit timeline: " + timelineData.name):"Add new timeline"}</DialogTitle>
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