import React from "react";
import Box from '@mui/material/Box';
import { useDispatch } from "react-redux";
import { clearAllMessages } from "../state/AppSlice";

export default function UnexpectedError() 
{
    const dispatch = useDispatch();
    dispatch(clearAllMessages());
    
    return (
        <Box sx={{height:'100%', width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <h1>Unexpected Error Occured</h1>
        </Box>    );
}