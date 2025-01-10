import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import { getInputComponent } from "../util/InputComponentFactory";
import { DATE_TIME, SELECT_MULTIPLE, TEXT } from "../util/PropertyType";
import { selectCurrentTabData, updateTaskTabData, addTaskTab } from "../state/AppSlice";
import { TaskStatus } from "./Task";
import { Box, Button } from "@mui/material";
import Grid from "../util/Grid";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { useGetCaseUsersQuery } from "../api/CaseApi";
import { useLazySearchTasksQuery } from "../api/TaskApi";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { useNavigate } from "react-router-dom";

const dateFormat = 'M/D/YYYY HH:mm';

export default function TaskSearch({tabDataId}) 
{
    const theme = useTheme();   
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const activeCase = useSelector(selectActiveCase);
    const currentTabData = useSelector(selectCurrentTabData);

    // get users for drop down
    const currentCaseUsersQueryResults = useGetCaseUsersQuery(activeCase.id);
    useEffect(() => {
        handleQueryResultsWithWaitMessage(currentCaseUsersQueryResults, dispatch);
    }, [currentCaseUsersQueryResults?.isFetching]);
    const currentCaseUsers = currentCaseUsersQueryResults?.data?.payload;   

    // set up search function
    const [ searchTasksFn, searchTasksQueryResults ]  = useLazySearchTasksQuery();
    const results = searchTasksQueryResults?.data?.payload;
    useEffect(() => {  
        handleQueryResultsWithWaitMessage(searchTasksQueryResults, dispatch);
        if (!searchTasksQueryResults.isFetching && searchTasksQueryResults.isSuccess)
            dispatch(updateTaskTabData(tabDataId, "results", results));
    } ,[searchTasksQueryResults.isFetching]);

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

    const rowValues = currentTabData.results?.map(task=>
        {
            const assignedTo = currentCaseUsers && currentCaseUsers.find(user=>user.userId===task.assignedTo);
            const assignedToString = assignedTo?(assignedTo.lastName + ", " + assignedTo.firstName) : "Unassigned";
            return { rowProperties:{id:task.id, key:task.id+"row",onClick:()=>addTask(task)},     
                        sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                        values:[
                        {sx:{textAlign:'center'},value:[task.caseTaskId],cellProperties:{key:task.caseTaskId + "taskNumber"}},
                        {value:[task.title],cellProperties:{key:task.caseTaskId + "taskTitle"}}, 
                        {value:[task.status && task.status.replaceAll('_', ' ')],cellProperties:{key:task.caseTaskId + "taskStatus"}},
                        {value:[task.dueDateTime && dayjs(task.dueDateTime).format(dateFormat)],cellProperties:{key:task.caseTaskId + "dueDateTime"}}, 
                        {value:[assignedToString],cellProperties:{key:task.caseTaskId + "taskAssignedTo"}}]} 
        });

    return (
        <Box sx={{p:2, width:'100%', display:'flex', justifyContent:'center'}}>
            <Box sx={{ position:'relative', width:'100%', height:'100%', display: 'flex', flexDirection:'row' }}>
                <Paper elevation={5} sx={{display:'flex', flexDirection:'column', justifyContent:'space-between', width:'300px',p:1,m:1}}>
                    {searchText}{userSelect}{rolesSelect}     
                    <Button variant="contained" color="primary" onClick={()=>searchTasksFn({caseId:activeCase.id, searchString:currentTabData.searchText, assignedToIds:currentTabData.assignedTo,statusIds:currentTabData.status})}>Search</Button>       
                </Paper>
                <Paper elevation={5} sx={{position:'relative', display:'flex', width:'100%', overflow:'auto', p:0,m:1}}>
                    {
                            <Grid  columnHeadings={["Task #","Title", "Status","Due Date/Time","Assigned To"]}
                                columnType={[TEXT, TEXT, DATE_TIME, TEXT]}
                                rowValues={rowValues}
                                isFetching={searchTasksQueryResults.isFetching}
                            />
                    }
                </Paper>
            </Box>
        </Box>
    );
}