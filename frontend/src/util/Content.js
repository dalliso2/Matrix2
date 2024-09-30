import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";

export default function Content(props) 
{
    // return (
    //     <Box sx={{p:2, width:'100%', display:'flex', justifyContent:'center'}}>
    //         <Paper elevation={10} sx={{ p:2, minWidth:'50%', height:'100%', display:'flex', ...props.sx}}>
    //             <Box sx={{ position:'relative', width:'100%', maxHeight:'100%', display: 'flex', flexDirection:'column' }}>
    //                 {props.children}
    //             </Box>
    //         </Paper>
    //     </Box>  
    // );
    return (
        <Box sx={{p:2, width:'100%', height:'100%', display:'flex', justifyContent:'center'}}>
            <Fade in={true} timeout={300}>
                <Paper elevation={10} sx={{ p:2, minWidth:'75%', height:'100%', display:'flex', ...props.sx}}>
                    {props.children}
                </Paper>
            </Fade>        
        </Box>  
    );
}