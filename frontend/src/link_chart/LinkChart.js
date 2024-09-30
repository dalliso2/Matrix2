import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import { useEffect } from 'react';
import { handleQueryError } from '../api/ApiUtils';
import { useDispatch } from 'react-redux';
import SetActiveCaseDialog from '../case/SetActiveCaseDialog';
import { useRef } from 'react';
import { Box } from '@mui/material';
import { useLazyGetCaseEntityRelationshipsQuery } from '../api/EntityApi';
import { useTheme } from '@emotion/react';
import LinkChartButtonContainer from './LinkChartButtonContainer';
import { useGetAllEntityDefinitionsQuery } from '../api/EntityDefinitionApi';
import { useLazyFindEntitiesByIdsQuery } from '../api/EntityApi';
import BinaryChoiceMessageBox from '../util/BinaryChoiceMessageBox';

const defaultStyleSheet = [ {selector:'node',style:{width:80, height:80, backgroundFit:'cover',shape:'ellipse'}},
    { selector: 'edge', style:{'label': 'data(label)', 'curve-style': 'bezier', 'target-arrow-shape': 'triangle', 
                                'target-arrow-color': 'black', 'line-color': 'black', 'textRotation':'autorotate',
                                'left-text-margin':'50px', 'right-text-margin':'50px', "text-background-opacity": 1,
                                "text-background-color": "white"}},];

