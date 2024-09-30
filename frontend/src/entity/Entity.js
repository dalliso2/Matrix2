import React from "react";
import Box from "@mui/material/Box";
import { PROFILE_IMAGE, IMAGE_ARRAY } from "../util/PropertyType";
import { getFieldDisplay } from "../util/DisplayComponentFactory";
import { consolidatePropValues } from "../util/utils";
import IconButton from "@mui/material/IconButton";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddEditEntityDialog from "./AddEditEntityDialog";
import { useGetEntityQuery } from "../api/EntityApi";
import { handleQueryError } from "../api/ApiUtils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./Entity.css";
import LoadingSkeleton from "../util/LoadingSkeleton";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Table, TableBody } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";

export default function Entity( {entityId } )
{
    const theme = useTheme();
    const dispatch = useDispatch(); 
    const [editEntityDialogOpen, setEditEntityDialogOpen] = React.useState(false);

    const { data:entityDefsEnvelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    useEffect(() => {
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch);
    }, [entityDefinitionQueryStatus.isError]);
    const entityDefinitions = entityDefsEnvelope?entityDefsEnvelope.payload:[];

    const {currentData:envelope, refetch:refetchEntity, ...getEntityStatus} = useGetEntityQuery(entityId);
    useEffect(() => {
        if (getEntityStatus.isError) 
            handleQueryError(getEntityStatus, dispatch);
    }, [getEntityStatus.isError]);
    const entity = envelope?.payload;    

    const entityPropValues = entity && consolidatePropValues(entity);
    const entityDefinition = entity && entityDefinitions.find((def) => def.id === entity.entityDefinition);
    const imageDefinitions = entityDefinition && entityDefinition.props.filter((def) => !def.deleted && (def.type == PROFILE_IMAGE || def.type == IMAGE_ARRAY));
    const nonImageDefinitions = entityDefinition && entityDefinition.props.filter((def) => !def.deleted && (def.type != PROFILE_IMAGE && def.type != IMAGE_ARRAY));

    return (
        <Box>
            <Box sx={{display:'flex',flexDirection:'column', width:'100%'}}>
                <Box sx={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                    <IconButton onClick={() => refetchEntity()}><RefreshIcon/></IconButton>
                    <IconButton disabled={!entity} onClick={()=>setEditEntityDialogOpen(true)}>
                        <EditTwoToneIcon/>
                    </IconButton> 
                </Box>    
                <Box sx={{ position:'relative', display:'flex', width:'100%', justifyContent:'space-around', overflow:'hidden'}}>
                {
                    getEntityStatus.isFetching &&
                        <Box sx={{position:entity?'absolute':'relative', 
                                    height:entity?undefined:'200px',
                                    width:'100%', 
                                    overflow:'hidden', 
                                    zIndex:1000, 
                                    backgroundColor:theme.palette.background.default}}>
                            <LoadingSkeleton/>
                        </Box>
                }
                    <Box sx={{maxWidth:'50%'}}>
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
            { editEntityDialogOpen && <AddEditEntityDialog entity={entity} entityDefinitions={entityDefinitions} closeFn={()=>setEditEntityDialogOpen(false)}/> }
        </Box>
    );
}