/**
 *      This component wraps an MUI linear progress component
 *      and displays the linear progress and the numeric
 *      value passed in
 * 
 */
import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LinearProgressWithLabel = ({value}) =>
{
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width:'400px' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>    
    );
}

export default LinearProgressWithLabel;