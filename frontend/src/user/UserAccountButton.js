import React, { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import Box from "@mui/system/Box";
import { Button } from "@mui/material";
import { useGetCurrentUserQuery, useSetUserDarkThemeMutation } from '../api/UserApi';
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useDispatch } from 'react-redux';
import { selectDarkTheme, setStateDarkTheme } from '../state/AppSlice';
import { useSelector } from "react-redux";
import { handleMutationResults } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";

export default function UserAccountButton()
{
    const dispatch = useDispatch();
    const [anchorElement, setAnchorElement] = useState(undefined);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

    const darkTheme = useSelector(selectDarkTheme);
    const { data:envelope, isSuccess, isError, isFetching } = useGetCurrentUserQuery();
    
    const [apiSetDarkTheme,mutationState] = useSetUserDarkThemeMutation();
    handleMutationResults(mutationState, 
                            dispatch, 
                            false, 
                            "",
                            "", 
                            ()=>{ enqueueSnackbar("Set theme to " + (darkTheme?"dark.":"light."), {variant:'success'});},
                            ()=>{ enqueueSnackbar("Failed to change theme.", {variant:'error'}); closeFn();});

    const currentUser = envelope?.payload;
    
    async function logout()
    {
        await fetch('/logout');
        window.location.href = '/';
    }

    function setDarkTheme(event)
    {
        dispatch(setStateDarkTheme(event.target.checked));
        apiSetDarkTheme(event.target.checked);
    }

    function changePassword()
    {
        setShowChangePasswordDialog(true);
        setAnchorElement(undefined);
    }

    return (
        <>
            <IconButton color="inherit" size="large" onClick={event=>setAnchorElement(event.currentTarget)} sx={{}}>
                <AccountCircle color='inherit' size='large' fontSize='large'/>
            </IconButton>
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
                    Dark Theme <Switch checked={currentUser && darkTheme} onChange={(event)=>setDarkTheme(event)}/>
                </Box>
            </Box>
            </Popover>
            { showChangePasswordDialog && <ChangePasswordDialog userId={currentUser?.id} closeDialogFn={()=>setShowChangePasswordDialog(false)}/> }
        </>
    );
}