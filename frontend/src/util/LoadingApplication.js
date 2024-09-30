//  CenteredCircularProgress
//
//  This component covers the screen with to prevent user input, fades in a black
//  background with partial opacity and a circular spinner with a message.  It
//  is displayed/removed through the application state in MatrixAppSlice
//
import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import './LoadingApplication.css';
import { createTheme } from "@mui/material/styles";
import { useGetCurrentUserQuery } from "../api/UserApi";
import { useEffect } from "react";
import { handleQueryError } from "../api/ApiUtils";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

function LoadingApplication()
{
    const theme = createTheme({ palette: { mode: "dark" } });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data:envelope, ...getCurrentUserQueryStatus } = useGetCurrentUserQuery();
    console.log(getCurrentUserQueryStatus);

    useEffect(() => {
        if (getCurrentUserQueryStatus.isError) 
            handleQueryError(getCurrentUserQueryStatus, dispatch);
    }, [getCurrentUserQueryStatus.isError]);

    useEffect(() => {
        console.log("LoadingApplication.js");
        if (!getCurrentUserQueryStatus.isFetching) 
        {
            console.log("LoadingApplication.js: navigate to main");
            navigate("main");
        }
    }, [getCurrentUserQueryStatus.isFetching]);

    return ( 
        <React.Fragment>
            {
                theme && 
                <Box className="FullScreenCover">
                    <Box className=''> 
                        <Box className="FadeInBackground" />
                            <Box className="FadeInProgress">    
                                    <CircularProgress size={100}/>
                                    <Box sx={{ padding: '20px', color: theme.palette.common.white }}>
                                        Loading application
                                    </Box> 
                            </Box>
                    </Box>
                </Box>
            }
        </React.Fragment>
        ) 
};

export default LoadingApplication;

 