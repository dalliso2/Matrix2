/**
 *      Component to display list of system users
 */
/////////// React imports //////////
/////////// MUI imports //////////
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
/////////// redux imports //////////
/////////// Matrix2 imports //////////
import { TEXT, SELECT } from "../util/PropertyType";
import Grid from "../util/Grid";
import { getInputComponent } from "../util/InputComponentFactory";
import { CaseRoles } from "../util/utils";
import { useTheme } from '@mui/material/styles';
import { PROFILE_IMAGE } from "../util/PropertyType";
import { getListComponent } from "../util/DisplayComponentFactory";
import { useLazySearchUsersQuery } from "../api/UserApi";
import { useAddUserToCaseMutation } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { handleMutationResults, handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../state/AppSlice';

const columnHeadings = ["Username", "Last Name", "First Name", "Picture", "Role"]
const columnTypes = [TEXT,TEXT,TEXT,PROFILE_IMAGE,SELECT];

export default function AddUsersToCaseDialog({caseUsers, caseId, closeDialogFn }) 
{
    const theme = useTheme();
    const dispatch = useDispatch();
    
    const currentUser = useSelector(selectCurrentUser);

    const [filterString, setFilterString] = React.useState('');
    const caseUserIds = caseUsers?caseUsers.map(user=>user.userId):[];
    
    const [searchUsersFn, searchQueryResults] = useLazySearchUsersQuery();
    const searchResults = searchQueryResults?.data?.payload;
    useEffect(() => {
        handleQueryResultsWithWaitMessage(searchQueryResults, dispatch);
    }, [searchQueryResults?.isFetching]);
    
    const [addUserToCase,addUserToCaseState] = useAddUserToCaseMutation();  
    handleMutationResults(addUserToCaseState, dispatch, 
                            ()=>{ 
                                console.log(currentUser);
                                console.log(addUserToCaseState.originalArgs);
                                if (addUserToCaseState.originalArgs.userId === currentUser.id)
                                {
                                    const newAuthorities = [];
                                    switch(addUserToCaseState.originalArgs)
                                    {
                                        case 0: // admin
                                            newAuthorities.push("CASE_" + addUserToCaseState.originalArgs.caseId + "_ADMIN");
                                        case 1: // participant
                                            newAuthorities.push("CASE_" + addUserToCaseState.originalArgs.caseId + "_EDIT");
                                        case 2: // reviewer
                                            newAuthorities.push("CASE_" + addUserToCaseState.originalArgs.caseId + "_VIEW");
                                    }
                                    dispatch(updateCurrentUserCaseAuthority(newAuthorities));
                                }
                                enqueueSnackbar("Added " + addUserToCaseState.originalArgs.username + " to case as a " + addUserToCaseState.data.payload.caseRole + "." , {variant:'success'})
                            },
                            ()=>{ enqueueSnackbar("Failed to add " + addUserToCaseState.originalArgs.username + " to case." , {variant:'error'}); closeDialogFn();});

    const userData = searchResults && searchResults.filter(user=>!caseUserIds.includes(user.id))
                    .map(user=>({rowProperties:{id:user.id, key:"user_"+user.id, onClick:()=>{}}, 
                        sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                        values:[{value:[user.username],sx:{verticalAlign:'middle',p:0,pl:1}, cellProperties:{key:user.username + user.id}},
                                {value:[user.firstName],sx:{verticalAlign:'middle',p:0,pl:1}, cellProperties:{key:user.username + user.firstName}},
                                {value:[user.lastName],sx:{verticalAlign:'middle',p:0,pl:1}, cellProperties:{key:user.username + user.lastName}},
                                {value:user.profileImage && [getListComponent(PROFILE_IMAGE, [user.profileImage])], cellProperties:{key:user.username + "_" + user.profileImage + "_" + user.id}},
                                {value:[getInputComponent({type:SELECT,
                                                name: 'role',
                                                value: '',
                                                onChange:event=>addUserToCase({ucr:{userId:user.id,caseId:caseId,roleId:event.target.value}, username:user.username, filterString}),
                                                selectData:CaseRoles.map((role,index)=>{return {id:index,name:role}})
                                            })],
                                    sx: {verticalAlign:'middle',p:0,pl:1, pr:1,width:'20ch' }, cellProperties:{key:user.username + "_role"} } 
                        ]
                })); 
                
    return (
        <Dialog open={true} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>Add Users To Case</DialogTitle>
            <DialogContent>
                <Box sx={{display:'flex', flexDirection:'column', height:'400px'}}>
                    <Box sx={{ position:'relative',flexGrow:0, display:'flex', justifyContent:'flex-start', padding:'5px'}}>
                        <TextField label="Search" variant="outlined" size="small" onChange={(event)=>setFilterString(event.target.value)} />
                        <Button sx={{ pl:2, alignSelf:'flex-end'}} disabled={!filterString.length} onClick={() => searchUsersFn(filterString) } >Search Users</Button>
                    </Box>
                    <Grid columnHeadings={columnHeadings} rowValues={userData} isFetching={searchQueryResults.isFetching}/>
                </Box>
            </DialogContent>
            <DialogActions><Button onClick={()=>closeDialogFn()}>Close</Button></DialogActions>
        </Dialog>
    );
}

