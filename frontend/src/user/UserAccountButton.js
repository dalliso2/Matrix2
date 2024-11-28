import React, { useEffect, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import Box from "@mui/system/Box";
import { Button } from "@mui/material";
import { useSetUserDarkThemeMutation, useLazyRefreshCredentialsQuery } from '../api/UserApi';
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useDispatch } from 'react-redux';
import { selectCurrentUser, selectDarkTheme, setStateDarkTheme, setAuthToken, selectAuthToken, resetState } from '../state/AppSlice';
import { useSelector } from "react-redux";
import { handleMutationResults } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { handleQueryError } from "../api/ApiUtils";
import { api } from "../api/BaseApi";

export default function UserAccountButton()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorElement, setAnchorElement] = useState(undefined);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

    const currentUser = useSelector(selectCurrentUser);  
    const authToken = useSelector(selectAuthToken);
    const darkTheme = useSelector(selectDarkTheme);

    const [apiSetDarkTheme,mutationState] = useSetUserDarkThemeMutation();
    handleMutationResults(mutationState, 
                            dispatch, 
                            // navigate,
                            // false, 
                            // "",
                            // "", 
                            ()=>{ enqueueSnackbar("Set theme to " + (darkTheme?"dark.":"light."), {variant:'success'});},
                            ()=>{ closeFn();});

    const [refreshCredentials, { data:credentialsEnvelope, ...refreshCredentialsStatus }] = useLazyRefreshCredentialsQuery();
    const credentials = credentialsEnvelope?.payload;
    handleQueryError(refreshCredentialsStatus, 
                        dispatch, 
                        navigate,
                        ()=>{
                        });

    useEffect(() => {
        if (refreshCredentialsStatus?.isSuccess)
        {
            dispatch(setAuthToken(credentials.accessToken));
        }
    }, [refreshCredentialsStatus?.isFetching]);

    // refresh token every 10 minutes
    setTimeout(()=>refreshCredentials({token:authToken}), 10*60*1000);

    async function logout()
    {
        dispatch(api.util.resetApiState());
        dispatch(resetState());
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