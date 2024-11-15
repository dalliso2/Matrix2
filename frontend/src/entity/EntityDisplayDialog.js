import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Entity from "../entity/Entity";
import { useEffect } from "react";
import { useGetEntityQuery } from "../api/EntityApi";
import { handleQueryError } from "../api/ApiUtils";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";
import { getTitle } from "../util/utils";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EntityDisplayDialog({entityId, entityUpdatedCallback, onClose})
{
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data:entityDefsEnvelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefsEnvelope?entityDefsEnvelope.payload:[];

    const {currentData:envelope, refetch:refetchEntity, ...getEntityStatus} = useGetEntityQuery(entityId);
    const entity = envelope?.payload;  

    useEffect(() => {
        if (getEntityStatus.isError) 
            handleQueryError(getEntityStatus, dispatch, navigate);
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch, navigate);
    }, [getEntityStatus.isError,entityDefinitionQueryStatus.isError]);

    return (
        <Dialog open={true} onClose={()=>{}}>
            <DialogTitle  sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText, 
                borderColor: theme.palette.background.default, }}>{getTitle(entityDefinitions, entity)}</DialogTitle>
            <DialogContent>
                <Entity entityId={entityId} entityUpdatedCallback={entityUpdatedCallback}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}