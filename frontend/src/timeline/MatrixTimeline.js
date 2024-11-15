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
import { handleQueryError } from '../api/ApiUtils';
import { useStoreTimelineMutation } from '../api/TimelineApi';
import { handleMutationResults } from '../api/ApiUtils';
import { enqueueSnackbar } from 'notistack';
import { useBlocker } from 'react-router';
import EntityDisplayDialog from '../entity/EntityDisplayDialog';

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
    const activeCase = useSelector(selectActiveCase);

    const [showTimelineEditEntitiesDialog, setShowTimelineEditEntitiesDialog] = useState(false);
    const [showEntityId, setShowEntityId] = useState(false);    

    //const timelineIdRef = useRef(timelineTabData.id);
    const timelineBoxRef = useRef(null);
    const timelineModifiedRef = useRef(false);  

    const [getTimelineData, {data:timelineEnvelope, ...getTimelineStatus}] = useLazyGetTimelineQuery();
    const timelineData = timelineEnvelope?.payload;

    useEffect(() => {
        getTimelineData(timelineTabData.id);
    } ,[timelineTabData.id]);

    // get all possible timeline entities for the active case
    const [getAllTimelineEntities, {data:entityEnvelope, ...getAllTimelineEntitiesForCaseStatus}] = useLazyGetAllTimelineEntitiesForCaseQuery();
    const timelineEntities = entityEnvelope?.payload;
    useEffect(() => {
        if (activeCase?.id)
            getAllTimelineEntities(activeCase.id);
    } ,[activeCase?.id]);

    const {data:entityDefinitionEnvelope, ...getAllEntityDefinitionsForCaseStatus} = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefinitionEnvelope?.payload;

    // check for query errors
    useEffect(() => {  
        if (getAllTimelineEntitiesForCaseStatus.isError)
            handleQueryError(getAllTimelineEntitiesForCaseStatus, dispatch, navigate);
        if (getAllEntityDefinitionsForCaseStatus.isError)
            handleQueryError(getAllEntityDefinitionsForCaseStatus, dispatch, navigate);
        if (getTimelineStatus.isError)
            handleQueryError(getAllTimelineEntitiesForCaseStatus, dispatch, navigate);
    } ,[getAllTimelineEntitiesForCaseStatus.isError, 
        getAllEntityDefinitionsForCaseStatus.isError,
        getTimelineStatus.isError]); 

    function onClick(event) 
    {
        setShowEntityId(event.item);
    }

    useEffect(() => {
        if (timelineBoxRef.current && timelineData && timelineEntities)//!timelineRef.current)
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
                console.log("DESTROYING TIMELINE");
                timelineRef.current.destroy();
                timelineRef.current = undefined;
            }
        }
    }, [timelineData, timelineEntities]);

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
                            navigate,
                            true, 
                            "Saving timeline...",
                            "Error saving timeline.", 
                            ()=>{
                                    timelineModifiedRef.current=false;
                                    enqueueSnackbar( "Timeline saved", {variant:'success'});
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

    useBlocker((tx) => {
        console.log("TIMELINE BLOCKER");
    });

    return (
        <Box sx={{ position:'relative',display:'flex', flexDirection:'column', justifyContent:'center', width: "100%", height: "100%" }}>
            <Box ref={timelineBoxRef}/>
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
        </Box>
      )
}

export default MTimeline;