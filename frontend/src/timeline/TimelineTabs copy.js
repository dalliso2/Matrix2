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
import { useBlocker } from "react-router";
import LoadingSkeleton from "../util/LoadingSkeleton";

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

    // flag to indicate if the current tab has been modified
    const timelineModifiedRef = useRef(false); 
    // reference to the function to save the current tab data
    // will be set by the Timelien component
    const saveTimelineFnRef = useRef(undefined);

    useBlocker((tx) => {
        console.log("BLOCKER");
    });

    // // get all possible timeline entities for the active case
    // const [getAllTimelineEntities, {data:entityEnvelope, ...getAllTimelineEntitiesForCaseStatus}] = useLazyGetAllTimelineEntitiesForCaseQuery();
    // const timelineEntities = entityEnvelope?.payload;
    // useEffect(() => {
    //     if (activeCase?.id)
    //         getAllTimelineEntities(activeCase.id);
    // } ,[activeCase?.id]);

    // const {data:entityDefinitionEnvelope, ...getAllEntityDefinitionsForCaseStatus} = useGetAllEntityDefinitionsQuery();
    // const entityDefinitions = entityDefinitionEnvelope?.payload;

    // const [getTimelineData, {data:timelineEnvelope, ...getTimelineStatus}] = useLazyGetTimelineQuery();
    // const timelineData = timelineEnvelope?.payload;

    // useEffect(() => {
    //     if (timelineTabsData && currentTabIndex > 0)
    //     {
    //         // subtract 1 from current tab index because the first tab is the list of timelines
    //         getTimelineData(timelineTabsData[currentTabIndex-1].id);
    //     }
            
    // } ,[timelineTabsData, currentTabIndex]);

    // // check for query errors
    // useEffect(() => {  
    //     if (getAllTimelineEntitiesForCaseStatus.isError)
    //         handleQueryError(getAllTimelineEntitiesForCaseStatus, dispatch);
    //     if (getAllEntityDefinitionsForCaseStatus.isError)
    //         handleQueryError(getAllEntityDefinitionsForCaseStatus, dispatch);
    //     if (getTimelineStatus.isError)
    //         handleQueryError(getAllTimelineEntitiesForCaseStatus, dispatch);
    // } ,[getAllTimelineEntitiesForCaseStatus.isError, 
    //     getAllEntityDefinitionsForCaseStatus.isError,
    //     getTimelineStatus.isError]); 

    // //
    // // set up function to save the timeline
    // //
    // const [storeTimeline, timelineMutationState] = useStoreTimelineMutation();
    // handleMutationResults(timelineMutationState, 
    //                         dispatch, 
    //                         true, 
    //                         "Saving timeline...",
    //                         "Error saving timeline.", 
    //                         ()=>{
    //                                 timelineModifiedRef.current=false;
    //                                 enqueueSnackbar( "FIX THIS MESSAGE", {variant:'success'});
    //                         }
    //                     );

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

    // save the current zoom and pan of the cytoscape instance
    // so it can be restored when the tab is revisited
    function saveTimelineData()
    {
        // const tabDataCopy = JSON.parse(JSON.stringify(linkChartTabsData[currentTabIndex-1]));
        // tabDataCopy.zoom = cyRef.current.zoom();
        // tabDataCopy.pan = {...cyRef.current.pan()};
        // console.log(tabDataCopy);
        // dispatch(addLinkChartTab(tabDataCopy));
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
                                        :(timelineData && entityDefinitions)?<Timeline  
                                                    timelineId={tabs[currentTabIndex].id}
                                                    timelineData={timelineData}
                                                    entityDefinitions={entityDefinitions}
                                                    timelineModifiedRef={timelineModifiedRef}     
                                                    timelineTabData={tabs[currentTabIndex]}
                                                    timelineEntities={timelineEntities}
                                                />:<LoadingSkeleton/>)}
        </ContentWrapper> 
      </Box>
      <SetActiveCaseDialog/>
      { (nextTab >= 0 || closeTabId >= 0) && <BinaryChoiceMessageBox title="Save timeline" 
        message={"Do you want to save your changes to this link chart?"}
        onYes={saveTimeline}
        onNo={dontSaveTimeline}/>}
      </>
    );
}   