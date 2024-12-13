import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Grid from "../util/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import { getInputComponent } from "../util/InputComponentFactory";
import { SELECT } from "../util/PropertyType";
import { CaseRoles, OWNER } from "../util/utils";
import { getRoleText } from "../util/utils";
import { useTheme } from "@mui/material/styles";
import { PROFILE_IMAGE } from "../util/PropertyType";
import { getListComponent } from "../util/DisplayComponentFactory";
import { useGetCaseUsersQuery, useStoreUserCaseRoleMutation, useDeleteUserCaseRoleMutation } from "../api/CaseApi";
import AddUsersToCaseDialog from "./AddUsersToCaseDialog";
import { handleMutationResults } from "../api/ApiUtils";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect } from "react";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";

const REMOVE = -1;

// CaseUsers component
// This component stores the users assigned to a case in the local state.
// When an update occurs the state is optimistically updated, and the
// mutation is sent to the server.  If the mutation fails, the state is
// updated to reflect the server's state.
export default function CaseUsers({caseObj})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);

    const { refetch, ...caseUsersQueryResults } = useGetCaseUsersQuery(caseObj.id);
    handleQueryResultsWithWaitMessage(caseUsersQueryResults, dispatch);
    useEffect(() => {
        handleQueryResultsWithWaitMessage(caseUsersQueryResults, dispatch);
    }, [caseUsersQueryResults?.isFetching]);
    const caseUsers = caseUsersQueryResults?.data?.payload;

    const [storeUserCaseRole,storeMutationState] = useStoreUserCaseRoleMutation();    
    handleMutationResults(storeMutationState, dispatch, 
        ()=>enqueueSnackbar("Updated role of " + storeMutationState.originalArgs.username + " to " + storeMutationState.data.payload.caseRole, {variant:'success'}), 
        ()=>enqueueSnackbar("Unable to update role of " + storeMutationState.originalArgs.username, {variant:'error'})
    );

    const [deleteUserCaseRole,deleteMutationState] = useDeleteUserCaseRoleMutation();
    handleMutationResults(deleteMutationState, dispatch,        
        ()=>enqueueSnackbar("Removed user " + deleteMutationState.originalArgs.username + " from case.", {variant:'success'}), 
        ()=>enqueueSnackbar("Unable to remove user "+ deleteMutationState.originalArgs.username + " from case.", {variant:'error'})
    );

    async function updateUserAccess(userId, caseId, roleId, username)
    {
        if (roleId === REMOVE)
        {
            // send the mutation to the server
            deleteUserCaseRole({userId:userId, caseId:caseId, roleId:0, username});
        }
        else
        {
            // send the mutation to the server
            storeUserCaseRole({userId, caseId, roleId, username});
        }            
    }
    
    const userData = caseUsers && caseUsers.map(user=>{return {rowProperties:{id:user.id, onClick:()=>{}}, 
                        sx:{},
                        values:[{value:[user.username],sx:{verticalAlign:'middle',p:0,pl:1}},
                                {value:[user.lastName],sx:{verticalAlign:'middle',p:0,pl:1}},
                                {value:[user.firstName],sx:{verticalAlign:'middle',p:0,pl:1}},
                                {value:user.profileImageId>0 && [getListComponent(PROFILE_IMAGE, [user.profileImageId])]},
                                {value:(user.roleId === OWNER) ? getRoleText(user.roleId)
                                            : [getInputComponent({type:SELECT,
                                                value: user.roleId,
                                                name: 'role',
                                                onChange:event=>updateUserAccess(user.userId,user.caseId,event.target.value, user.username),
                                                selectData:[{id:REMOVE,name:'--Remove--'}].concat(CaseRoles.map((role,index)=>{return {id:index,name:role}}))
                                            })],
                                    sx: (user.roleId === OWNER) ? {pt:2, pb:2}:{verticalAlign:'middle',p:0,pr:1} } 
                        ]
                };}); 

    function closeDialog()
    {   
        setAddUsersDialogOpen(false);
    }
    
    return (
        <Box sx={{width:'100%'}}>
            <Box sx={{display:'flex', flexDirection:'column', height:'100%', flexGrow:1}}>
                <Box sx={{display:'flex', justifyContent:'space-between'}}>
                    <IconButton disabled={caseUsersQueryResults.isFetching} onClick={() => refetch()}><RefreshIcon /></IconButton>
                    <Box>Case Users</Box>
                    <IconButton disabled={caseUsersQueryResults.isFetching} onClick={()=>setAddUsersDialogOpen(true)}><PersonAddAltTwoToneIcon/></IconButton>
                </Box>
                <Grid columnHeadings={['Username','Last Name','First Name','Picture','Role']} rowValues={userData} isFetching={caseUsersQueryResults.isFetching}/>
                { addUsersDialogOpen && <AddUsersToCaseDialog 
                                        caseUsers={caseUsers} 
                                        caseObj={caseObj}
                                        closeDialogFn={()=>closeDialog()}/>}
            </Box>
        </Box>
    );
}