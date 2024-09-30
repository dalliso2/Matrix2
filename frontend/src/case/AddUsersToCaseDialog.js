/**
 *      Component to display list of system users
 */
/////////// React imports //////////
/////////// MUI imports //////////
import React, { useEffect } from 'react';
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
import { useStoreUserCaseRoleMutation } from "../api/CaseApi";
import { useDispatch } from "react-redux";
import { handleMutationResults, handleQueryResultsWithWaitMessage } from "../api/ApiUtils";

const columnHeadings = ["Username", "Last Name", "First Name", "Picture", "Role"]
const columnTypes = [TEXT,TEXT,TEXT,PROFILE_IMAGE,SELECT];

export default function AddUsersToCaseDialog({caseUsers, caseId, closeDialogFn }) 
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const [filterString, setFilterString] = React.useState('');
    const caseUserIds = caseUsers?caseUsers.map(user=>user.userId):[];
    
    const [storeUserCaseRole,storeMutationState] = useStoreUserCaseRoleMutation();    
    handleMutationResults(storeMutationState, dispatch, "Updating user case role...");

    const [searchUsersFn, searchResults] = useLazySearchUsersQuery();
    useEffect(() => {
        handleQueryResultsWithWaitMessage(searchResults, dispatch, "Searching users...");
    }, [searchResults.isSuccess, searchResults.isLoading, searchResults.isError]);

    const userData = searchResults.data && searchResults.data.filter(user=>!caseUserIds.includes(user.id))
                    .map(user=>{ return {rowProperties:{id:user.id, onClick:()=>{}}, 
                        sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                        values:[{value:[user.username],sx:{verticalAlign:'middle',p:0,pl:1}},
                                {value:[user.firstName],sx:{verticalAlign:'middle',p:0,pl:1}},
                                {value:[user.lastName],sx:{verticalAlign:'middle',p:0,pl:1}},
                                {value:user.profileImage?.id && [getListComponent(PROFILE_IMAGE, [user.profileImage?.id])]},
                                {value:[getInputComponent({type:SELECT,
                                                name: 'role',
                                                value: '',
                                                onChange:event=>storeUserCaseRole({userId:user.id,caseId:caseId,role:event.target.value}),
                                                selectData:CaseRoles.map((role,index)=>{return {id:index,name:role}})
                                            })],
                                    sx: {verticalAlign:'middle',p:0,pl:1,width:'20ch' } } 
                        ]
                };}); 
                
    return (
        <Dialog open={true} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>Add Users To Case</DialogTitle>
            <DialogContent>
                <Box sx={{display:'flex', flexDirection:'column', height:'400px'}}>
                    <Box sx={{ position:'relative',flexGrow:0, display:'flex', justifyContent:'flex-start', padding:'5px'}}>
                        <TextField label="Search" variant="outlined" size="small" onChange={(event)=>setFilterString(event.target.value)} />
                        <Button sx={{ pl:2, alignSelf:'flex-end'}} disabled={!filterString.length} onClick={() => searchUsersFn(filterString) } >Search Users</Button>
                    </Box>
                    <Grid   columnHeadings={columnHeadings} rowValues={userData}/>
                </Box>
            </DialogContent>
            <DialogActions><Button onClick={()=>closeDialogFn()}>Close</Button></DialogActions>
        </Dialog>
    );
}

