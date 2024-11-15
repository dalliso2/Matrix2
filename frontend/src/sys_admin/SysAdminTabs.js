/**
 *    React component to display Admin tabs:
 *      Organization management
 *      User managment
 *      Entity designer    
 */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TabWrapper from '../util/TabWrapper';
import ContentWrapper from '../util/ContentWrapper';
import TabbedContentArea from '../util/TabbedContentArea';
import { selectCurrentSysAdminTab, setSysAdminTab } from '../state/AppSlice';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const tabData = [
    { name: 'Agency Mgmt', route: 'agency_management', }, 
    { name: 'User Mgmt', route: 'user_management'}, 
    { name: 'Entity Designer', route: 'entity_designer'}
];

const tabIndex = 0;

export default function AdminTabs() 
{
  const dispatch = useDispatch();
  const tabIndex = useSelector(selectCurrentSysAdminTab);
  const navigate = useNavigate();
  const location = useLocation();
  
    useEffect(() =>
    {
        // make sure the tab index matches the route for initial render
        const locationIndex = tabData.findIndex((tab) => location.pathname.endsWith(tab.route));
        if (locationIndex !== tabIndex)
        {
            navigate(tabData[tabIndex].route);
        }
    });

  return (
    <TabbedContentArea>
      <TabWrapper>
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          scrollButtons={true}
          value={tabIndex}
          onChange={(event,value) => dispatch(setSysAdminTab(value))}
          sx={{}}
        >
        {
          tabData.map((tabInfo, index) =>
            <Tab key={index} 
              sx={{}}
              label={tabInfo.name}
              {...a11yProps(index)}/>
          )
        }
        </Tabs>
      </TabWrapper>
      <ContentWrapper>
        <Outlet />
      </ContentWrapper> 
    </TabbedContentArea>
  );
}
