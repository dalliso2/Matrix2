import React from "react";
import { useDispatch } from "react-redux";
import TabWrapper from "../util/TabWrapper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ContentWrapper from "../util/ContentWrapper";
import Content from "../util/Content";
import IconButton from "@mui/material/IconButton";
import CloseTwoTone from "@mui/icons-material/CloseTwoTone";
import { useSelector } from "react-redux";
import { removeTimelineTab, selectActiveCase, selectTimelinesTabData, setCurrentTimelineTab, } from "../state/AppSlice";
import SetActiveCaseDialog from "../case/SetActiveCaseDialog";
import { selectCurrentTimelineTabIndex } from "../state/AppSlice";
import { Box } from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import BinaryChoiceMessageBox from "../util/BinaryChoiceMessageBox";
import TimelineList from "./TimelineList";
import Timeline from "./MatrixTimeline";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { addTimelineTab } from "../state/AppSlice";

function a11yProps(index) 
{
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    }; 
  }

export default function TimelineTabs()
{
    const dispatch = useDispatch();
    const activeCase = useSelector(selectActiveCase);
    const timelineTabsData = useSelector(selectTimelinesTabData);
    const currentTabIndex = useSelector(selectCurrentTimelineTabIndex);
    
    const [nextTab, setNextTab] = useState(-1);
    const [closeTabId, setCloseTabId] = useState(-1);

    const timelineRef = useRef(null);
    // flag to indicate if the current tab has been modified
    const timelineModifiedRef = useRef(false); 
    // reference to the function to save the current tab data
    // will be set by the Timelien component
    const saveTimelineFnRef = useRef(undefined);

    function onCloseTab(event, id)
    {
        event.preventDefault();
        event.stopPropagation();
        if (timelineModifiedRef.current)
            setCloseTabId(id);
        else
            dispatch(removeTimelineTab(id));
    }

    function onClickTab(index)
    {
        console.log(index);
        if (index < 1)
            saveTimelineData();

        if (timelineModifiedRef.current)
        {   
            // setting the next tab will show the message box
            // asking if the user wants to save the current timeline
            setNextTab(index);
        }
        else    
            dispatch(setCurrentTimelineTab(index));
    }

    // save the current zoom and pan of the timeline instance
    // so it can be restored when the tab is revisited
    function saveTimelineData()
    {
        if (timelineRef.current)
        {
            dispatch(addTimelineTab({id:tabs[currentTabIndex].id, 
                                        title:tabs[currentTabIndex].title, 
                                        start:timelineRef.current.range.start,
                                        end:timelineRef.current.range.end,
                                    }));
        }
    }

    function saveTimeline()
    {
        saveTimelineData();
        timelineModifiedRef.current=false;
        saveTimelineFnRef.current();
        if (closeTabId >= 0)
        {
            dispatch(removeTimelineTab(closeTabId));
            setCloseTabId(-1);
        }
        if (nextTab >= 0)
        {
            dispatch(setCurrentTimelineTab(nextTab));
            setNextTab(()=>-1);
        }
    }

    function dontSaveTimeline()
    {
        timelineModifiedRef.current=false;
        dispatch(setCurrentTimelineTab(nextTab));
        setNextTab(()=>-1);
    }

    // first tab is always the list of timelines
    const tabs = [{title: "Timelines"}].concat(timelineTabsData);
  
    return (
        <>
        <Box sx={{ display:'flex', flexDirection:'column', flexGrow:1, height:'100%'}}>
        <TabWrapper>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            scrollButtons={true}
            value={currentTabIndex}
            onChange={(event,index) => onClickTab(index)}
            sx={{}}
          >
          {
            tabs && tabs.map((tabInfo, index) =>
              <Tab key={index} 
                sx={{p:1}}
                label={ 
                    <span>{tabInfo.title} 
                    {
                        index > 0 &&
                        <IconButton color="inherit" size="small" 
                                    component="span"
                                    onClick={(event)=>onCloseTab(event,tabInfo.id)} 
                                    onMouseDown={event=>event.stopPropagation()}
                                    sx={{ml:1}}>
                            <CloseTwoTone color='inherit' fontSize='small'/>
                        </IconButton>
                    }
                    </span>
                } 
                {...a11yProps(index)}/>
            )
          }
          </Tabs>
        </TabWrapper>
        <ContentWrapper>
                { activeCase && (currentTabIndex===0?<Content><TimelineList/></Content>
                                        :(tabs[currentTabIndex]?.id)?
                                            <Timeline timelineTabData={tabs[currentTabIndex]}
                                                        timelineRef={timelineRef}
                                                />:<LoadingSkeleton/>)}
        </ContentWrapper> 
      </Box>
      <SetActiveCaseDialog/>
      { (nextTab >= 0 || closeTabId >= 0) && <BinaryChoiceMessageBox title="Save timeline" 
        message={"Do you want to save your changes to this timeline?"}
        onYes={saveTimeline}
        onNo={dontSaveTimeline}/>}
      </>
    );
}   