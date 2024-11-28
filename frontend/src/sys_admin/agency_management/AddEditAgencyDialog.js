/**
 *      Component used to add/edit organizations
 * 
 */
/////////// React imports //////////
import React, { useEffect, useState } from 'react';
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
import { clearErrors, validate } from '../../validation/validation';
import { useStoreAgencyMutation } from '../../api/AgencyApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { handleMutationResults } from '../../api/ApiUtils';

const newAgency = { 
    id: undefined,
    name: '',
    acronym: ''
};

const fields = [
    {   name: 'id', label: 'id', type: 'hidden', required: false, },
    {   name: 'name', label: 'Name', type: TEXT, maxLength: 255, required: true, },
    {   name: 'acronym', label: 'Abbreviation', type: TEXT, width: 12, maxLength:5, required: true, }
];

const messageKey = "ADD_EDIT_ORG_DIALOG";

export default function AddEditAgencyDialog({ agency = {...newAgency, modified:false}, closeFn }) 
{
    const theme = useTheme();  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [agencyData, setAgencyData] = useState(agency);

    useEffect(() => {
        return ()=>clearErrors(fields);
    }, [agency]);

    const [storeAgency, mutationState] = useStoreAgencyMutation();
    handleMutationResults(mutationState, 
                            dispatch, 
                            // navigate,  
                            // true, 
                            // (agencyData.id?"Updating":"Creating") + " agency - " + agencyData.name,
                            // "Error " + agencyData.id?"updating":"creating" + " agency", 
                            ()=>{ enqueueSnackbar((agencyData.id?"Updated":"Created") + " agency: " + agencyData.name, {variant:'success'}); closeFn();},
                            ()=>{ } );

    fields.forEach((field, index) => {
        field.onChange=(event) => setAgencyData(prevData => ({...prevData, [field.name]:event.target.value, modified:true}));
        field.value = agencyData[field.name];
        field.disabled = mutationState.isLoading;
    });
                              
    async function onSave()
    {
        if (!validate(fields))
            setAgencyData(prev=>({...prev}));
        else
        {
            // remove the modified property and save
            const {modified, ...tempAgencyData} = agencyData;
            storeAgency(tempAgencyData);
            //closeFn();
        }
    }

    return (
        <>
            <Dialog open={true} fullWidth={true} maxWidth={'sm'}>
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
                    <Button disabled={!agencyData.modified || mutationState.isLoading} onClick={() => onSave()}>Save</Button>
                    <Button disabled={mutationState.isLoading} onClick={() => closeFn()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
 