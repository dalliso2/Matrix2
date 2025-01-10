import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import Box from '@mui/material/Box';
import { TEXT } from '../util/PropertyType';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from '@mui/material/Button';
import Grid from '../util/Grid';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useGetTimelineListForCaseQuery } from '../api/TimelineApi';
import AddEditTimelineDialog from './AddEditTimelineDialog';
import { addTimelineTab } from '../state/AppSlice';
import { useNavigate } from 'react-router-dom';
import { handleQueryResultsWithWaitMessage } from '../api/ApiUtils';

const columnHeadings = ["Name", "Description"];
const columnTypes = [TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'}];

export default function LinkChartsList()
{
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();
    const activeCase = useSelector(selectActiveCase);

    const [editTimeline, setEditTimeline] = useState();

    const { refetch:refetchTimelineList, ...timelineListQueryResults } = useGetTimelineListForCaseQuery(activeCase.id);
    const linkCharts = timelineListQueryResults?.data?.payload;

    useEffect(() => {
        handleQueryResultsWithWaitMessage(timelineListQueryResults, dispatch);
    }, [timelineListQueryResults?.isFetching]);

    function closeDialog()
    {
        setEditTimeline(undefined);
        refetchTimelineList(activeCase.id);
    }

    function rowClickFn(timelineData)
    {
        dispatch(addTimelineTab({id: timelineData.id, title: timelineData.name}));
    }

    const rowValues = linkCharts && linkCharts.map((timeline) => 
        ({rowProperties: {id:timeline.id, onClick:()=>rowClickFn(timeline)},
            sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
            values:[{value:[timeline.name]}, {value:[timeline.description]}]}));

    return (
        <Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
            <Box sx={{position:'relative',display:'flex', justifyContent:'space-between', padding:'5px'}}>
                <Tooltip title="Refresh Timeline List">
                    <IconButton onClick={() => refetchTimelineList(activeCase.id)}><RefreshIcon/></IconButton>
                </Tooltip>
                <Button onClick={()=>setEditTimeline({id:undefined, matrixCaseId: activeCase.id, name:'', description:''})} 
                    sx={{ mr:1, alignSelf:'flex-end'}}>New Timeline</Button>
            </Box>
            <Box sx={{flexGrow:1, position:'relative', display:'flex', overflow:'auto', p:0,m:1 }}>
                <Grid columnHeadings={columnHeadings} 
                        columnTypes={columnTypes} 
                        cellCss={cellCss} 
                        rowValues={rowValues} 
                        isFetching={timelineListQueryResults.isFetching}/>
                { editTimeline && <AddEditTimelineDialog timelineObj={editTimeline} closeFn={()=>closeDialog()}/> }
            </Box>
        </Box>
    );
}