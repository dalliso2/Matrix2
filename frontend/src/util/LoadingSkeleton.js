import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useTheme } from "@emotion/react";

export default function LoadingSkeleton({sx}) 
{
    const theme = useTheme();
    return (
        <Fade in={true} timeout={2000} sx={{overflow:'hidden', height:'100%', width:'100%', ...sx}}>
            <Box sx={{ width:'100%' }}>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }}/>
            </Box>
    </Fade>
  );
}