import React, { useEffect } from "react";
import { useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { MULTILINE_TEXT, TEXT, DATE_TIME, SELECT } from "../util/PropertyType";
import { getInputComponent } from "../util/InputComponentFactory";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import dayjs from "dayjs";
import { TaskStatus } from "./Task";
import { useGetCaseUsersQuery } from "../api/CaseApi";
import { validate } from "../validation/validation";
import { useStoreTaskMutation } from "../api/TaskApi";
import { handleMutationResults } from "../api/ApiUtils";
import { useDispatch } from "react-redux";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { useNavigate } from "react-router-dom";

const dateFormat = 'M/D/YYYY HH:mm';

export default function AddEditTaskDialog({successFn, closeFn, taskDataProps}) 
{    
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [task, setTask] = useState(undefined);
    const [render, setRender] = useState(false);
    const activeCase = useSelector(selectActiveCase);

    const { data:currentCaseUsers, ...currentCaseUsersQueryStatus } = useGetCaseUsersQuery(activeCase.id);
    handleQueryResultsWithWaitMessage(currentCaseUsersQueryStatus, dispatch, navigate, "Loading case users...", ()=>{});

    const [storeTask, mutationState] = useStoreTaskMutation();
    handleMutationResults(mutationState, dispatch, navigate, true, "Saving task...", "Error saving task", ()=>successFn(mutationState.data.payload), ()=>{});

    useEffect(() =>
    {
        taskDataProps && setTask(oldData=>
        {   
            const tempTaskData = {...taskDataProps};
            if (tempTaskData.dueDateTime)
                tempTaskData.dueDateTime = dayjs(tempTaskData.dueDateTime);
            if (tempTaskData.assignedDateTime)
                tempTaskData.assignedDateTime = dayjs(tempTaskData.assignedDateTime);
            if (tempTaskData.completedDateTime) 
                tempTaskData.completedDateTime = dayjs(tempTaskData.completedDateTime);
            tempTaskData.matrixCase = activeCase.id;
            return tempTaskData;
        });
    },[taskDataProps]);

    function change(event)
    {
        const value = event.target.type==="checkbox"?event.target.checked:event.target.value;

        setTask(prev=>{
            const next = {...prev, [event.target.name]: value};
            if (event.target.name === "assignedTo")
                if (event.target.value === -1)
                    next.assignedDateTime = undefined;
                else
                    next.assignedDateTime = dayjs();

            if (event.target.name === "status")
                if (event.target.value === "COMPLETED" || event.target.value === "CLOSED")
                    next.completedDateTime = dayjs();
                else
                    next.completedDateTime = undefined;

            return next;
        });
    }

    // function changeSelect(event)    
    // {
    //     setTask(prev=>{return {...prev, [event.target.name]: event.target.value}});
    // }

    const fields = useMemo(() =>
     [  
        {   name: 'id', value: undefined },
        {   name: 'title',label: 'Title', type: TEXT, required: true, value:'', onChange: (event) => change(event) },
        {   name: 'description', label: 'Description', type: MULTILINE_TEXT, rows:4, value:'',  required: true, onChange: (event) => change(event) },
        {   name: 'assignedTo', label: 'Assigned To', type: SELECT, required: false, value: '', onChange: (event) => change(event) },
        {   name: 'assignedDateTime', label: 'Assigned Date/Time', type: DATE_TIME, value:'', required: false, onChange: (value) => setTask(old=>({...old, assignedDateTime: value})) },
        {   name: 'dueDateTime', label: 'Due Date/Time', type: DATE_TIME, value:'', required: false, onChange: (value) => setTask(old=>({...old, dueDateTime: value})) },
        {   name: 'status', label: 'Status', type: SELECT, selectData: TaskStatus.map((status,index)=>{return {id:status, name:status.replaceAll('_',' ')}}), required: false, onChange: (event) => change(event) },
        {   name: 'completedDateTime', label: 'Completed Date/Time', type: DATE_TIME, value:'', required: false, onChange: (value) => setTask(old=>({...old, completedDateTime: value})) },
        {   name: 'coverageDescription', label: 'Results', type: MULTILINE_TEXT, rows:4, value:'',  required: false, onChange: (event) => change(event) },
    ],[]);

    async function save()
    {
        if (!validate(fields))
            setRender(!render);
        else
            storeTask(task);
    }

    function saveAndPrint()
    {
        console.log("Save and print");
    }

    if (currentCaseUsers)
        fields.find(field=>field.name==="assignedTo").selectData = [{id:-1, name:'Unassigned'}].concat(currentCaseUsers.map(user=>{return {id:user.userId,name:user.firstName + ", " + user.lastName}}));
    
    if (task && task.assignedTo === -1)
        fields.find(field=>field.name === "assignedDateTime").disabled = true;
    else
        fields.find(field=>field.name === "assignedDateTime").disabled = false;

    if (task && (task.status === "COMPLETED" || task.status === "CLOSED"))
        fields.find(field=>field.name === "completedDateTime").disabled = false;
    else
        fields.find(field=>field.name === "completedDateTime").disabled = true;

    //Object.keys(task).forEach(key=>fields.find(field=>field.name === key).value = task[key]);
    task && fields.forEach(field=>field.value = task[field.name]);

    return (
        <Dialog open={true} maxWidth="md" fullWidth={true} onClose={()=>alert("close")}>
        <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Add/Edit Task</DialogTitle>
            <DialogContent sx={{}}> 
                <Box sx={{display:'flex',flexDirection:'column',mt:2}}>
                    <Box sx={{display:'flex', gap:'30px'}}>
                        <Box sx={{width:'50%'}}>
                        {
                            task && fields.slice(1,3).map((field,index) => getInputComponent(field, index))
                        }
                        </Box>
                        <Box sx={{display:'flex', flexDirection:'column', width:'50%'}}>
                        
                                {task && fields.slice(3,8).map((field,index) => getInputComponent(field, index))}
                        
                        </Box>
                    </Box>
                        {task && fields.slice(8).map((field,index) => getInputComponent(field, index))}
                    <Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>save()}>Save</Button>
                <Button onClick={()=>saveAndPrint()}>Save and Print</Button>
                <Button onClick={()=>closeFn()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}