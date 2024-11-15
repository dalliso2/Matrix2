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

function MTimeline({ timelineData, timelineEntities, entityDefinitions, storeTimeline, timelineTabData }) 
{
    console.log(timelineTabData);
    console.log(timelineEntities);
    console.log(entityDefinitions);
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeCase = useSelector(selectActiveCase);

    const [showTimelineEditEntitiesDialog, setShowTimelineEditEntitiesDialog] = useState(false);
    const [reRender, setReRender] = useState(false);

    const timelineRef = useRef(null);
    //const timelineIdRef = useRef(timelineTabData.id);
    const timelineBoxRef = useRef(null);

    useEffect(() => {
        if (timelineBoxRef.current && !timelineRef.current)
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

            timelineRef.current = new Timeline(timelineBoxRef.current, items, options);

            return ()=>{
                console.log("DESTROY"); 
                timelineRef.current.destroy();
                timelineRef.current = undefined;
            }
        }
    }, [timelineData.id]);

    function addEntities(entityIdsToAdd)
    {
        entityIdsToAdd.forEach(id => timelineRef.current.itemsData.add(getItem(entityDefinitions,timelineEntities.find(entity=>entity.id===id))));  
    }

    function removeEntities(entityIdsToRemove)
    {
        entityIdsToRemove.forEach(id => timelineRef.current.itemsData.remove(id));
    }

    function saveTimeline()
    {
        storeTimeline({id:timeline.id, 
                        name:timeline.name, 
                        description:timeline.description, 
                        matrixCaseId:activeCase.id, 
                        matrixEntityIds:timelineRef.current.itemsData.getIds()});
    }

    return (
        <Box sx={{ position:'relative',display:'flex', width: "100%", height: "100%", border:'3px solid red' }}>
            <Box ref={timelineBoxRef} sx={{flexGrow:1}}/>
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
        </Box>
      )
}

export default MTimeline;