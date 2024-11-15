import React, { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useGetAllEntityDefinitionsQuery } from '../../api/EntityDefinitionApi';
import { Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { setSelectedEntityDefinitionId, selectSelectedEntityDefinitionId } from '../../state/AppSlice';
import { useDispatch } from 'react-redux';
import { handleQueryError } from '../../api/ApiUtils';
import { useNavigate } from 'react-router-dom';

export default function EntityDefinitionList({setSelectedEntityDefinition})
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedEntityDefinitionId = useSelector(selectSelectedEntityDefinitionId);

    const { data:envelope, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    useEffect(() => {
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch, navigate);
    }, [entityDefinitionQueryStatus.isError]);

    const entityDefinitions = envelope?.payload;
    
    return (
        <>
            <Box sx={{display:'flex', flexDirection:'column'}}>
                <Box sx={{whiteSpace:'nowrap', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                        <Typography variant={'h6'}>
                            Entity Definitions
                        </Typography>
                    <Button onClick={()=>dispatch(setSelectedEntityDefinitionId('new'))}>New</Button>
                </Box>
                <List sx={{ overflow:'auto', flexGrow:1, border:2, borderRadius:2, p:1}}>
                {
                    entityDefinitions && entityDefinitions.map((entityDef, index) =>
                    (
                        <React.Fragment key={index}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={()=>setSelectedEntityDefinition(JSON.parse(JSON.stringify(entityDef)))}
                                        selected={!!selectedEntityDefinitionId && entityDef.id === selectedEntityDefinitionId} >
                                    <ListItemText sx={{wordBreak:"break-word"}}>{entityDef.name}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <Divider/>
                        </React.Fragment>
                    ))
                }
                </List>  
            </Box>
        </>
    );
}