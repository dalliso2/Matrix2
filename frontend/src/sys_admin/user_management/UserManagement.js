/**
 *      Component to display list of system users
 */
/////////// React imports //////////
/////////// MUI imports //////////
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
/////////// redux imports //////////
/////////// Matrix2 imports //////////
import { TEXT } from "../../util/PropertyType";
import Content from "../../util/Content";
import TextField from '@mui/material/TextField';
import AddEditUserDialog from './AddEditUserDialog';
import UserDataGrid from './UserDataGrid';
import { useLazySearchUsersQuery } from '../../api/UserApi';
import { useSelector } from 'react-redux';
import { setUserSearchText, selectUserSearchText } from '../../state/AppSlice';
import { useNavigate } from 'react-router-dom';
import { handleQueryResultsWithWaitMessage } from '../../api/ApiUtils';

const columnHeadings = ["Username", "Last Name", "First Name", "Email", "Cell Number", "Work Number", "Agency", "Admin"]
const columnTypes = [TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT];

export default function UserManagement() 
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editUser, setEditUser] = useState(undefined);
    const filterString = useSelector(selectUserSearchText);

    const [searchUsersFn, searchUsersQueryResults] = useLazySearchUsersQuery({filter:filterString});
    const users = searchUsersQueryResults?.currentData?.payload;

    useEffect(() => {
        handleQueryResultsWithWaitMessage(searchUsersQueryResults, dispatch, "Searching Users...");
    }, [searchUsersQueryResults?.isFetching]);

    useEffect(() => {
        if (filterString.length)
            searchUsersFn(filterString);
    }, []);

    return (
        <Content sx={{width:'98%'}}>
            <Box sx={{ position:'relative', width:'100%', maxHeight:'100%', display: 'flex', flexDirection:'column' }}>
                <Box sx={{ position:'relative',display:'flex', justifyContent:'flex-end', padding:'5px', flexGrow:0}}>
                    <Button sx={{ mr:1, p:0, alignSelf:'flex-end'}} onClick={() => setEditUser({}) } >Add User</Button>
                    <Button sx={{ mr:1, p:0, alignSelf:'flex-end'}} disabled={!filterString.length} onClick={() => searchUsersFn(filterString) } >Search</Button>
                        <TextField label={"Search Users"} onChange={event=>dispatch(setUserSearchText(event.target.value))} fullWidth
                                    size="small" sx={{width:'40ch'}} value={filterString}/>                    
                    </Box><br></br>
                    <UserDataGrid users={users} onClickUser={setEditUser} isFetching={searchUsersQueryResults?.isFetching}/>
                    { editUser && <AddEditUserDialog user={editUser} closeFn={()=>setEditUser(undefined) } /> }
            </Box>
        </Content>
    );
}

