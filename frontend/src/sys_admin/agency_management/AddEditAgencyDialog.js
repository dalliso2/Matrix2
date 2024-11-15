/**
 *      Component used to add/edit organizations
 * 
 */
/////////// React imports //////////
import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
/////////// MUI imports //////////
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
/////////// notistack (snackbar) imports //////////
/////////// App imports //////////
//import './AddEditOrgDialog.css';
import { TEXT } from '../../util/PropertyType';
import { getInputComponent } from '../../util/InputComponentFactory';
import { validate } from '../../validation/validation';
import { useStoreAgencyMutation } from '../../api/AgencyApi';
import { useDispatch } from 'react-redux';
import { handleMutationResults } from '../../api/ApiUtils';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const newAgency = { 
    id: undefined,
    name: '',
    acronym: ''
};

const fields = [
    {   name: 'id', label: 'id', type: 'hidden', required: false, },
    {   name: 'name', label: 'Name', type: TEXT, maxLength: 40, required: true, },
    {   name: 'acronym', label: 'Abbreviation', type: TEXT, maxLength:10, required: true, }
];

const messageKey = "ADD_EDIT_ORG_DIALOG";

export default function AddEditAgencyDialog({ agency = {...newAgency, modified:false}, closeFn }) 
{
    const theme = useTheme();  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [agencyData, setAgencyData] = useState(agency);

    fields.forEach((field, index) => {
        field.onChange=(event) => setAgencyData(prevData => ({...prevData, [field.name]:event.target.value, modified:true}));
        field.value = agencyData[field.name];
    });

    const [storeAgency,mutationState] = useStoreAgencyMutation();
    handleMutationResults(mutationState, dispatch, navigate, true, "Creating/updating agency...",
                            "Error creating/updating agency", 
                            ()=>{ enqueueSnackbar("Created/updated agency: " + agency.name, {variant:'success'}); closeFn();});

    async function onSave()
    {
        if (!validate(fields))
            setAgencyData(prev=>({...prev}));
        else
        {
            // remove the modified property and save
            const {modified, ...tempAgencyData} = agencyData;
            storeAgency(tempAgencyData);
        }
    }

    return (
        <>
            <Button  sx={{ m:0, p:0 }} onClick={() => openDialogFunction( undefined)} >Add Agency</Button>
            <Dialog open={true}>
                <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>Add/Edit Agency</DialogTitle>
                <DialogContent sx={{mt:2}}>
                {
                    fields.map((field, index) => 
                    (
                        <Box key={index}>
                            {getInputComponent(field, index)}
                        </Box>
                    ))
                }
                </DialogContent>
                <DialogActions> 
                    <Button disabled={!agencyData.modified} onClick={() => onSave()}>Save</Button>
                    <Button onClick={() => closeFn()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
 