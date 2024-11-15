import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { getInputComponent } from "../util/InputComponentFactory";
import { DATE_TIME, SELECT_MULTIPLE, TEXT } from "../util/PropertyType";
import { selectCurrentTabData, updateTaskTabData, addTaskTab } from "../state/AppSlice";
import { TaskStatus } from "../task/Task";
import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import Grid from "../util/Grid";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { useGetCaseUsersQuery } from "../api/CaseApi";
import { useLazySearchTasksQuery } from "../api/TaskApi";
import { handleQueryError, handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { DialogContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const dateFormat = 'M/D/YYYY HH:mm';

export default function EntityTaskSearchDialog({closeFn}) 
{
    const theme = useTheme();   
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const activeCase = useSelector(selectActiveCase);
    const currentTabData = useSelector(selectCurrentTabData);

    // get users for drop down
    const { data:currentCaseUsers, ...currentCaseUsersQueryStatus } = useGetCaseUsersQuery(activeCase.id);
    handleQueryResultsWithWaitMessage(currentCaseUsersQueryStatus, dispatch, navigate, "Loading case users...", ()=>{});

    // set up search function
    const [ searchTasksFn, { data:envelope, ...searchTasksQueryStatus} ]  = useLazySearchTasksQuery();
    const results = envelope?.payload;  
    useEffect(() => {  
        if (searchTasksQueryStatus.isError)
            handleQueryError(searchTasksQueryStatus, dispatch, navigate);
    } ,[searchTasksQueryStatus.isError]);

    const searchText = getInputComponent({
        name: 'searchText', 
        label: 'Search Text', 
        type: TEXT, 
        required: false, 
        value: currentTabData && currentTabData.searchText, 
        onChange: (event) => dispatch(updateTaskTabData(tabDataId, "searchText", event.target.value))
    });

    const userSelect = getInputComponent({
        name: 'assignedTo', 
        label: 'Assigned To', 
        type: SELECT_MULTIPLE, 
        required: false, 
        selectData: currentCaseUsers && currentCaseUsers.map(user=>{return {id:user.userId,name:user.firstName + " " + user.lastName}}), 
        value: currentTabData && currentTabData.assignedTo, 
        onChange: (event) => dispatch(updateTaskTabData(tabDataId, "assignedTo", event.target.value))
    });

    const rolesSelect = getInputComponent({
        name: 'status', 
        label: 'Status', 
        type: SELECT_MULTIPLE, 
        required: false, 
        selectData: TaskStatus.map((status,index)=>{return {id:index,name:status}}), 
        value: currentTabData && currentTabData.status, 
        onChange: (event) => dispatch(updateTaskTabData(tabDataId, "status", event.target.value))
    });

    function addTask(taskData)   
    {
        dispatch(addTaskTab({taskId:taskData.id, title: "Task " + taskData.caseTaskId + " - " + taskData.title}));
    }

    const rowValues = results?.map(task=>
        {
            const assignedTo = currentCaseUsers && currentCaseUsers.find(user=>user.userId===task.assignedTo);
            const assignedToString = assignedTo?(assignedTo.lastName + ", " + assignedTo.firstName) : "Unassigned";
            return { rowProperties:{id:task.id, onClick:()=>addTask(task)},     
                        sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                        values:[
                        {sx:{textAlign:'center'},value:[task.caseTaskId],},
                        {value:[task.title],}, 
                        {value:[task.status && task.status.replaceAll('_', ' ')],},
                        {value:[task.dueDateTime && dayjs(task.dueDateTime).format(dateFormat)],}, 
                        {value:[assignedToString]}]} 
        });

    return (
        <Dialog open={true} fullWidth={true} maxWidth='lg' 
        PaperProps={{ sx: { minHeight: '80%',maxHeight: '80%' }}}>
            <DialogTitle>Search Tasks</DialogTitle>
            <DialogContent sx={{display:'flex', flexDirection:'column'}}>
                    <Box sx={{ position:'relative', width:'100%', height:'100%', display: 'flex', flexDirection:'row', flexGrow:1 }}>
                        <Paper elevation={5} sx={{display:'flex', flexDirection:'column', justifyContent:'space-between', width:'300px',p:1,m:1}}>
                            {searchText}{userSelect}{rolesSelect}     
                            <Button variant="contained" color="primary" onClick={()=>searchTasksFn({caseId:activeCase.id, searchString:currentTabData.searchText, assignedToIds:currentTabData.assignedTo,statusIds:currentTabData.status})}>Search</Button>       
                        </Paper>
                        <Paper elevation={5} sx={{display:'flex', flexGrow:1, overflow:'auto', p:0,m:1}}>
                            {
                                    <Grid  columnHeadings={["Task #","Title", "Status","Due Date/Time","Assigned To"]}
                                        columnType={[TEXT, TEXT, DATE_TIME, TEXT]}
                                        rowValues={rowValues}
                                        isFetching={searchTasksQueryStatus.isFetching}
                                    />
                            }
                        </Paper>
                    </Box>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>

    );
}