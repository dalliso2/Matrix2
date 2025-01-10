import React, { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import Box from "@mui/system/Box";
import { Button, Tooltip } from "@mui/material";
import { useSetUserDarkThemeMutation } from '../api/UserApi';
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useDispatch } from 'react-redux';
import { selectCurrentUser } from '../state/AppSlice';
import { useSelector } from "react-redux";
import { handleMutationResults } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../state/AppSlice";
import { resetState } from "../state/AppSlice";
import { api } from "../api/BaseApi";

export default function UserAccountButton()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorElement, setAnchorElement] = useState(undefined);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

    const currentUser = useSelector(selectCurrentUser);  
    //const darkTheme = useSelector(selectDarkTheme);

    const [apiSetDarkTheme,mutationState] = useSetUserDarkThemeMutation();
    handleMutationResults(mutationState, 
                            dispatch, 
                            // navigate,
                            // false, 
                            // "",
                            // "", 
                            ()=>{ 
                                enqueueSnackbar("Set theme to " + ((currentUser?.darkTheme)?"dark.":"light."), {variant:'success'});
                            },
                            ()=>{ closeFn();});

    async function logout()
    {
        dispatch(api.util.resetApiState());
        dispatch(resetState());
        dispatch(setAuthToken(null));
    }

    function setDarkTheme(val)
    {
        //dispatch(setStateDarkTheme(event.target.checked));
        apiSetDarkTheme(val);
    }

    function changePassword()
    {
        setShowChangePasswordDialog(true);
        setAnchorElement(undefined);
    }

    return (
        <>
            <Tooltip title="Account settings">
                <IconButton color="inherit" size="large" onClick={event=>setAnchorElement(event.currentTarget)} sx={{}}>
                    <AccountCircle color='inherit' size='large' fontSize='large'/>
                </IconButton>
            </Tooltip>
            <Popover open={!!anchorElement} 
                    anchorEl={anchorElement}
                    onClose={()=>setAnchorElement(undefined)}
                    anchorOrigin={{vertical:'bottom',horizontal:'left'}}
                    sx={{}}
            >
            <Box sx={{p:2}}>
                <Box>
                    <Button onClick={()=>changePassword()} sx={{}}>Change password</Button>
                </Box>
                <Box>
                    <Button onClick={()=>logout()} sx={{}}>Logout</Button>
                </Box>
                <Box>
                    Dark Theme <Switch checked={currentUser?.darkTheme} onChange={(event)=>setDarkTheme(event.target.checked)}/>
                </Box>
            </Box>
            </Popover>
            { showChangePasswordDialog && <ChangePasswordDialog userId={currentUser?.id} closeDialogFn={()=>setShowChangePasswordDialog(false)}/> }
        </>
    );
}