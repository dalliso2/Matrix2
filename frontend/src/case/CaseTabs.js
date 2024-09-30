import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetUserCaseListQuery } from "../api/CaseApi";
import TabbedContentArea from "../util/TabbedContentArea";
import TabWrapper from "../util/TabWrapper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ContentWrapper from "../util/ContentWrapper";
import Content from "../util/Content";
import IconButton from "@mui/material/IconButton";
import CloseTwoTone from "@mui/icons-material/CloseTwoTone";
import UserCaseList from "./UserCaseList";
import CaseTabContent from "./CaseTabContent";
import { useSelector } from "react-redux";
import { addCaseTab, selectCurrentCaseTabIndex, setCurrentCaseTab, removeCaseTab, selectCaseTabCaseIds } from "../state/AppSlice";
import { setMessageBoxData } from "../state/AppSlice";

function a11yProps(index) 
{
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    }; 
  }

export default function CaseTabs()
{
    const dispatch = useDispatch();
    const location = useLocation();
 
    const currentTabIndex = useSelector(selectCurrentCaseTabIndex);
    const { data:envelope, refetch, isFetching, isError, isSuccess } = useGetUserCaseListQuery();

    const caseList = envelope?.payload;
    useEffect(() => { 
        if (isError) 
            dispatch(setMessageBoxData("CaseTabs", "Error", "An error occurred while retrieving case list")); 
    }, [isError]);

    function addTab(caseInfo)
    {
        dispatch(addCaseTab(caseInfo.id));
    }

    function onCloseTab(event, caseId)
    {
        event.preventDefault();
        event.stopPropagation();
        dispatch(removeCaseTab(caseId));
    }

    const tabData = useSelector(selectCaseTabCaseIds);
    const tabs = [{title: "My Cases", component: <UserCaseList caseList={isFetching?undefined:caseList} refetchFn={refetch} rowClickFn={addTab}/>}]
                    .concat(
                        tabData?.map((caseId, index) => 
                        { 
                            const caseObj = caseList.find(caseObj => caseObj.id === caseId);
                            return {id: caseObj.id, title: caseObj.caseNumber, component: <CaseTabContent caseObj={caseObj}/>}; 
                        })
                    || []);

    return (
        <TabbedContentArea>
        <TabWrapper>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            scrollButtons={true}
            value={currentTabIndex}
            onChange={(event,value) => dispatch(setCurrentCaseTab(value))}
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
                                    onClick={(event)=>onCloseTab(event, tabInfo.id)} 
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
            <Content>
                { tabs[currentTabIndex].component }
            </Content>
        </ContentWrapper> 
      </TabbedContentArea>
    );
}   