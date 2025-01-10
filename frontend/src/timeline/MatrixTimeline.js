import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import { useTheme } from '@mui/material/styles';
import { getTitle } from '../util/utils';
import { DATE, DATE_RANGE, DATE_TIME, DATE_TIME_RANGE } from '../util/PropertyType';
import TimelineButtonContainer from './TimelineButtonContainer';
import TimelineEditEntitiesButton from './TimelineEditEntitiesButton';
import { useState } from 'react';
import TimelineEditEntitiesDialog from './TimelineEditEntitiesDialog';
import TimelineSaveButton from './TimelineSaveButton';
import { useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import { useLazyGetTimelineQuery } from '../api/TimelineApi';
import { useLazyGetAllTimelineEntitiesForCaseQuery } from '../api/EntityApi';
import { useGetAllEntityDefinitionsQuery } from '../api/EntityDefinitionApi';
import { handleQueryResultsWithWaitMessage } from '../api/ApiUtils';
import { useStoreTimelineMutation } from '../api/TimelineApi';
import { handleMutationResults } from '../api/ApiUtils';
import { enqueueSnackbar } from 'notistack';
import { useBlocker } from 'react-router';
import EntityDisplayDialog from '../entity/EntityDisplayDialog';
import BinaryChoiceMessageBox from '../util/BinaryChoiceMessageBox';

import './timeline.css';

const options = {
    width: '100%',
    stack: true, 
};

function getItem(entityDefinitions, entity)
{
    const timelineItems = [];
    const entityDef = entityDefinitions.find(def=>def.id===entity.entityDefinition);

    if (entityDef)
    {
        const timelineProps = entityDef.props.filter(prop=>prop.includeInTimeline);
        
        timelineProps.forEach(prop=>{
                switch (prop.type)
                {
                    case DATE:
                    case DATE_TIME:
                        const date = entity.propertyValues.find(pv=>pv.propertyDefinition===prop.id);
                        if (date)
                            timelineItems.push({id: entity.id, content: getTitle(entityDefinitions, entity), start: date.value});
                        break
                    case DATE_RANGE:
                    case DATE_TIME_RANGE:
                        const startDate = entity.propertyValues.find(pv=>pv.propertyDefinition===prop.id && pv.valOrder===0);
                        const endDate = entity.propertyValues.find(pv=>pv.propertyDefinition===prop.id && pv.valOrder===1);
                        if (startDate && endDate)
                            timelineItems.push({id: entity.id, content: getTitle(entityDefinitions, entity), start: startDate.value, end: endDate.value});
                        break;
                }
        });
    }

    return timelineItems;
}

function MTimeline({ timelineTabData, timelineRef }) 
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [nextRoute, setNextRoute] = useState(null);
    const activeCase = useSelector(selectActiveCase);

    const [showTimelineEditEntitiesDialog, setShowTimelineEditEntitiesDialog] = useState(false);
    const [showEntityId, setShowEntityId] = useState(false);    

    //const timelineIdRef = useRef(timelineTabData.id);
    const timelineBoxRef = useRef(null);
    // this ref is used to determine if the timeline has been modified
    const timelineModifiedRef = useRef(false);  

    const [getTimelineData, getTimelineResults] = useLazyGetTimelineQuery();
    const timelineData = getTimelineResults?.data?.payload;

    useEffect(() => {
        getTimelineData(timelineTabData.id);
    } ,[timelineTabData.id]);

    // get all possible timeline entities for the active case
    const [getAllTimelineEntities, getAllTimelineEntitiesForCaseResults] = useLazyGetAllTimelineEntitiesForCaseQuery();
    const timelineEntities = getAllTimelineEntitiesForCaseResults?.data?.payload;
    useEffect(() => {
        if (activeCase?.id)
            getAllTimelineEntities(activeCase.id);
    } ,[activeCase?.id]);

    const getAllEntityDefinitionsForCaseResults = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = getAllEntityDefinitionsForCaseResults?.data?.payload;

    // check for query errors
    useEffect(() => { 
        handleQueryResultsWithWaitMessage(getAllTimelineEntitiesForCaseResults, dispatch,);
        handleQueryResultsWithWaitMessage(getAllEntityDefinitionsForCaseResults, dispatch);
        handleQueryResultsWithWaitMessage(getTimelineResults, dispatch);
    } ,[getAllTimelineEntitiesForCaseResults.isFetching, 
        getAllEntityDefinitionsForCaseResults.isFetching,
        getTimelineResults.isFetching]); 

    function onClick(event) 
    {
        setShowEntityId(event.item);
    }

    useEffect(() => {
        if (timelineBoxRef.current && timelineData && timelineEntities && entityDefinitions)//!timelineRef.current)
        {
            const items = [];
            //timelineIdRef.current = timelineData.id;
            timelineData.matrixEntityIds.forEach(id => {
                const entity = timelineEntities.find(entity=>entity.id===id);
                if (entity)
                {
                    const entityItems = getItem(entityDefinitions, entity);
                    items.push(...entityItems);
                }
            });

            timelineTabData.start?options.start=timelineTabData.start:delete[options.start];
            timelineTabData.end?options.end=timelineTabData.end:delete[options.end];

            timelineRef.current = new Timeline(timelineBoxRef.current, items, options);
            timelineRef.current.on('click', onClick);

            return ()=>{
                timelineRef.current.destroy();
                timelineRef.current = undefined;
            }
        }
    }, [timelineData, timelineEntities, entityDefinitions]);

    function addEntities(entityIdsToAdd)
    {
        timelineModifiedRef.current=true;
        entityIdsToAdd.forEach(id => timelineRef.current.itemsData.add(getItem(entityDefinitions,timelineEntities.find(entity=>entity.id===id))));  
    }

    function removeEntities(entityIdsToRemove)
    {
        timelineModifiedRef.current=true;
        entityIdsToRemove.forEach(id => timelineRef.current.itemsData.remove(id));
    }

    function updateItem(entity)
    {
        const item = timelineRef.current.itemsData.get(entity.id);
        if (item)
        {
            timelineRef.current.itemsData.update(getItem(entityDefinitions, entity));
        }
    }

    const [storeTimeline, timelineMutationState] = useStoreTimelineMutation();
    handleMutationResults(timelineMutationState, 
                            dispatch, 
                            ()=>{
                                    timelineModifiedRef.current=false;
                                    enqueueSnackbar( "Timeline saved", {variant:'success'});
                                    if (nextRoute)
                                        navigate(nextRoute);
                            }
                        );

    function saveTimeline()
    {
        storeTimeline({id:timelineData.id, 
                        name:timelineData.name, 
                        description:timelineData.description, 
                        matrixCaseId:activeCase.id, 
                        matrixEntityIds:timelineRef.current.itemsData.getIds()});
    }

    useBlocker((routeData) => {
        if (timelineModifiedRef.current)
        {
            setNextRoute(routeData.nextLocation.pathname);
            return true;
        }
    });

    return (
        <Box sx={{ position:'relative',display:'flex', flexDirection:'column', justifyContent:'center', width: "100%", height: "100%" }}>
            <Box sx={{flexGrow:1, overflow:'scroll'}} ref={timelineBoxRef}/>
            <TimelineButtonContainer>
                <TimelineEditEntitiesButton openFn={()=>setShowTimelineEditEntitiesDialog(true)}/>
                <TimelineSaveButton saveTimelineFn={saveTimeline}/>
            </TimelineButtonContainer>
            { showTimelineEditEntitiesDialog && <TimelineEditEntitiesDialog  
                                        timelineRef={timelineRef}
                                        timelineEntities={timelineEntities.map(entity=>({id:entity.id, title:getTitle(entityDefinitions, entity)}))}
                                        addEntitiesFn={addEntities}
                                        removeEntitiesFn={removeEntities}
                                        closeFn={()=>setShowTimelineEditEntitiesDialog(false)}/> }
            {showEntityId && <EntityDisplayDialog entityId={showEntityId} entityUpdatedCallback={(updateItem)} onClose={()=>setShowEntityId(false)}/>}
            { nextRoute && <BinaryChoiceMessageBox title="Save Link Chart" 
                                message={"Do you want to save your changes to this link chart?"}
                                onYes={()=>saveTimeline()}
                                onNo={()=>{navigate(nextRoute);}}/>}
        </Box>
      )
}

export default MTimeline;