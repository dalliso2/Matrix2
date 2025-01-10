import React from "react";
import { useDispatch } from "react-redux";
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
import { addCaseTab, selectCurrentCaseTabIndex, setCurrentCaseTab, removeCaseTab, selectCaseTabData } from "../state/AppSlice";
import AdminCaseList from "./AdminCaseList";
import { selectCurrentUser } from "../state/AppSlice";

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

    const currentUser = useSelector(selectCurrentUser);
    const currentTabIndex = useSelector(selectCurrentCaseTabIndex);
    // const { refetch, ...getUserCaseListResult } = useGetUserCaseListQuery();
    // const caseList = getUserCaseListResult?.data?.payload;
    // useEffect(() => {
    //     handleQueryResultsWithWaitMessage(getUserCaseListResult, dispatch);
    // }, [getUserCaseListResult?.isFetching]);

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

    const tabData = useSelector(selectCaseTabData);
    const tabs = [currentUser?.isAdmin ? {label: "Case Search", component: <AdminCaseList/>} :{label: "My Cases", component: <UserCaseList/>}]
                    .concat(
                        tabData?.map((caseObj, index) => 
                        { 
                            return {id: caseObj.id, label: caseObj.caseNumber, component: <CaseTabContent caseId={caseObj.id}/>}; 
                        })
                    || []);

    return (
        <>
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
                    <span>{tabInfo.label} 
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
      </>
    );
}   