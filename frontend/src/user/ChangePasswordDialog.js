import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/system/Box";
import React, { useState } from "react";
import { PASSWORD } from "../util/PropertyType";
import { getInputComponent } from "../util/InputComponentFactory";
import { useUpdatePasswordMutation } from "../api/UserApi";
import { validate } from '../validation/validation';
import { useDispatch } from "react-redux";
import { handleMutationResults } from "../api/ApiUtils";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { setMessageBoxData } from "../state/AppSlice";

const fields = [
    { name: 'currentPassword', label: 'Current Password', type: PASSWORD, required: true, minLength: 8, value: '' },
    { name: 'newPassword', label: 'New Password', type: PASSWORD, required: true, minLength: 8, value: '' },
    { name: 'newPassword2', label: 'New Password (again)', type: PASSWORD, required: true, minLength: 8, value: '' },
];

const WAIT_MESSAGE_KEY = 'updating-password-wait';   
const MESSAGEBOX_KEY = 'updating-password-messagebox';   

const ChangePasswordDialog = ({ closeDialogFn }) =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({currentPassword:'', newPassword:'', newPassword2:''});

    const [updatePassword, mutationState] = useUpdatePasswordMutation();
    handleMutationResults(mutationState, dispatch,
        ()=>{   //dispatch(setMessageBoxData("password-updated", 'Password updated', 'Password updated'));
                closeDialogFn();
                enqueueSnackbar("Password updated", {variant:'success'});
            },
        undefined
    );
    
    async function updatePasswordFn()
    {
        if (!validate(fields))
            setPasswordData(old=>({...old}));
        else if ( passwordData.newPassword !== passwordData.newPassword2)
            dispatch(setMessageBoxData("password-dont-match-key", 'Error', 'New passwords do not match.'));
        else
            updatePassword(passwordData);
    }

    var allFieldsFilledOut = true;
    fields.forEach((field, index) => { 
        field.onChange = (event) => setPasswordData(old=>({...old, [field.name]:event.target.value}));
        field.value = passwordData[field.name]; 
        allFieldsFilledOut = allFieldsFilledOut && field.value
    });

    return (
        <>
        <Dialog open={true}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <form>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {fields.map((field, index) => getInputComponent(field, index))}
                </Box>
                </form>
            </DialogContent>
            <DialogActions>
                <Button disabled={!allFieldsFilledOut} onClick={() => updatePasswordFn()}>Submit</Button>
                <Button onClick={() => closeDialogFn()}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default ChangePasswordDialog;