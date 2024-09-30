import React from 'react';
import { useEffect } from 'react';
import { useLazyGetLinkChartsForCaseQuery } from '../api/LinkChartApi';
import { handleQueryError } from '../api/ApiUtils';
import { List, ListItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import LoadingSkeleton from '../util/LoadingSkeleton';
import Box from '@mui/material/Box';

export default function LinkChartsList()
{
    const dispatch = useDispatch();
    const activeCase = useSelector(selectActiveCase);

    //
    // load all link carts
    //
    const [ getLinkChartsFn, {data:linkChartsEnvelope, ...linkChartsQueryStatus }] = useLazyGetLinkChartsForCaseQuery();
    useEffect(() => {
        if (linkChartsQueryStatus.isError) 
            handleQueryError(linkChartsQueryStatus, dispatch);
    }, [linkChartsQueryStatus.isError]);

    useEffect(() => {
        if (activeCase)
            getLinkChartsFn(activeCase.id);
    }, [activeCase]);   
    const linkCharts = linkChartsEnvelope?.payload || [];

    return (
        <Box>
            {
                linkChartsQueryStatus.isFetching?
                <LoadingSkeleton/>:
                <List sx={{width:'200px', height:'200px', overflow:'auto'}}>
                    {linkCharts.map((linkChart) => (
                        <ListItem key={linkChart.id}>{linkChart.name}</ListItem>    
                    ))}
                </List>
            }
        </Box>
    );
}