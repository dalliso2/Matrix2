/**
 *      React component to display and allow editing of organizations
 */
/////////// React imports //////////
import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { useGetAllAgenciesQuery } from '../../api/AgencyApi';
import { handleQueryResultsWithWaitMessage } from '../../api/ApiUtils';
import { Tooltip } from '@mui/material';

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
    const dispatch = useDispatch();
    const [editAgency, setEditAgency] = useState(undefined);
    
    // const [getAllAgencies, { refetch, ...allAgencyQueryResults }] = useLazyGetAllAgenciesQuery();
    const { refetch, ...allAgencyQueryResults } = useGetAllAgenciesQuery();
    const allAgencies = allAgencyQueryResults?.data?.payload;

    useEffect(() => {
        handleQueryResultsWithWaitMessage(allAgencyQueryResults, dispatch);
    }, [allAgencyQueryResults?.isFetching]);

    function successFn(updatedAgency)
    {
        setAgencies(prevAgencies=>[...prevAgencies].with(prevAgencies.findIndex((agency)=>agency.id===updatedAgency.id), updatedAgency));
    }

    const agencyList = allAgencies?.map((record) => 
                ({rowProperties: {id:record.id, onClick:()=>setEditAgency({...record})},
                    sx:{cursor:'pointer','&:hover':{backgroundColor:theme.palette.action.hover}},
                    values:[{value:[record.name]}, {value:[record.acronym]}]}));
                    
    return (
        <>
            <Content>   
                <Box sx={{ position:'relative', width:'100%', maxHeight:'100%', display: 'flex', flexDirection:'column' }}>
                    <Box sx={{position:'relative',display:'flex', justifyContent:'space-between', padding:'5px', flexGrow:0}}>
                        <Tooltip title="Refresh Agency List">
                            <IconButton disabled={allAgencyQueryResults.isFetching} onClick={() => refetch()}><RefreshIcon/></IconButton>
                        </Tooltip>    
                        <Button disabled={allAgencyQueryResults.isFetching} sx={{ m:0, p:0 }} onClick={() => setEditAgency({...newAgency})} >Add Organization</Button>
                    </Box>
                    <Grid columnHeadings={columnHeadings} columnTypes={columnTypes} rowValues={agencyList} isFetching={allAgencyQueryResults.isFetching}/>
                    { editAgency && <AddEditAgencyDialog agency={editAgency} successFn={successFn} closeFn={()=>setEditAgency(undefined)} />}
                </Box> 
            </Content>
        </>
    );
}