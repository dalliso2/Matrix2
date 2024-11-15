import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddEditTaskDialog from "./AddEditTaskDialog";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useGetTaskQuery } from "../api/TaskApi";
import { useGetCaseUsersQuery } from "../api/CaseApi";
import { useSelector } from "react-redux";
import { selectActiveCase } from "../state/AppSlice";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { handleQueryError } from "../api/ApiUtils";
import { useEffect } from "react";
import TaskEntities from "./TaskEntities";
import Paper from "@mui/material/Paper";
import { Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { api } from "../api/BaseApi";
import { useTheme } from "@mui/material/styles";
import TaskFiles from "./TaskFiles";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from "react-router-dom";

export const TaskStatus = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CLOSED", "DISCONTINUED"];

const dateFormat = 'M/D/YYYY HH:mm';
export const tableCellStyle = {display: 'table-cell', border:'none', p:0, verticalAlign:'top',};
export const tableCellBoldStyle ={...tableCellStyle, fontWeight:'bold', p:0, pr:1, verticalAlign:'top',};

export default function Task({taskId}) 
{
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [editTaskData, setEditTaskData] = useState();

    const activeCase = useSelector(selectActiveCase);

    //
    // load case users
    //
    const { data:currentCaseUsers, ...currentCaseUsersQueryStatus } = useGetCaseUsersQuery(activeCase.id);
    handleQueryResultsWithWaitMessage(currentCaseUsersQueryStatus, dispatch, navigate, "Loading case users...", ()=>{});

    const { refetch:refetchTaskData, data:taskEnvelope, ...getTaskQueryStatus } = useGetTaskQuery(taskId);
    const task = taskEnvelope?.payload;
    useEffect(() => {  
        if (getTaskQueryStatus.isError)
            handleQueryError(getTaskQueryStatus, dispatch, navigate);
    } ,[getTaskQueryStatus.isError]);

    function optimisticTaskUpdate(taskData)
    {
        dispatch(api.util.updateQueryData('getTask',
            taskId,
            (cache)=>{
                cache.payload = taskData;
                return cache;
            })); 
        setEditTaskData(undefined);
    }

    function addFiles()
    {   

    }

    const assignedTo = !!task && !!currentCaseUsers && currentCaseUsers.find(user=>user.userId===task.assignedTo);
    const assignedToString = assignedTo?(assignedTo.lastName + ", " + assignedTo.firstName) : "Unassigned";

    return (
        <>
        <Box sx={{display:'flex', flexDirection:'column', width:'100%', position:'relative', alignItems:'stretch'}}>      
            <Box sx={{flexGrow:1, display:'flex',  width:'100%', flexDirection:'column', overflow:'auto'}}>
                    <Box sx={{p:0,m:1}}>
                    <Paper>
                        <Box sx={{display:'flex',justifyContent:'flex-end',}}>
                            <IconButton onClick={() => refetchTaskData()}><RefreshIcon/></IconButton>
                            <IconButton onClick={()=>setEditTaskData({...task})}>
                                <EditTwoToneIcon/>
                            </IconButton>
                        </Box>
                        {task?
                        (
                        <>
                            <Box sx={{display:'flex', gap:'3px', justifyContent:'space-around'}}>
                                <Box sx={{ width:'100%', display:'flex'}}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{...tableCellBoldStyle, fontWeight:'bold'}}>Title:</TableCell>
                                                <TableCell style={{...tableCellStyle, width:'70%'}}>{task.title}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell rowSpan={4} style={{...tableCellBoldStyle, fontWeight:'bold'}}>Description:</TableCell>
                                                <TableCell rowSpan={4} style={{...tableCellStyle}}>{task.description}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{...tableCellBoldStyle, whiteSpace:'nowrap',fontWeight:'bold'}}>Assigned To:</TableCell>
                                                <TableCell  style={{...tableCellStyle, whiteSpace:'nowrap',width:'100%'}}>{assignedToString}</TableCell>
                                            </TableRow>   
                                            <TableRow>
                                                <TableCell style={{...tableCellBoldStyle, whiteSpace:'nowrap',fontWeight:'bold'}}>Assigned Date/Time:</TableCell>
                                                <TableCell  style={{...tableCellStyle, whiteSpace:'nowrap'}}>{task.assignedDateTime && dayjs(task.assignedDateTime).format(dateFormat)}</TableCell>
                                            </TableRow>   
                                            <TableRow>
                                                <TableCell style={{...tableCellBoldStyle, whiteSpace:'nowrap',fontWeight:'bold'}}>Due Date/Time:</TableCell>
                                                <TableCell  style={{...tableCellStyle, whiteSpace:'nowrap'}}>{task.dueDateTime && dayjs(task.dueDateTime).format(dateFormat)}</TableCell>
                                            </TableRow>   
                                            <TableRow>
                                                <TableCell style={{...tableCellBoldStyle, whiteSpace:'nowrap',fontWeight:'bold'}}>Status:</TableCell>
                                                <TableCell  style={{...tableCellStyle, whiteSpace:'nowrap'}}>{task.status && task.status.replaceAll('_',' ')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{...tableCellBoldStyle, whiteSpace:'nowrap',fontWeight:'bold'}}>Completed Date/Time:</TableCell>
                                                <TableCell  style={{...tableCellStyle, whiteSpace:'nowrap'}}>{task.completedDateTime && dayjs(task.completedDateTime).format(dateFormat)}</TableCell>
                                            </TableRow> 
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                            <Box sx={{p:1}}>
                                <Box sx={{width:'100%'}}><b>Results:</b></Box>
                                <Box sx={{minHeight:'100px', border:'1px solid black', borderRadius:'5px', p:1,m:1 }}>
                                    <Typography>{task.coverageDescription}</Typography>
                                </Box>
                            </Box>
                        </>
                        ):(<LoadingSkeleton/>)}
                    </Paper>
                    <Paper>
                        <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'space-around',m:2, mb:0}}>
                            <TaskEntities taskId={taskId}/>
                        </Box>
                    </Paper>
                    <Paper>
                        <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'space-around',m:2, mb:0}}>
                            <TaskFiles taskId={taskId}/>
                        </Box>
                    </Paper>
        { editTaskData && <AddEditTaskDialog successFn={(taskData)=>optimisticTaskUpdate(taskData)} 
                            closeFn={()=>setEditTaskData(undefined)} 
                            taskDataProps={editTaskData}/>}
                </Box>
            </Box>
        </Box>
        </>
    );
}