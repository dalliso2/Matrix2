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
import { useNavigate } from "react-router-dom";
import { handleQueryError } from "../api/ApiUtils";

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
    const navigate = useNavigate();
    const [caseUsers, setCaseUsers] = useState([]);
    const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);

    //const { data:caseUsersQueryData, refetch, isFetching, isLoading, isError } = useGetCaseUsersQuery(caseObj.id);
    const { data:caseUsersQueryData, refetch, ...caseUsersQueryResults } = useGetCaseUsersQuery(caseObj.id);
    handleQueryError(caseUsersQueryResults, dispatch, navigate, ()=>{});

    useEffect(() => {
        if (caseUsersQueryData)
            setCaseUsers(caseUsersQueryData.map(user=>{return {...user}}));
    }, [caseUsersQueryData]);

    const [storeUserCaseRole,storeMutationState] = useStoreUserCaseRoleMutation();    
    handleMutationResults(storeMutationState, dispatch, navigate, false, "Updating user case role...", "Error updating user's role in the case.");
    const [deleteUserCaseRole,deleteMutationState] = useDeleteUserCaseRoleMutation();
    handleMutationResults(deleteMutationState, dispatch, navigate, false, "Deleting user case role...", "Error deleting user's role in the case.");

    async function updateUserAccess(userId, caseId, role)
    {
        if (role === REMOVE)
        {
            // update the component state
            setCaseUsers(oldCaseUsers=>oldCaseUsers.map(user=>{return {...user}}).filter(user=>user.userId !== userId));
            // send the mutation to the server
            deleteUserCaseRole({userId:userId, caseId:caseId, role:0});
        }
        else
        {
            // update the component state
            setCaseUsers(oldCaseUsers=>{
                const newCaseUsers = oldCaseUsers.map(user=>{return {...user}});
                newCaseUsers.find(user=>user.userId === userId).roleId = role;
                return newCaseUsers;});
            // send the mutation to the server
            storeUserCaseRole({userId:userId, caseId:caseId, role:role});
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
                                                onChange:event=>updateUserAccess(user.userId,user.caseId,event.target.value),
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
                    <IconButton onClick={() => refetch()}><RefreshIcon /></IconButton>
                    <Box>Case Users</Box>
                    <IconButton onClick={()=>setAddUsersDialogOpen(true)}><PersonAddAltTwoToneIcon/></IconButton>
                </Box>
                <Grid columnHeadings={['Username','Last Name','First Name','Picture','Role']} rowValues={userData} isFetching={caseUsersQueryResults.isFetching}/>
                { addUsersDialogOpen && <AddUsersToCaseDialog 
                                        caseUsers={caseUsers} 
                                        caseId={caseObj.id}
                                        closeDialogFn={()=>closeDialog()}/>}
            </Box>
        </Box>
    );
}