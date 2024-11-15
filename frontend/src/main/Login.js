import React from "react";
import Box from "@mui/material/Box";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useLazyLoginQuery } from "../api/UserApi";
import { useEffect } from "react";
import { handleQueryError } from "../api/ApiUtils";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, resetState, setAuthToken, setCurrentUser } from "../state/AppSlice";
import { useSelector } from "react-redux";

export default function Login() 
{   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('admin');
    const [password, setPassword] = React.useState('password');
    const [error, setError] = React.useState(false);

    const currentUser = useSelector(selectCurrentUser);

    const [login, { data:loginEnvelope, ...loginStatus }] = useLazyLoginQuery();
    useEffect(() => {
        if (loginStatus.isSuccess) 
        {
            dispatch(setAuthToken(loginEnvelope.payload.accessToken));
            dispatch(setCurrentUser(loginEnvelope.payload.user));
            navigate("/home");
        }
        if (loginStatus.isError) 
            setError(true);
    }, [loginStatus.status]);   

    useEffect(() => {
        dispatch(resetState());
    }, []);

    useEffect(() => {
        if (currentUser) 
            navigate('/home');
    }, [currentUser]);

    useEffect(() => {
        if (loginStatus.isError) 
            handleQueryError(loginStatus, dispatch, navigate);
    }, [loginStatus.isError]);

    return (
        <Box sx={{height:'100%' , width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Box>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2} sx={{border:'none'}}><Box sx={{display:'flex', justifyContent:'center'}}><h2 style={{color:'red', visibility:error?'visible':'hidden'}}>Invalid username/password</h2></Box></TableCell>    
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
                        <TableCell colSpan={2} sx={{border:'none'}}><Box sx={{display:'flex', justifyContent:'center'}}><Button onClick={()=>login({username, password})}>Login</Button></Box></TableCell>    
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} sx={{border:'none'}}><Box sx={{display:'flex', justifyContent:'center'}}><h3> </h3></Box></TableCell>    
                    </TableRow>
                </TableBody>
            </Table>
            </Box>
        </Box>
    );
}
