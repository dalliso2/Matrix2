import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import Box from '@mui/material/Box';
import { useGetLinkChartListForCaseQuery } from '../api/LinkChartApi';
import { handleQueryError } from '../api/ApiUtils';
import { TEXT } from '../util/PropertyType';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from '@mui/material/Button';
import Grid from '../util/Grid';
import AddEditLinkChartDialog from './AddEditLinkChartDialog';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { addLinkChartTab } from '../state/AppSlice';
import { useNavigate } from 'react-router-dom';

const columnHeadings = ["Name", "Description"];
const columnTypes = [TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'}];

export default function LinkChartsList()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const activeCase = useSelector(selectActiveCase);

    const [editLinkChart, setEditLinkChart] = useState();

    const { data:envelope, refetch:refetchLinkChartList, ...linkChartListQueryStatus } = useGetLinkChartListForCaseQuery(activeCase.id);
    const linkCharts = envelope?.payload;

    useEffect(() => {
        if (linkChartListQueryStatus.isError) 
            handleQueryError(linkChartListQueryStatus, dispatch, navigate);
    }, [linkChartListQueryStatus?.isError]);

    //
    // Save task-entity api function
    //
    // const [storeTaskEntity, storeTaskEntityMutationState] = useStoreTaskEntityMutation();
    // handleMutationResults(storeTaskEntityMutationState, dispatch, false, "","Error linking task and entity",
    //     ()=>enqueueSnackbar(storeTaskEntityMutationState.originalArgs.successDescription, {variant:'success'}),
    //     ()=>{});

    function closeDialog()
    {
        setEditLinkChart(undefined);
        refetchLinkChartList(activeCase.id);
    }

    function rowClickFn(chartData)
    {
        dispatch(addLinkChartTab({id: chartData.id, title: chartData.name, zoom: 1.0, pan: {x:0, y:0} }));
    }

    const rowValues = linkCharts && linkCharts.map((chart) => 
        ({rowProperties: {id:chart.id, onClick:()=>rowClickFn(chart)},
            sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
            values:[{value:[chart.name]}, {value:[chart.description]}]}));

    return (
        <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
            <Box sx={{position:'relative',display:'flex', justifyContent:'space-between', padding:'5px'}}>
                <IconButton onClick={() => refetchLinkChartList(activeCase.id)}><RefreshIcon/></IconButton>
                <Button onClick={()=>setEditLinkChart({id:undefined, matrixCase: activeCase.id, name:'', description:''})} 
                    sx={{ mr:1, alignSelf:'flex-end'}}>New Link Chart</Button>
            </Box>
            <Box sx={{flexGrow:1, position:'relative', display:'flex', overflow:'auto', p:0,m:1 }}>
                <Grid columnHeadings={columnHeadings} 
                        columnTypes={columnTypes} 
                        cellCss={cellCss} 
                        rowValues={rowValues} 
                        isFetching={linkChartListQueryStatus.isFetching}/>
                { editLinkChart && <AddEditLinkChartDialog linkChartObj={editLinkChart} closeFn={()=>closeDialog()}/> }
            </Box>
        </Box>
    );
}