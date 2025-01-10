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
import { selectActiveCase, } from "../state/AppSlice";
import { selectCurrentLinkChartTabIndex } from "../state/AppSlice";
import LinkChartsList from "./LinkChartsList";
import LinkChart from "./LinkChart";
import SetActiveCaseDialog from "../case/SetActiveCaseDialog";
import { setCurrentLinkChartTab, removeLinkChartTab } from "../state/AppSlice";
import { Box } from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import BinaryChoiceMessageBox from "../util/BinaryChoiceMessageBox";
import { selectLinkChartsTabData } from "../state/AppSlice";
import { addLinkChartTab } from "../state/AppSlice";

function a11yProps(index) 
{
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    }; 
  }

export default function LinkChartTabs()
{
    const dispatch = useDispatch();
    const activeCase = useSelector(selectActiveCase);
    const currentTabIndex = useSelector(selectCurrentLinkChartTabIndex);

    const [nextTab, setNextTab] = useState(-1);
    const [closeTabId, setCloseTabId] = useState(-1);

    const linkChartTabsData = useSelector(selectLinkChartsTabData);

    // reference to cytoscape instance
    const cyRef = useRef(undefined);
    // flag to indicate if the current tab has been modified
    const linkChartModifiedRef = useRef(false); 
    // reference to the function to save the current tab data
    // will be set by the LinkChart component
    const saveLinkChartFnRef = useRef(undefined);

    function onCloseTab(event, id)
    {
        event.preventDefault();
        event.stopPropagation();
        if (linkChartModifiedRef.current)
            setCloseTabId(id);
        else
            dispatch(removeLinkChartTab(id));
    }

    function onClickTab(index)
    {
        if (index < 1)
            saveTabChartData();

        if (linkChartModifiedRef.current)
        {   
            // setting the next tab will show the message box
            // asking if the user wants to save the current link chart
            setNextTab(index);
        }
        else    
            dispatch(setCurrentLinkChartTab(index));
    }

    // save the current zoom and pan of the cytoscape instance
    // so it can be restored when the tab is revisited
    function saveTabChartData()
    {
        const tabDataCopy = JSON.parse(JSON.stringify(linkChartTabsData[currentTabIndex-1]));
        tabDataCopy.zoom = cyRef.current.zoom();
        tabDataCopy.pan = {...cyRef.current.pan()};
        dispatch(addLinkChartTab(tabDataCopy));
    }

    function saveLinkChart()
    {
        saveTabChartData();
        linkChartModifiedRef.current=false;
        saveLinkChartFnRef.current();

        if (closeTabId >= 0)
            closeTab(closeTabId);
    }

    function closeTab(tabId)
    {
        dispatch(removeLinkChartTab(tabId));
        linkChartModifiedRef.current=false;
        if (nextTab >= 0)
        {
            dispatch(setCurrentLinkChartTab(nextTab));
            setNextTab(()=>-1);
        }     
        setCloseTabId(()=>-1);
    }

    function dontSaveLinkChart()
    {
        if (closeTabId >= 0)
        {
            setCloseTabId(-1);
            closeTab(closeTabId);
        }
    }

    // first tab is always the list of link charts
    const tabs = [{title: "Link Charts"}].concat(linkChartTabsData);
  
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
                { activeCase && (currentTabIndex===0?<Content><LinkChartsList/></Content>
                                        :<LinkChart cyRef={cyRef} linkChartModifiedRef={linkChartModifiedRef} 
                                                        linkChartTabData={tabs[currentTabIndex]}
                                                        saveTabChartData={saveTabChartData}
                                                        saveLinkChartFnRef={saveLinkChartFnRef} />)}
        </ContentWrapper> 
      </Box>
      <SetActiveCaseDialog/>
      { (nextTab >= 0 || closeTabId >= 0) && <BinaryChoiceMessageBox title="Save Link Chart" 
        message={"Do you want to save your changes to this link chart?"}
        onYes={saveLinkChart}
        onNo={dontSaveLinkChart}/>}
      </>
    );
}   