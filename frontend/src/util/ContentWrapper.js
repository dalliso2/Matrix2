import React from "react";
import Box from "@mui/material/Box";

export default function ContentWrapper(props) 
{
    return (
        <Box  sx={{ display: "flex", flexGrow: 1 , justifyContent: 'center', height:'1px', width:'100%'}}>
            {props.children}
        </Box>
    );
}