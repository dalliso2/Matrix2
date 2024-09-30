import React from "react";
import Box from "@mui/material/Box";

export default function TabbedContentArea(props) 
{
    return (
        <Box sx={{ display:'flex', flexDirection:'column', flexGrow:1, height:'100%', ml:2, mr:2}}>
            {props.children}
        </Box>
    );
}