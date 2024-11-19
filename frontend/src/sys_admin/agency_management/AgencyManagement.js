/**
 *      React component to display and allow editing of organizations
 */
/////////// React imports //////////
import React, { useState } from 'react';
/////////// Redux imports //////////
/////////// MUI imports //////////
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
/////////// Matrix2 imports //////////
import { TEXT } from '../../util/PropertyType';
import Grid from '../../util/Grid';
import Content from '../../util/Content';
import AddEditAgencyDialog from './AddEditAgencyDialog';
import { useTheme } from '@mui/material/styles';
import { useGetAllAgenciesQuery } from '../../api/AgencyApi';
import { handleQueryError } from '../../api/ApiUtils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/BaseApi';

const columnHeadings = ["Name", "Abbreviation"]
const columnTypes = [TEXT, TEXT];
// Key for setWaitMessage
const WAIT_KEY = "AGENCY_MANAGEMENT_WAIT_KEY";
// Key for message Box
const MESSAGE_BOX_KEY = "AGENCY_MANAGEMENT_MESSAGE_BOX_KEY";

const newAgency = { 
    id: undefined,
    name: '',
    acronym: ''
};

export default function AgencyManagement()
{
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [editAgency, setEditAgency] = useState(undefined);
    
    const { currentData:envelope, refetch, ...allAgencyQueryStatus } = useGetAllAgenciesQuery();
    const allAgencies = envelope?.payload;
    handleQueryError(allAgencyQueryStatus, dispatch, navigate);
    console.log(allAgencyQueryStatus);

    function successFn(updatedAgency)
    {
        setAgencies(prevAgencies=>[...prevAgencies].with(prevAgencies.findIndex((agency)=>agency.id===updatedAgency.id), updatedAgency));
    }

    // function optimisticAgencyUpdate(agencyData)
    // {
    //     dispatch(api.util.updateQueryData('getAllAgencies',
    //         taskId,
    //         (cache)=>{
    //             cache.payload = taskData;
    //             return cache;
    //         })); 
    //     setEditTaskData(undefined);
    // }

    function refresh()
    {
        dispatch(api.util.updateQueryData('getAllAgencies',
                    undefined,
                    (cache)=>{cache.payload = undefined;})); 
        refetch();
    }

    const agencyList = allAgencies && allAgencies.map((record) => 
                ({rowProperties: {id:record.id, onClick:()=>setEditAgency({...record})},
                    sx:{cursor:'pointer','&:hover':{backgroundColor:theme.palette.action.hover}},
                    values:[{value:[record.name]}, {value:[record.acronym]}]}));

    return (
        <>
            <Content>   
                <Box sx={{ position:'relative', width:'100%', maxHeight:'100%', display: 'flex', flexDirection:'column' }}>
                    <Box sx={{position:'relative',display:'flex', justifyContent:'space-between', padding:'5px', flexGrow:0}}>
                        <IconButton disabled={!allAgencies && allAgencyQueryStatus.isFetching} onClick={() => refresh()}><RefreshIcon/></IconButton>
                        <Button disabled={!allAgencies && allAgencyQueryStatus.isFetching} sx={{ m:0, p:0 }} onClick={() => setEditAgency({...newAgency})} >Add Organization</Button>
                    </Box>
                    <Grid columnHeadings={columnHeadings} columnTypes={columnTypes} rowValues={agencyList} isFetching={!allAgencies && allAgencyQueryStatus.isFetching}/>
                    { editAgency && <AddEditAgencyDialog agency={editAgency} successFn={successFn} closeFn={()=>setEditAgency(undefined)} />}
                </Box> 
            </Content>
        </>
    );
}