import React from "react";
import Box from "@mui/material/Box";
import { PROFILE_IMAGE, IMAGE_ARRAY } from "../util/PropertyType";
import { getFieldDisplay } from "../util/DisplayComponentFactory";
import { consolidatePropValues } from "../util/utils";
import IconButton from "@mui/material/IconButton";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddEditEntityDialog from "./AddEditEntityDialog";
import { useGetEntityQuery } from "../api/EntityApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./Entity.css";
import LoadingSkeleton from "../util/LoadingSkeleton";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Table, TableBody, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";
import { useNavigate } from "react-router-dom";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";
import { useSelector } from "react-redux";
import { selectActiveCase, selectCurrentUser } from "../state/AppSlice";
import { userCanModifyCase } from "../util/utils";

export default function Entity( {entityId, entityUpdatedCallback } )
{
    const theme = useTheme();
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 

    const currentUserCanModifyCase = userCanModifyCase(useSelector(selectCurrentUser), useSelector(selectActiveCase).id);

    const [editEntityDialogOpen, setEditEntityDialogOpen] = React.useState(false);

    const { refetch, ...entityDefinitionQueryResults } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefinitionQueryResults?.data?.payload;
 
    const { refetch:refetchEntity, ...getEntityResults} = useGetEntityQuery(entityId);
    const entity = getEntityResults?.data?.payload;  

    useEffect(() => {
        handleQueryResultsWithWaitMessage(entityDefinitionQueryResults, dispatch);
        handleQueryResultsWithWaitMessage(getEntityResults, dispatch);
    }, [entityDefinitionQueryResults.isFetching, getEntityResults.isFetching]);

    const entityPropValues = entity && consolidatePropValues(entity);
    const entityDefinition = entity && entityDefinitions.find((def) => def.id === entity.entityDefinition);
    const imageDefinitions = entityDefinition && entityDefinition.props.filter((def) => !def.deleted && (def.type == PROFILE_IMAGE || def.type == IMAGE_ARRAY));
    const nonImageDefinitions = entityDefinition && entityDefinition.props.filter((def) => !def.deleted && (def.type != PROFILE_IMAGE && def.type != IMAGE_ARRAY));

    return (
        <Box>
            <Box sx={{display:'flex',flexDirection:'column', width:'100%', p:2}}>
                <Box sx={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                <Tooltip title="Edit Entity">
                    <IconButton disabled={getEntityResults.isFetching} onClick={()=>setEditEntityDialogOpen(true)}
                                sx={{visibility:currentUserCanModifyCase?'visible':'hidden'}}>
                        <EditTwoToneIcon/>
                    </IconButton> 
                </Tooltip>
                <Tooltip title="Refresh Entity">
                    <IconButton disabled={getEntityResults.isFetching} onClick={() => refetchEntity()}><RefreshIcon/></IconButton>
                </Tooltip>
                </Box>    
                <Box sx={{ position:'relative', display:'flex', width:'100%', gap:'30px', justifyContent:'space-around', overflow:'hidden'}}>
                {
                    getEntityResults.isFetching &&
                        <Box sx={{position:entity?'absolute':'relative', 
                                    height:entity?undefined:'200px',
                                    width:'100%', 
                                    overflow:'hidden', 
                                    zIndex:1000, 
                                    backgroundColor:theme.palette.background.default}}>
                            <Box sx={{p:1}}><LoadingSkeleton/></Box>
                        </Box>
                }
                    <Box sx={{}}>
                        <Table>
                            <TableBody>
                            {
                                nonImageDefinitions?.map((defProp, index) => {
                                    const prop = entityPropValues.find((prop) => defProp.id === prop.propertyDefinition);
                                    return getFieldDisplay(defProp, prop, index);
                                })
                            }
                            </TableBody>
                        </Table>
                    </Box>
                    <Box sx={{maxWidth:'50%',p:1}}>
                    {
                        imageDefinitions?.map((defProp, index) => {
                            const prop = entityPropValues.find((prop) => defProp.id === prop.propertyDefinition);
                            return getFieldDisplay(defProp, prop, index)
                        })
                    }
                    </Box>
                </Box>
            </Box>
            { editEntityDialogOpen && <AddEditEntityDialog entity={entity} 
                                                entityDefinitions={entityDefinitions} 
                                                closeFn={()=>setEditEntityDialogOpen(false)} 
                                                entityUpdatedCallback={entityUpdatedCallback} /> }
        </Box>
    );
}