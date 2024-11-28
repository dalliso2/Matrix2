import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { getInputComponent } from '../../util/InputComponentFactory';
import './AddEditUserDialog.css';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { CHECKBOX, PASSWORD, TEXT, PROFILE_IMAGE, SELECT } from '../../util/PropertyType';
import { useGetAllAgenciesQuery } from '../../api/AgencyApi';
import { useStoreUserMutation } from '../../api/UserApi';
import { handleMutationResults, handleQueryResultsWithWaitMessage } from '../../api/ApiUtils';
import { validate } from '../../validation/validation';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../state/AppSlice';
import { useSelector } from 'react-redux';
import { setCurrentUser } from '../../state/AppSlice';

const EMPTY_PASSWORD = "        ";

const fields = [
        {   name: 'id', value:undefined },
        {   name: 'username',label: 'Username', type: TEXT, disabled: false, required: true, minLength: 5, onChange: (event) => change(event) },
        {   name: 'password', label: 'Password', type: PASSWORD, required: true, minLength: 8, onKeyDown: (event)=> handleOnKeyDownPassword(event), onChange: (event) => change(event) },
        {   name: 'lastName', label: 'Last Name', type: TEXT, required: true, onChange: (event) => change(event) },
        {   name: 'firstName', label: 'First Name', type: TEXT, required: true, onChange: (event) => change(event) },
        {   name: 'email', label: 'Email', type: TEXT, required: true, onChange: (event) => change(event) },
        {   name: 'workNumber', label: 'Work Number', type: TEXT, required: true, mask:"(999) 999-9999", onChange: (event) => change(event) },
        {   name: 'cellNumber', label: 'Cell Number', type: TEXT, required: true, mask:"(999) 999-9999", onChange: (event) => change(event) },
        {   name: 'agency', label: 'Agency', type: SELECT, required: true, selectData: [], value:null, required: true, onChange: (event) => change(event) },
        {   name: 'isAdmin', value:false, label: 'Admin', type: CHECKBOX, onChange: (event) => change(event) },
        {   name: 'enabled', value: true, label: 'Enabled', type: CHECKBOX,  onChange: (event) => change(event) },
        {   name: 'darkTheme', value: true, label: 'Dark Theme', type: CHECKBOX,  onChange: (event) => change(event) },
        {   name: 'profileImage', label: 'Profile Image', caseId: '', type: PROFILE_IMAGE, },
    ];

const AddEditUserDialog = ({ user, closeFn }) => 
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const [userData, setUserData] = useState({...user, modified:false});

    const { data:envelope, ...allAgenciesQueryStatus } = useGetAllAgenciesQuery();
    useEffect(() => {
        handleQueryResultsWithWaitMessage(allAgenciesQueryStatus, dispatch, navigate, "Loading agencies...");
    }, [allAgenciesQueryStatus.isSuccess, allAgenciesQueryStatus.isFetching, allAgenciesQueryStatus.isError]);
    const allAgencies = envelope?.payload;

    const [storeUser,mutationState] = useStoreUserMutation();
    handleMutationResults(mutationState, dispatch,
                            ()=>{
                                const updatedUserData = mutationState.data.payload;
                                if (updatedUserData.id === currentUser.id)
                                    dispatch(setCurrentUser(updatedUserData));
                                enqueueSnackbar((userData.id?"Updated":"Created") + " user: " + userData.username, {variant:'success'}); closeFn(); 
                            },
                            ()=>{ closeFn(); });

console.log("userData",userData);

    function change(event)
    {
        const value = event.target.type==="checkbox"?event.target.checked:event.target.value;
        setUserData(prev=>{return {...prev, [event.target.name]: value, modified:true}});
    }

    function onSave()
    {
        let validateFields = fields;
        if (validateFields.find(field => field.type === PASSWORD)?.value === EMPTY_PASSWORD)
            validateFields = validateFields.filter(field => field.type != PASSWORD);

        if (!validate(validateFields))
            setUserData(prev=>({...prev}));
        else
        {
            const {modified, ...tempUserData} = userData;
            storeUser(tempUserData);
        }
    }

    userData && fields.forEach(field =>{
        field.value = userData[field.name];
        field.onChange = (event) => change(event);
        switch(field.name)
        {
            case 'username':
                field.disabled = !!userData.id;
                break;
            case 'profileImage':
                field.onChange = id=>{console.log("id",id);setUserData(prev=>({...prev, profileImage:id, modified:true}));};
                break;
            case 'password':
                field.onKeyDown = id=>(event) => 
                    (event.target.value === EMPTY_PASSWORD) && setUserData(prev=>{return {...prev, password:''}});
                break;
            case 'agency':
                field.selectData = allAgencies && [{id:undefined, name:undefined}].concat(allAgencies.map(agency=>({id:agency.id, name:agency.name})));
                // if (!field.value)
                //     field.value = allAgencies?.length && allAgencies[0].id;
                break;
        }
    });

    const nonImageFields = fields.filter(field => field.type != 'PROFILE_IMAGE');
    console.log("userData",userData);
    return (
        <div>
        <Dialog open={true} fullWidth maxWidth='md'>
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Add/Edit User</DialogTitle>
            <DialogContent sx={{mt:2}}>
                <Box className="toplayoutbox">
                    <Box className="textfieldbox">
                        <Box className="textfieldcolumn">
                        {
                            nonImageFields.slice(1,6).map((field, index) => 
                            (
                                <Box key={index} sx={{ width: 260, paddingBottom: 1.5 }}>
                                { getInputComponent(field, index) }
                                </Box>
                            ))
                        }
                        </Box>
                        <Box sx={{width: "15px"}} />
                        <Box className="textfieldcolumn">
                        {
                            nonImageFields.slice(6,12).map((field, index) => 
                            (
                                <Box key={index} sx={{ width: 260, paddingBottom: 1.5 }}>
                                    { getInputComponent(field, index, dispatch) }
                                </Box>
                            ))
                        }
                        </Box>
                        <Box sx={{width: "15px"}} />
                        <Box className="profileimagebox">
                            {
                                getInputComponent(fields[12], 13, dispatch)
                            }
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions> 
                <Button disabled={!userData.modified} onClick={() => onSave()}>Save</Button>
                <Button onClick={() => closeFn()}>Cancel</Button>
            </DialogActions>
        </Dialog>
      </div>
    );
}
 
export default AddEditUserDialog;