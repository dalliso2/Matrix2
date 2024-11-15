import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseTwoTone from "@mui/icons-material/CloseTwoTone";
import TabbedContentArea from "../util/TabbedContentArea";
import TabWrapper from "../util/TabWrapper";
import ContentWrapper from "../util/ContentWrapper";
import Content from "../util/Content";
import EntityTabContent from "./EntityTabContent";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EntitySearch from "./EntitySearch";
import AddEditEntityDialog from "./AddEditEntityDialog";
import SetActiveCaseDialog from "../case/SetActiveCaseDialog";
import { selectEntityTabData } from "../state/AppSlice";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";
import { setCurrentEntityTab, selectCurrentEntityTabIndex } from "../state/AppSlice";
import { removeEntityTab } from "../state/AppSlice";
import { useEffect } from "react";
import { handleQueryError } from "../api/ApiUtils";
import LoadingSkeleton from "../util/LoadingSkeleton";
import { useNavigate } from "react-router-dom";

function a11yProps(index)  
{
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

// function getTabTitle(entityObj, entityDefinitions) 
// {
//     //property ids of field that should be displayed in the tab title
//     const titlePropIds = entityDefinitions.find(def=>def.id === entityObj.entityDefinition).props.filter(prop=>prop.includeInTitle).map(prop=>prop.id);
//     return entityObj.propertyValues.filter(propVal=>titlePropIds.includes(propVal.propertyDefinition)).map(propVal=>propVal.value).join(", ");
// }

export default function EntityTabs()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showAddEditEntityDialog, setShowAddEditEntityDialog] = React.useState(false);

    const { data:envelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = envelope?envelope.payload:[];
    useEffect(() => {
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch, navigate);
    }, [entityDefinitionQueryStatus.isError]);

    const tabEntityData = useSelector(selectEntityTabData); 
    const currentTabIndex = useSelector(selectCurrentEntityTabIndex);

    // tabCaseObjs format - caseNumber, description, id, role, title
    const tabData = [{title:"Search"}].concat(tabEntityData);
    
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
                    <Box sx={{display:'flex', gap:1}}>{tabInfo.title} 
                    {
                        index > 0 &&
                        <IconButton color="inherit" size="small" 
                                    onClick={(event)=>{
                                        dispatch(removeEntityTab(tabInfo.entityId))
                                        event.stopPropagation()}} 
                                    onMouseDown={event=>event.stopPropagation()}
                                    sx={{p:0}}>
                            <CloseTwoTone color='inherit' fontSize='small'/>
                        </IconButton>
                    }
                    </Box>
                } 
                {...a11yProps(index)}/>
            )
          }
          </Tabs>
        </TabWrapper>
        <ContentWrapper>
            {
                <Content sx={{width:'100%', display:'flex', alignItems:'stretch'}}>                
                    {
                        currentTabIndex === 0?<EntitySearch/>
                            :entityDefinitionQueryStatus.isFetching?<LoadingSkeleton/>:<EntityTabContent entityId={tabData[currentTabIndex].entityId} />
                    }
                </Content>
            }
        </ContentWrapper> 
        {
            entityDefinitionQueryStatus.isFetching || entityDefinitionQueryStatus.isError?undefined:
            <Fab color="primary" aria-label="add" disabled={false}
                onClick={()=>{setShowAddEditEntityDialog(true)}} sx={{ position: 'fixed', bottom: 16, left: 90 }}>
                <AddIcon />
            </Fab>
        }
        {
            showAddEditEntityDialog && <AddEditEntityDialog entityDefinitions={entityDefinitions} closeFn={()=>setShowAddEditEntityDialog(false)}/>
        }
        <SetActiveCaseDialog/>
      </TabbedContentArea>
    );
}   