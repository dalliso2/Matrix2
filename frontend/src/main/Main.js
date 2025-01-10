import * as React from 'react';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import PermIdentityTwoToneIcon from '@mui/icons-material/PermIdentityTwoTone';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import ChecklistRtlTwoToneIcon from '@mui/icons-material/ChecklistRtlTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import ShareIcon from '@mui/icons-material/Share';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ViewTimelineTwoToneIcon from '@mui/icons-material/ViewTimelineTwoTone';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import UserAccountButton from '../user/UserAccountButton';
import AppBar from './AppBar';
import Drawer from './Drawer';
import MainMessageBox from '../util/MainMessageBox';
import CenteredCircularProgress from '../util/CenteredCircularProgress';
import UnexpectedError from './UnexpectedError';
import { useSelector } from 'react-redux';
import { selectSystemInErrorState } from '../state/AppSlice';
import { selectCurrentUser } from '../state/AppSlice';
import { selectActiveCase } from '../state/AppSlice';

const drawerWidth = 240;

const defaultLightTheme = createTheme({ palette: { mode: "light" }});
const defaultDarkTheme = createTheme({ palette: { mode: "dark" }});

const darkTheme = createTheme({ palette: { mode: "dark" }, 
                                typography: { fontSize: 12 },
                                components: {
                                    MuiTable: {
                                        styleOverrides: {   root: { padding:'0px 0px 0px 0px'},
                                                        },
                                    },
                                    MuiTableCell: {
                                        styleOverrides: {   root: { padding:'8px 16px 8px 16px'},
                                                             
                                                        },
                                    },
                                    MuiTableRow: {
                                        styleOverrides: {   root: { padding:'0px 0px 0px 0px'},
                                        },     
                                    },
                                },  
                            });

const lightTheme = createTheme({    palette: { mode: "light" }, 
                                    typography: { fontSize: 12 },
                                    components: {
                                        MuiTable: {
                                            styleOverrides: {   root: { padding:'0px 0px 0px 0px'},
                                                            },
                                        },
                                        MuiTableCell: {
                                            styleOverrides: {   root: { padding:'8px 16px 8px 16px'},
                                                                 
                                                            },
                                        },
                                        MuiTableRow: {
                                            styleOverrides: {   root: { padding:'0px 0px 0px 0px'},
                                            },     
                                        },
                                        MuiListItemButton: {
                                            styleOverrides: {   
                                                root: { 
                                                    '&.Mui-selected': {
                                                    }
                                                },

                                            },     
                                        },
                                },
                            });

const CURRENT_USER_MESSAGE_KEY = "CURRENT_USER_KEY";

export default function Main() 
{
    const navigate = useNavigate();
    const currentLocation = useLocation();
    const activeCase = useSelector(selectActiveCase);

    // application state
    const systemInErrorState = useSelector(selectSystemInErrorState);
    const currentUser = useSelector(selectCurrentUser);

    React.useEffect(() => {
        if (!currentUser)
            navigate('/login');
    }, [currentUser]);

    // local state
    const [open, setOpen] = useState(false); 

    var links = [];

    if (currentUser) 
    {
        //if (currentUser.isAdmin)
        if (currentUser)
            links = [
                { link: 'home', label: 'Home', icon: <HomeTwoToneIcon /> },
                { link: 'cases', label: 'Cases', icon: <FolderCopyIcon /> },
                { link: 'entities', label: 'Entities', icon: <GroupsTwoToneIcon /> },
                { link: 'tasks', label: 'Tasks', icon: <ChecklistRtlTwoToneIcon /> },
                { link: 'link_chart', label: 'Link Chart', icon: <ShareIcon /> },
                { link: 'timeline', label: 'Timeline', icon: <ViewTimelineTwoToneIcon /> },
                { link: 'systemadmin', label: 'System', icon: <AdminPanelSettingsTwoToneIcon /> }
            ];
        else
            links = [
                { link: 'home', label: 'Home', icon: <HomeTwoToneIcon /> },
                { link: 'entities', label: 'Entities', icon: <PermIdentityTwoToneIcon /> },
                { link: 'tasks', label: 'Map', icon: <ChecklistRtlTwoToneIcon /> },
            ];
    }

    const toggleDrawer = () => {
        setOpen(!open);
    };

    //const theme = (currentUser && currentUser.darkTheme) ? darkTheme : lightTheme;
    const theme =  currentUser?.darkTheme ? darkTheme : lightTheme;

    //console.log(currentLocation.pathname===link.link);
    //links.map(link=>console.log(link.link, link.link.includes(currentLocation.pathname)));
    
    return (
        <ThemeProvider theme={theme}>
            {systemInErrorState && <UnexpectedError/>}
                <Box sx={{ display: 'flex' }}>
                <AppBar theme={theme} position="absolute" open={open} sx={{}}>
                    <Box sx={{ display: 'flex', alignContent: 'center', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', }}>
                    </Box>
                    <Toolbar sx={{
                        pr: 3, /* keep right padding when drawer closed */ position: 'static',
                        display: 'flex', justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex' }}>
                            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}
                                sx={{ marginRight: '36px', ...(open), }}>
                                <MenuIcon />
                            </IconButton>
                            <Typography component="h1" variant="h6" color="inherit" noWrap
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, textAlign: 'center' }}>
                                <Box sx={{ }}>Matrix 2&nbsp;</Box><Box sx={{fontSize:'smaller'}}>{activeCase?"  - " + activeCase.title:"  - No active case"}</Box>
                            </Typography>
                        </Box>
                        <Box sx={{}}>
                            <UserAccountButton />
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={{
                    "& .MuiPaper-root": {
                      width: open ? drawerWidth : '56px',
                    }
                  }}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav" sx={{}}>
                        {
                            links.map((link, index) =>
                                <ListItemButton key={link.link} selected={currentLocation.pathname.includes(link.link)} onClick={() => navigate(link.link)} >
                                    <ListItemIcon>
                                        {link.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            )
                        }
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Toolbar sx={{ flexGrow: 0 }} />
                    <Box maxWidth="lg " sx={{ flexGrow: 1, overflow: 'hidden',}}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
            <MainMessageBox />
            <CenteredCircularProgress />
        </ThemeProvider>
    );
}
