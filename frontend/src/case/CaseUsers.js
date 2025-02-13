import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Grid from "../util/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import { CaseRoles, ADMIN } from "../util/utils";
import { getRoleText } from "../util/utils";
import { useTheme } from "@mui/material/styles";
import { PROFILE_IMAGE } from "../util/PropertyType";
import { getListComponent } from "../util/DisplayComponentFactory";
import { useGetCaseUsersQuery, useAddUserToCaseMutation, useRemoveUserFromCaseMutation } from "../api/CaseApi";
import AddUsersToCaseDialog from "./AddUsersToCaseDialog";
import { handleMutationResults } from "../api/ApiUtils";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { selectCurrentUser } from "../state/AppSlice";
import { useSelector } from "react-redux";
import { MenuItem, Select, Tooltip } from "@mui/material";
import { userCanModifyCase } from "../util/utils";

const REMOVE = -1;

// CaseUsers component
// This component stores the users assigned to a case in the local state.
// When an update occurs the state is optimistically updated, and the
// mutation is sent to the server.  If the mutation fails, the state is
// updated to reflect the server's state.
export default function CaseUsers({caseId})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const currentUserCanModifyCase = userCanModifyCase(currentUser, caseId);

    const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(undefined); // {message, variant}

    useEffect(()=> {
        snackbarMessage && enqueueSnackbar(snackbarMessage.message, {variant:snackbarMessage.variant});
    },[snackbarMessage]);

    const { refetch, ...caseUsersQueryResults } = useGetCaseUsersQuery(caseId);
    handleQueryResultsWithWaitMessage(caseUsersQueryResults, dispatch);
    useEffect(() => {
        handleQueryResultsWithWaitMessage(caseUsersQueryResults, dispatch);
    }, [caseUsersQueryResults?.isFetching]);
    const caseUsers = caseUsersQueryResults?.data?.payload;

    const [addUserToCase,addUserToCaseState] = useAddUserToCaseMutation();    
    handleMutationResults(addUserToCaseState, dispatch, 
        ()=>setSnackbarMessage({message:"Updated role of " + addUserToCaseState.originalArgs.username + " to " + addUserToCaseState.data.payload.caseRole, variant:'success'}),
        ()=>setSnackbarMessage({message:"Unable to update role of " + addUserToCaseState.originalArgs.username, variant:'error'}),
    );

    const [removeUserFromCase,removeUserFromCaseState] = useRemoveUserFromCaseMutation();
    handleMutationResults(removeUserFromCaseState, dispatch,        
        ()=>setSnackbarMessage({message:"Removed user " + removeUserFromCaseState.originalArgs.username + " from case.", variant:'success'}),
        ()=>setSnackbarMessage({message:"Unable to remove user "+ removeUserFromCaseState.originalArgs.username + " from case.", variant:'error'}),
    );

    async function updateUserAccess(userId, caseId, roleId, username)
    {
        if (roleId === REMOVE)
        {
            // send the mutation to the server
            removeUserFromCase({ucr:{userId:userId, caseId:caseId, roleId:0}, username});
        }
        else
        {
            // send the mutation to the server
            addUserToCase({ucr:{userId, caseId, roleId, username}, username});
        }            
    }
    
    const currentUserRole = caseUsers && caseUsers.find(user=>user.userId === currentUser.id)?.roleId;
    const canModifyRoles = currentUserRole === ADMIN || currentUser.isAdmin;
    const caseRoleSelectValues = [{id:REMOVE,name:'--Remove--'}]
                                    .concat(CaseRoles.filter(role=>role !== 'Admin')
                                        .map((role,index)=>{return {id:CaseRoles.indexOf(role),name:role}}));

    const userData = caseUsers && caseUsers.map(user=>{
                        return {rowProperties:{id:user.userId, key: user.userId, onClick:()=>{}}, 
                        sx:{},
                        values:[{value:[user.username],sx:{verticalAlign:'middle',p:0,pl:1}, cellProperties:{key:user.userId + "username"}},
                                {value:[user.lastName],sx:{verticalAlign:'middle',p:0,pl:1}, cellProperties:{key:user.userId + "lastName"}},
                                {value:[user.firstName],sx:{verticalAlign:'middle',p:0,pl:1}, cellProperties:{key:user.userId + "firstName"}},
                                {value:user.profileImageId>0 && [getListComponent(PROFILE_IMAGE, [user.profileImageId])], cellProperties:{key:user.userId + "profileImageId"}},
                                {value:(canModifyRoles && CaseRoles[user.roleId] !== 'Admin')? 
                                        <Select fullWidth={true} 
                                                size="small"
                                                labelId={user.id + '-role'} 
                                                value={user.roleId}  
                                                onChange={event=>updateUserAccess(user.userId,user.caseId,event.target.value, user.username)}
                                                sx={{p:0,m:0}}>
                                        {
                                            caseRoleSelectValues.map((role,index) =>
                                            (
                                                <MenuItem key={index} value={role.id}>
                                                    <span>{role.name}</span>
                                                </MenuItem>
                                            ))
                                        }
                                        </Select>
                                    : <Box sx={{p:1}}>{getRoleText(user.roleId)}</Box>,
                                    sx: !canModifyRoles ? {pt:0, pb:0}:{verticalAlign:'middle',p:0,pr:1}, cellProperties:{key:user.userId + "role"} }
                                ],
                };}); 

    function closeDialog()
    {   
        setAddUsersDialogOpen(false);
    }
    
    return (
        <Box sx={{width:'100%'}}>
            <Box sx={{display:'flex', flexDirection:'column', height:'100%', flexGrow:1}}>
                <Box sx={{display:'flex', justifyContent:'space-between'}}>
                    <Tooltip title="Refresh Case Users">
                        <span>
                        <IconButton disabled={caseUsersQueryResults.isFetching} onClick={() => refetch()}><RefreshIcon /></IconButton>
                        </span>
                    </Tooltip>
                    <Box>Case Users</Box>
                    <Tooltip title="Add Users to Case">
                        <span>
                        <IconButton disabled={caseUsersQueryResults.isFetching} 
                                    onClick={()=>setAddUsersDialogOpen(true)}
                                    sx={{visibility:currentUserCanModifyCase?'visible':'hidden'}}>
                            <PersonAddAltTwoToneIcon/>
                        </IconButton>
                        </span>
                    </Tooltip>
                </Box>
                <Grid columnHeadings={['Username','Last Name','First Name','Picture','Role']} 
                        rowValues={userData} 
                        isFetching={caseUsersQueryResults.isFetching}/>
                { addUsersDialogOpen && <AddUsersToCaseDialog 
                                        caseUsers={caseUsers} 
                                        caseId={caseId}
                                        closeDialogFn={()=>closeDialog()}/>}
            </Box>
        </Box>
    );
}