export default function LinkChart({})
{
    const theme = useTheme();
    const activeCase = useSelector(selectActiveCase);
    const dispatch = useDispatch();

    const [showSaveLinkChartDialog, setShowSaveLinkChartDialog] = React.useState(false);

    const myCyRef = useRef(undefined);
    const chartDataRef = useRef({entityIds:[], styleSheet:[]});
    const chartStateRef = useRef({changed:false});

    function newLinkChartFn()
    {
        console.log('newLinkChartFn');
        if (chartStateRef.current.changed)
            setShowSaveLinkChartDialog(true);
        else
        {
            saveLinkChartFn();
            chartDataRef.current = {entityIds:[], styleSheet:JSON.parse(JSON.stringify(defaultStyleSheet))};
        }
    }

    function saveLinkChartFn(newChart)
    {
        console.log('saveLinkChartFn');
        chartStateRef.current.changed = false;
        if (newChart)
            newLinkChartFn();
    }

    function cancelEdits()
    {
        console.log('cancelEdits');
        chartStateRef.current.changed = false;
        setShowSaveLinkChartDialog(false);
    }

    function addEntities(entityDataArray)
    {
        myCyRef.current.add(entityDataArray.map(entity => 
            ({data: {  id: entity.id.toString(), label: entity.id.toString(),}})
        )); 
    }

    //
    // load all entity definitions
    //
    const { data:entityDefsEnvelope, refetch, ...entityDefinitionQueryStatus } = useGetAllEntityDefinitionsQuery();
    const entityDefinitions = entityDefsEnvelope?.payload;

    //  
    // load link chart entities
    //
    const [findEntitiesByIds, {data:entityEnvelope, ...getAllEntitiesForCaseStatus}] = useLazyFindEntitiesByIdsQuery();
    const entities = entityEnvelope?.payload;
 
    //  
    // load all entity relationships for the active case
    //
    const [getAllEntityRelationshipsForCase, {data:entityRelationshipEnvelope, ...getAllEntityRelationshipsForCaseStatus}] = useLazyGetCaseEntityRelationshipsQuery();
    const relationships = entityRelationshipEnvelope?.payload;
 
    // check for query errors
    useEffect(() => {  
        if (entityDefinitionQueryStatus.isError) 
            handleQueryError(entityDefinitionQueryStatus, dispatch);
        if (getAllEntitiesForCaseStatus.isError)
            handleQueryError(getAllEntitiesForCaseStatus, dispatch);
        if (getAllEntityRelationshipsForCaseStatus.isError)
            handleQueryError(getAllEntityRelationshipsForCaseStatus, dispatch);
    } ,[entityDefinitionQueryStatus.isError, getAllEntitiesForCaseStatus.isError, getAllEntityRelationshipsForCaseStatus.isError]);
    
    useEffect(() => {  
        if (activeCase)
        {
            findEntitiesByIds({caseId:activeCase.id, ids:chartDataRef?.current.entityIds});
            getAllEntityRelationshipsForCase(activeCase.id);
            getAllEntityRelationshipsForCase(activeCase.id);
        }
    } ,[activeCase]);

    var elements = [];

    console.log(entityDefinitions, entities, relationships);
    // all queries have returned
    if (entityDefinitions && entities && relationships)
    {
        if (chartDataRef?.current.entityIds.length)
            {
                // add all entities
                elements = elements.concat(entities.map(entity => 
                    ( {data: {  id: entity.id.toString(), 
                                label: entity.id.toString(),
                            }} )));
            }
            
        // add all entity relationships
        elements = elements.concat(relationships.map(relationship => 
            ( {data: {  source: relationship.parentId.toString(), 
                        target: relationship.childId.toString(),
                        label: relationship.description?.length && relationship.description,
                    }} )));
    }
    
    // add entities
    
    
                    // const elements = entities?.map((entity) => ({ 
    //     data:   {   id: entity.id.toString(), 
    //                 label: entity.id.toString(),
    //             },
    //     }));

    // if (elements && relationships)
    //     relationships.forEach(relationship => relationship.description?.length && elements.push({
    //     data:   {   source: relationship.parentId.toString(), 
    //                 target: relationship.childId.toString(),
    //                 label: relationship.description?.length && relationship.description,
    //             },
    //     }));

    // const styleSheet = entityDefinitions && entities && relationships && [
    //                         {
    //                             selector:'node', 
    //                             style:{
    //                                 width:80, 
    //                                 height:80, 
    //                                 backgroundFit:'cover',
    //                                 shape:'ellipse',
    //                             },
    //                         },
    //                         {
    //                             selector: 'edge', style:{'label': 'data(label)', 
    //                                                         'curve-style': 'bezier', 
    //                                                         'target-arrow-shape': 'triangle', 
    //                                                         'target-arrow-color': 'black', 
    //                                                         'line-color': 'black',
    //                                                         textRotation:'autorotate',
    //                                                         'left-text-margin':'50px',
    //                                                         'right-text-margin':'50px',
    //                                                         "text-background-opacity": 1,
    //                                                         "text-background-color": "white"}
    //                         },
    //                         ...entities.map(entity => ({    selector:'#' + entity.id, style:{
    //                                                                                             backgroundImage: '/api/file/' + getImageId(entityDefinitions, entity ),
    //                                                                                             label: getTitle(entityDefinitions, entity )}}))
    //                         // ...entities.filter(entity=>getImageId(entityDefinitions, entity )).map(entity => ({selector:'#' + entity.id, style:{backgroundImage: '/api/file/' + getImageId(entityDefinitions, entity ),}})),
    //                         // ...entities.filter(entity=>getTitle(entityDefinitions, entity )).map(entity => ({selector:'#' + entity.id, style:{ label: getTitle(entityDefinitions, entity )}}))
    //                     ];

    return  <>
                {   (chartDataRef?.current.styleSheet) ?  
                    <Box sx={{position:'relative',display:'flex', width:'100%', height:'100%'}}>
                        <Box sx={{flexGrow:1}}>
                            <CytoscapeComponent 
                                    cy={cy => myCyRef.current = cy}
                                    layout={{name:'random'}}
                                    elements={elements||[]} 
                                    style={{ width: '100%', height: '100%' }}
                                    stylesheet={chartDataRef.current.styleSheet} 
                                    />
                        </Box>
                        <LinkChartButtonContainer   addEntitiesFn={addEntities}
                                                    newLinkChartFn={newLinkChartFn} 
                                                    saveLinkChartFn={saveLinkChartFn}
                                                    />
                    </Box>
                    : <div>Loading...</div>
                }
                <SetActiveCaseDialog/>
                {showSaveLinkChartDialog && <BinaryChoiceMessageBox title="Save Changes" message={"Do you want to save your changes?"} 
                onYes={saveLinkChartFn} onNo={cancelEdits} />}
            </>
}