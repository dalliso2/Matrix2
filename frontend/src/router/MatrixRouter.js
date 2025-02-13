import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Main from '../main/Main';
import SysAdminTabs from '../sys_admin/SysAdminTabs';
import AgencyManagement from '../sys_admin/agency_management/AgencyManagement';
import UserManagement from '../sys_admin/user_management/UserManagement';
import EntityDesigner from '../sys_admin/entity_designer/EntityDesigner';
import CaseTabs from '../case/CaseTabs';
import EntityTabs from '../entity/EntityTabs';
import TaskTabs from '../task/TaskTabs';
import LinkChartTabs from '../link_chart/LinkChartTabs';
import TimelineTabs from '../timeline/TimelineTabs';
import Login from '../main/Login';

const router = createBrowserRouter([ 
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/",
        element: <Main />,
        children: [
            { path: "login", element: <Login/> },
//            { path: "home", element: <Home/> },
            { path: "cases", element: <CaseTabs/> },
            { path: "entities", element: <EntityTabs/> },
            { path: "tasks", element: <TaskTabs/> },    
            { path: "link_chart", element: <LinkChartTabs/>, },
            { path: "timeline", element: <TimelineTabs/> },
            { 
                path: "systemadmin", 
                element: <SysAdminTabs/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/systemadmin/agency_management" replace />,
                    },
                    { 
                        path: 'agency_management',
                        element: <AgencyManagement />
                    }, 
                    {
                         path: "user_management",
                         element: <UserManagement />
                    },
                    {
                        path: "entity_designer",
                        element: <EntityDesigner />
                   },
                ]
            }
        ]
    }
]);

export { router };
