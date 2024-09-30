import React from 'react';
import { Box, List, ListItem } from '@mui/material';
import { useEffect } from 'react';
import { useGetAllLinkChartEntitiesForCaseQuery } from '../api/EntityApi';
import { getTitle } from '../util/utils';
import LoadingSkeleton from '../util/LoadingSkeleton';
import { handleQueryError } from '../api/ApiUtils';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import { useGetAllEntityDefinitionsQuery } from '../api/EntityDefinitionApi';
import { IconButton } from '@mui/material';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';

export default function LinkChartEntityList({ addEntitiesFn,  removeEntityIds = [] })   
{
    const dispatch = useDispatch();
    const activeCase = useSelector(selectActiveCase);

    // get all link chart entities for the active case
    const {data:entityEnvelope, ...getAllLinkChartEntitiesForCaseStatus} = useGetAllLinkChartEntitiesForCaseQuery(activeCase.id);
    const entities = entityEnvelope?.payload || [];

    // get all entity definitions
    const { data:entityDefsEnvelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefsEnvelope?.payload || [];

    console.log('LinkChartEntityList', entities);
    entities.forEach(entity => console.log(getTitle(entityDefinitions,entity)));

    // check for query errors
    useEffect(() => {  
        if (getAllLinkChartEntitiesForCaseStatus.isError) 
            handleQueryError(getAllLinkChartEntitiesForCaseStatus, dispatch);
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch);
    } ,[getAllLinkChartEntitiesForCaseStatus.isError, entityDefinitionQueryStatus.isError ]);

    return (
        <Box sx={{width:'100%', height:'100%', overflow:'auto', display:'flex'}}>
            {
                getAllLinkChartEntitiesForCaseStatus.isFetching?
                <LoadingSkeleton/>:
                <List sx={{width:'100%'}}>
                    {entities.map((entity) => (
                        <ListItem key={entity.id}
                            secondaryAction={<IconButton onClick={()=>addEntitiesFn([entity])}>
                                                <AddCircleTwoToneIcon/>
                                            </IconButton>}>
                            {getTitle(entityDefinitions,entity)}
                        </ListItem>    
                    ))}
                </List>
            }
        </Box>
    );
}