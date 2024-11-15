import React from "react";
import { useDispatch } from "react-redux";
import Fab from "@mui/material/Fab";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseTwoTone from "@mui/icons-material/CloseTwoTone";
import Tabs from "@mui/material/Tabs";
import AddIcon from "@mui/icons-material/Add";
import TabbedContentArea from "../util/TabbedContentArea";
import TabWrapper from "../util/TabWrapper";
import ContentWrapper from "../util/ContentWrapper";
import AddEditTaskDialog from "./AddEditTaskDialog";
import TaskSearch from "./TaskSearch";
import Task from "./Task";
import SetActiveCaseDialog from "../case/SetActiveCaseDialog";
import { selectActiveCase, selectTabTaskData, selectCurrentTaskTabIndex } from "../state/AppSlice";
import { useSelector } from "react-redux";
import { TAB_TYPE_SEARCH } from "../state/AppSlice";
import { useState } from "react";
import { addTaskTab, removeTaskTab } from "../state/AppSlice";
import { setCurrentTaskTab } from "../state/AppSlice";
import { Box } from "@mui/material";
import Content from "../util/Content";

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export const taskProps = { 
    id:undefined,
    title: undefined, 
    description: undefined, 
    matrixCase: undefined, 
    assignedTo: undefined, 
    assignedDateTime: undefined, 
    dueDateTime: undefined, 
    completedDateTime: undefined, 
    status: undefined,
};

Object.freeze(taskProps);

export default function TaskTabs() 
{
    const dispatch = useDispatch();
    const [editTask, setEditTask] = useState(false);
    const activeCase = useSelector(selectActiveCase);
    const tabData = useSelector(selectTabTaskData);
    const tabIndex = useSelector(selectCurrentTaskTabIndex);
    const selectedTabData = tabData && tabData[tabIndex];

    function addTask(taskData)   
    {
        dispatch(addTaskTab({taskId:taskData.id, title: "Task " + taskData.caseTaskId + " - " + taskData.title}));
        setEditTask(undefined);
    }
    
    function onCloseTab(event, taskId)   
    {
        event.preventDefault();
        event.stopPropagation();
        dispatch(removeTaskTab(taskId));
    }
    
    return (
        <>
        {activeCase &&
        <TabbedContentArea>
            <TabWrapper>
                <Tabs
                    orientation="horizontal"
                    variant="scrollable"
                    scrollButtons={true}
                    value={tabIndex}
                    onChange={(event, value) => dispatch(setCurrentTaskTab(value))}
                    sx={{}}
                >
                    {
                        tabData && tabData.map((tabInfo, index) =>
                            <Tab key={index}
                                sx={{}}
                                label={
                                    <Box sx={{display:'flex', gap:1}}>{tabInfo.title} 
                                    {
                                        index > 0 &&
                                        <IconButton color="inherit" size="small" 
                                                        onClick={(event)=>onCloseTab(event, tabInfo.taskId)} 
                                                        onMouseDown={event=>event.stopPropagation()}
                                                        sx={{p:0}}>
                                            <CloseTwoTone color='inherit' fontSize='small'/>
                                        </IconButton>
                                    }
                                    </Box>
                                } 
                                {...a11yProps(index)} />
                        )
                    }
                </Tabs>
            </TabWrapper>
            <ContentWrapper>
                <Content sx={{width:'100%', display:'flex', alignItems:'stretch'}}>  
                {
                    selectedTabData && selectedTabData.tabType === TAB_TYPE_SEARCH?<TaskSearch tabDataId={selectedTabData.taskId}/> : <Task taskId={selectedTabData.taskId}/>
                }
                </Content>
            </ContentWrapper>
            
            <Fab color="primary" variant="extended" aria-label="add" disabled={!activeCase}
                        onClick={()=>setEditTask({...taskProps, matrixCase:activeCase.id})} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                <AddIcon />&nbsp;Add Task
            </Fab>

            { editTask && <AddEditTaskDialog successFn={addTask} closeFn={()=>setEditTask(undefined)} taskDataProps={{...taskProps, status:'NOT_STARTED'}}/>}

            
        </TabbedContentArea>
        }
        <SetActiveCaseDialog />
        </>
    );
}   