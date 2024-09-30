import React from 'react';
import Box from '@mui/material/Box';

export default function TabWrapper(props)
{
    return (    
        <Box sx={{ flexGrow: 0, display: 'flex', pb:2 }}>
            {props.children}
        </Box>
    );
}