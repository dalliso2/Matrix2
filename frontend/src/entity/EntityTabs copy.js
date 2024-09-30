import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addEntityTab, selectCurrentEntityTab, selectTabEntityObjs, setCurrentEntityTab, removeEntityTab } from "../state/EntityTabsSlice";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseTwoTone from "@mui/icons-material/CloseTwoTone";
import TabbedContentArea from "../util/TabbedContentArea";
import TabWrapper from "../util/TabWrapper";
import ContentWrapper from "../util/ContentWrapper";
import Content from "../util/Content";
import EntitySearch from "./EntitySearch";
import EntityTabContent from "./EntityTabContent";
import { selectEntityDefinitionArray } from "../state/AppSlice";
import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddEditEntityDialog from "./AddEditEntityDialog";

function a11yProps(index) 
{
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

export default function EntityTabs()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
 
    const tabEntityObjs = useSelector(selectTabEntityObjs);
    const currentTabIndex = useSelector(selectCurrentEntityTab);
    const entityDefinitions = useSelector(selectEntityDefinitionArray);

    const [showAddEditEntityDialog, setShowAddEditEntityDialog] = useState(false);   

    function entityRowClickFn(entityObj)
    {
        const tabIndex = tabEntityObjs.findIndex((tabEntityObj) => tabEntityObj.id === entityObj.id);
        if (tabIndex >= 0)
            dispatch(setCurrentEntityTab(tabIndex + 1));// +1 to account for the "My Entitys" tab
        else
            dispatch(addEntityTab(entityObj));
    }

    function onCloseTab(event, entityId)
    {
        event.preventDefault();
        event.stopPropagation();
        dispatch(removeEntityTab(entityId));
    }

    function getTabTitle(entityObj) 
    {
        //property ids of field that should be displayed in the tab title
        const titlePropIds = entityDefinitions.find(def=>def.id === entityObj.entityDefinition).props.filter(prop=>prop.includeInTitle).map(prop=>prop.id);
        return entityObj.propertyValues.filter(propVal=>titlePropIds.includes(propVal.propertyDefinition)).map(propVal=>propVal.value).join(", ");
    }

    // tabCaseObjs format - caseNumber, description, id, role, title
    const tabData = [{title:"Search", component:<EntitySearch/>},]
            .concat(tabEntityObjs.map((entityObj, index) => 
                { return {id: entityObj.id, 
                            title: getTabTitle(entityObj), 
                            component: <EntityTabContent entityObj={entityObj}/>}; }));

    console.log("11111111111111111111111111");
    console.log(tabData); 
    return (
      <TabbedContentArea>
        <TabWrapper>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            scrollButtons={true}
            value={currentTabIndex}
            onChange={(event,value) => dispatch(setCurrentEntityTab(value))}
            sx={{}}
          >
          {
            tabData.map((tabInfo, index) =>
              <Tab key={index} 
                sx={{}}
                label={
                    <span>{tabInfo.title} 
                    {
                        index > 0 &&
                      <IconButton color="inherit" size="small" 
                                    onClick={(event)=>onCloseTab(event, tabInfo.id)} 
                                  onMouseDown={event=>event.stopPropagation()}
                                  sx={{p:0, pl:1,}}>
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
            <Content sx={{width:'100%', display:'flex', alignItems:'stretch'}}>
                { tabData[currentTabIndex].component }
            </Content>
        </ContentWrapper> 
        <Fab color="primary" aria-label="add" disabled={false}
        onClick={()=>{setShowAddEditEntityDialog(true)}} sx={{ position: 'fixed', bottom: 16, left: 90 }}><AddIcon /></Fab>
        {
            showAddEditEntityDialog && <AddEditEntityDialog closeFn={()=>setShowAddEditEntityDialog(false)}/>
        }
      </TabbedContentArea>
    );
}   