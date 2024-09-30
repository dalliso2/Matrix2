//  CenteredCircularProgress
//
//  This component covers the screen with to prevent user input, fades in a black
//  background with partial opacity and a circular spinner with a message.  It
//  is displayed/removed through the application state in MatrixAppSlice
//
import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { selectGetWaitMessage } from "../state/AppSlice";
import './CenteredCircularProgress.css';
import { useTheme } from "@emotion/react";

function CenteredCircularProgress()
{
    const theme = useTheme();
    const waitMessage = useSelector(selectGetWaitMessage);
    
    return ( 
        <React.Fragment>
        {
            waitMessage?
            (
                <Box className="FullScreenCover">
                    <Box className=''> 
                        <Box className="FadeInBackground" />
                            <Box className="FadeInProgress">    
                                    <CircularProgress size={100}/>
                                    <Box sx={{ padding: '20px', color: theme.palette.common.white }}>
                                        {waitMessage}
                                    </Box> 
                            </Box>
                    </Box>
                </Box>
            ):undefined
        }
        </React.Fragment>
        ) 
};

export default CenteredCircularProgress;

 