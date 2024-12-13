import React from "react";
import Box from "@mui/material/Box";
import { createTheme, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useLazyLoginQuery } from "../api/UserApi";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetState, setAuthToken, setCurrentUser, selectAuthToken, setWaitMessage, removeWaitMessage } from "../state/AppSlice";
import { useSelector } from "react-redux";
import { api } from "../api/BaseApi";
import CenteredCircularProgress from "../util/CenteredCircularProgress";
import { ThemeProvider } from "@emotion/react";
import MainMessageBox from "../util/MainMessageBox";

export default function Login() 
{   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('admin');
    const [password, setPassword] = React.useState('password');
    const [error, setError] = React.useState(undefined);

    // useEffect below will navigate to the home page when authToken is set
    const authToken = useSelector(selectAuthToken);

    // make sure the app state is clean
    useEffect(() => {
        dispatch(api.util.resetApiState());
        dispatch(resetState());
    }, []);
    
    // set up the login query
    const [login, { data:loginEnvelope, ...loginStatus }] = useLazyLoginQuery();

    useEffect(() => {
        if (loginStatus.isLoading && loginStatus.requestId)
            dispatch(setWaitMessage(loginStatus.requestId, "Logging in..."));
        else if (loginStatus.isSuccess && loginStatus.requestId)
        {
            dispatch(setAuthToken(loginEnvelope.payload.authToken));
            dispatch(setCurrentUser(loginEnvelope.payload.user));
            dispatch(removeWaitMessage(loginStatus.requestId));
        }
        else if (loginStatus.isError) 
        {
            dispatch(removeWaitMessage(loginStatus.requestId));
            if (loginStatus.error?.status === 401)
                setError("Invalid username or password.");
            else
                setError("An unexpected error occurred.");
        }
    }, [loginStatus.status]);   

    useEffect(() => {
        console.log("authToken",authToken);
        if (authToken) 
            navigate('/home');
    }, [authToken]);

    return (
        <ThemeProvider theme={createTheme()}>
        <Box sx={{height:'100%' , width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Box>
            <Table sx={{}}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2} sx={{border:'none'}}><Box sx={{display:'flex', justifyContent:'center'}}><h2 style={{color:'red', visibility:error?'visible':'hidden'}}>{error || "Invalid Username or   Password"}</h2></Box></TableCell>    
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{border:'none'}}>Username</TableCell>
                        <TableCell sx={{border:'none'}}><input type="text" value={username} onChange={event=>setUsername(()=>event.target.value)}/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{border:'none'}}>Password</TableCell>
                        <TableCell sx={{border:'none'}}><input type="password" value={password} onChange={event=>setPassword(()=>event.target.value)} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} sx={{border:'none'}}><Box sx={{display:'flex', justifyContent:'center'}}><Button disabled={loginStatus.isLoading} onClick={()=>login({username, password})}>Login</Button></Box></TableCell>    
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} sx={{border:'none'}}><Box sx={{display:'flex', justifyContent:'center'}}><h3> </h3></Box></TableCell>    
                    </TableRow>
                </TableBody>
            </Table>
            </Box>
        </Box>
        <MainMessageBox />
        <CenteredCircularProgress/>
        </ThemeProvider>
    );
}
