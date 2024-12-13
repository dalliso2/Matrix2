import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Entity from "../entity/Entity";
import { useEffect } from "react";
import { useGetEntityQuery } from "../api/EntityApi";
import { useGetAllEntityDefinitionsQuery } from "../api/EntityDefinitionApi";
import { getTitle } from "../util/utils";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleQueryResultsWithWaitMessage } from "../api/ApiUtils";

export default function EntityDisplayDialog({entityId, entityUpdatedCallback, onClose})
{
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { refetch, ...entityDefinitionQueryResults } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefinitionQueryResults?.data?.payload;
 
    const { refetch:refetchEntity, ...getEntityResults} = useGetEntityQuery(entityId);
    const entity = getEntityResults?.data?.payload; 

    useEffect(() => {
        handleQueryResultsWithWaitMessage(entityDefinitionQueryResults, dispatch);
        handleQueryResultsWithWaitMessage(getEntityResults, dispatch);
    }, [entityDefinitionQueryResults.isFetching, getEntityResults.isFetching]);

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