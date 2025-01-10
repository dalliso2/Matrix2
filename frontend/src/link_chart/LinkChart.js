import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { useSelector } from 'react-redux';
import { selectActiveCase, selectAuthToken } from '../state/AppSlice';
import { useDispatch } from 'react-redux';
import SetActiveCaseDialog from '../case/SetActiveCaseDialog';
import { Box } from '@mui/material';
import LinkChartButtonContainer from './LinkChartButtonContainer';
import { useGetCaseEntityRelationshipsQuery, useGetAllLinkChartEntitiesForCaseQuery } from '../api/EntityApi';
import { useEffect } from 'react';
import { handleQueryResultsWithWaitMessage } from '../api/ApiUtils';
import { useStoreLinkChartMutation, useGetLinkChartQuery } from '../api/LinkChartApi';
import { handleMutationResults } from '../api/ApiUtils';
import { enqueueSnackbar } from 'notistack';
import LinkChartPropertiesDrawer from './LinkChartPropertiesDrawer';
import EditNodeDialog from './EditNodeDialog';
import { useState } from 'react';
import LinkChartEditEntitiesButton from './LinkChartEditEntitiesButton';
import LinkChartEditEntitiesDialog from './LinkChartEditEntitiesDialog';
import LinkChartSaveButton from './LinkChartSaveButton';
import { useTheme } from '@emotion/react';
import LinkChartEditButton from './LinkChartEditButton';
import { useBlocker } from 'react-router-dom';
import BinaryChoiceMessageBox from '../util/BinaryChoiceMessageBox';
import { useNavigate } from 'react-router-dom';
import { selectLinkChartTabIsNew, setLinkChartTabIsNew } from '../state/AppSlice';
import EntityDisplayDialog from '../entity/EntityDisplayDialog';
import Fab from '@mui/material/Fab';
import MarginTwoToneIcon from '@mui/icons-material/MarginTwoTone';
import coseBilkent from 'cytoscape-cose-bilkent';
import cytoscape from 'cytoscape';
import LinkChartRefreshDataButton from './LinkChartRefreshDataButton';

cytoscape.use(coseBilkent);

const defaultStyleSheet = [ {selector:'node',style:{width:80, height:80, backgroundFit:'cover',shape:'ellipse'}},
    { selector: 'edge', style:{'label': 'data(label)', 'curve-style': 'bezier', 'target-arrow-shape': 'triangle', 
                                'target-arrow-color': 'black', 'line-color': 'black', 'textRotation':'autorotate',
                                "text-background-opacity": 1,
                                "text-background-color": "white"}},
    ];

export default function LinkChart({cyRef, linkChartModifiedRef, linkChartTabData, saveTabChartData, saveLinkChartFnRef})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeCase = useSelector(selectActiveCase);
    const authToken = useSelector(selectAuthToken);
    // flag to indicate if the tab is new
    const tabIsNew = useSelector(selectLinkChartTabIsNew);

    // node being edited
    const [editNode, setEditNode] = useState(false);
    // flag to show the edit entities dialog
    const [showLinkChartEditEntitiesDialog, setShowLinkChartEditEntitiesDialog] = useState(false);
    // If next route is set, the user has clicked another tab of the navigation menu bar.
    // The user will be prompted to save the link chart before this route is followed.
    const [nextRoute, setNextRoute] = useState(undefined);
    const [showEntityId, setShowEntityId] = useState(undefined);

    function onClick()
    {

    }

    // set up event handlers for the cytoscape instance
    useEffect(() => {
        if (cyRef.current)
        {   
            cyRef.current.on('add remove drag position data', (evt)=>{
                linkChartModifiedRef.current=true;
            });
            cyRef.current.on('click', 'node', function(evt){
                setShowEntityId(evt.target.data('id'));
            });
            //cyRef.current.on('layoutstop', function(evt){cyRef.current.fit();});
        }
    },[cyRef]);

    // block navigation if the link chart has been modified
    // setting the next route will trigger a prompt to save the link chart
    useBlocker((tx) => {
        saveTabChartData();
        if (linkChartModifiedRef.current)
        {
            linkChartModifiedRef.current=false;
            setNextRoute(tx.nextLocation.pathname);
            return true;
        }
        return false;
    });

    // update the theme if the user changes between light and dark mode
    function updateTheme()
    {
        const themeLight = theme.palette.mode === 'light';
        cyRef.current.style().selector('node').style({"text-background-color":themeLight?theme.palette.grey[100]:theme.palette.grey[900],
                                        "text-background-opacity":1,"color":theme.palette.primary.main });
        cyRef.current.style().selector('edge').style({"text-background-color":themeLight?theme.palette.grey[100]:theme.palette.grey[900],
                                        "color":theme.palette.primary.main,
                                        "line-color":themeLight?theme.palette.common.black:theme.palette.common.white,
                                        "source-arrow-color":themeLight?theme.palette.common.black:theme.palette.common.white,
                                        "target-arrow-color":themeLight?theme.palette.common.black:theme.palette.common.white,
                                        'source-distance-from-node':'30px',
                                        'target-distance-from-node':'30px'}).update();
    }

    // change styling of cytoscape if theme changes
    useEffect(() => {
        // save the modification status of the link chart
        // so changing the theme does not mark the link chart as modified
        const modified = linkChartModifiedRef.current;
        updateTheme();
        // restore the modification status
        linkChartModifiedRef.current = modified;
    }, [theme]);

    // get all possible link chart entities for the active case
    const { refetch:refreshEntities, ...getAllLinkChartEntitiesForCaseResults } = useGetAllLinkChartEntitiesForCaseQuery(activeCase.id);
    const linkChartEntities = getAllLinkChartEntitiesForCaseResults?.data?.payload;
    // 
    // load all possible entity relationships for the active case
    //
    const { refetch:refreshRelationships, ...getAllEntityRelationshipsForCaseResults } = useGetCaseEntityRelationshipsQuery(activeCase.id);
    const linkChartRelationships = getAllEntityRelationshipsForCaseResults?.data?.payload;
    // load link chart data
    const getLinkChartResults = useGetLinkChartQuery(linkChartTabData.id);
    const linkChartData = getLinkChartResults?.data?.payload;

    // load link chart data into cytoscape
    useEffect(() => {
        if (linkChartData && linkChartEntities && linkChartRelationships)
        {
            // remove all elements from the cytoscape instance if we are switching tabs
            cyRef.current.elements().remove();
            if (linkChartData.entities)
                addEntities(JSON.parse(linkChartData.entities));        
            if (linkChartData.styleSheet)    
                cyRef.current.style(JSON.parse(JSON.parse(linkChartData.styleSheet))).update();     
            if (linkChartTabData.zoom)
                cyRef.current.zoom(linkChartTabData.zoom);
            if (linkChartTabData.pan)
                cyRef.current.pan(JSON.parse(JSON.stringify(linkChartTabData.pan)));

            if (tabIsNew)
            {
                cyRef.current.fit();
                cyRef.current.zoom(cyRef.current.zoom()*0.8);
                cyRef.current.center();
                saveTabChartData();
                dispatch(setLinkChartTabIsNew(false));
            }

            updateTheme();
            linkChartModifiedRef.current=false;
        }   
    }, [linkChartData, linkChartEntities, linkChartRelationships]);

    // check for query errors
    useEffect(() => {  
        handleQueryResultsWithWaitMessage(getAllEntityRelationshipsForCaseResults, dispatch);
        handleQueryResultsWithWaitMessage(getAllLinkChartEntitiesForCaseResults, dispatch);
        handleQueryResultsWithWaitMessage(getLinkChartResults, dispatch);
    } ,[getAllEntityRelationshipsForCaseResults.isFetching, 
        getAllLinkChartEntitiesForCaseResults.isFetching,
        getLinkChartResults.isFetching]); 

    //
    // set up function to save the link chart
    //
    const [storeLinkChart, linkChartMutationState] = useStoreLinkChartMutation();
    handleMutationResults(linkChartMutationState, 
                            dispatch, 
                            ()=>{
                                    linkChartModifiedRef.current=false;
                                    enqueueSnackbar( "Saved link chart " + linkChartData.name, {variant:'success'});
                                    setNextRoute(undefined);
                            }
                        );


    console.log("LinkChart 1", linkChartData);
    function saveLinkChartFn()
    {
        console.log("LinkChart 2", linkChartData);
        saveTabChartData(); 
        linkChartModifiedRef.current=false;
        const ld = {
            id:linkChartTabData.id,
            name: linkChartData?.name,
            description: linkChartData?.description,
            matrixCase: activeCase.id, 
            pan:JSON.stringify(cyRef.current.pan()),
            zoom:cyRef.current.zoom(),
            entities:cyRef.current.nodes()?.map(node=>[node.data().id, node.position()]), 
            styleSheet:JSON.stringify(cyRef.current.style().json())
        };

        console.log("storeLinkChart", ld);  
        storeLinkChart(ld);

    }

    // set the function reference so the link chart can be saved from the tab component
    saveLinkChartFnRef.current = saveLinkChartFn;   

    function addEntitiesByIds(entityIds)
    {
        var pan = cyRef.current.pan();
        var zoom = cyRef.current.zoom();
        var centerX = pan.x + cyRef.current.width() / zoom - cyRef.current.width()/(entityIds.length+1)*entityIds.length;
        var centerY = pan.y + cyRef.current.height() / 2 / zoom;

        addEntities(entityIds.map(id=>[id.toString(), {"x":centerX+=40, "y":centerY+=40}]));
    }

    // entityDataArray format [[id, ["x":100]], ["y", 200]], ...]
    function addEntities(entityDataArray)
    {
        var addedElements = cyRef.current.collection();
        const edges = [];   

        entityDataArray.forEach(entityData => {
            const entity = linkChartEntities.find(entity=>entity.id==entityData[0]);
            
            if (!entity)
                return;

            addedElements = addedElements.union(cyRef.current.add({data: {  id: entity.id.toString() }}).position(entityData[1]));
            const backgroundImageUrl = entity?.imageId && '/api/file/' + entity?.imageId?.toString() + "?t=" + authToken;
            cyRef.current.style().selector('#' + entity.id).style({   backgroundImage: backgroundImageUrl,
                                                                        label: entity?.title})
                                                                .update();
         });
        
        // add edges that are not already in the chart
        // const entityIdSet = new Set(cyRef.current.nodes().map(node=>node.data().id));
        const entityIdSet = new Set(cyRef.current.nodes()?.map(node=>node.data().id));
        const existingEdges = cyRef.current.edges()?.map(edge=>edge.data());

        const elements = linkChartRelationships.filter(rel=>entityIdSet.has(rel.parentId.toString()) && entityIdSet.has(rel.childId.toString()))
                                    .filter(rel2 => !existingEdges.find(edge=> edge.source==rel2.parentId && edge.target == rel2.childId))
                                    .map(relationship => ( {data:    {  source: relationship.parentId.toString(), 
                                                                        target: relationship.childId.toString(),
                                                                        label: relationship.description?.length?relationship.description:undefined,
                                                                    }} ));

        cyRef.current.add(elements);    
    }

    function removeEntitiesByIds(entityIds)    
    {
        entityIds.forEach(id=>cyRef.current.remove('#' + id));
    }

    function updateEntity(entity)
    {
        const node = cyRef.current.getElementById(entity.id);
        node.style('label', entity.__title);
    }

    function refreshData()
    {
        refreshEntities();
        refreshRelationships();
    }

    const layout = {
        name: 'cose-bilkent',
        nodeDimensionsIncludeLabels: true,
        padding:20,
        fit:true,
        tile:true,
        randomize: true,
        nodeRepulsion: 1000000,
    }

    return  <>
                {    
                    <Box sx={{position:'relative',display:'flex', width:'100%', height:'100%'}}>
                            <CytoscapeComponent 
                                    cy={cy => cyRef.current = cy}
                                    elements={[]} 
                                    style={{ flexGrow:1 }}
                                    stylesheet={defaultStyleSheet} 
                                    />
                        <LinkChartButtonContainer>
                            <LinkChartEditEntitiesButton openFn={()=>setShowLinkChartEditEntitiesDialog(true)}/>
                            <LinkChartRefreshDataButton refreshFn={refreshData}/>
                            <LinkChartEditButton linkChartObj={linkChartData}/>
                            <LinkChartSaveButton saveLinkChartFn={saveLinkChartFn}/>
                            <Fab color="primary" aria-label="Layout" 
                                    sx={{}} onClick={()=>{cyRef.current.layout(layout).run();}}><MarginTwoToneIcon/></Fab>
                        </LinkChartButtonContainer>
                    </Box>
                }
                <SetActiveCaseDialog/>
                {cyRef?.current && false && <LinkChartPropertiesDrawer cy={cyRef}/>}
                {editNode && <EditNodeDialog node={editNode} closeFn={()=>setEditNode(undefined)}/>}
                
            { showLinkChartEditEntitiesDialog && <LinkChartEditEntitiesDialog 
                                                                existingEntitiesIdsFn={()=>cyRef.current.nodes().map(node=>node.data().id)}
                                                                closeFn={()=>setShowLinkChartEditEntitiesDialog(false)}
                                                                addEntitiesFn={addEntitiesByIds}
                                                                removeEntitiesFn={removeEntitiesByIds}/> }
            { nextRoute && <BinaryChoiceMessageBox title="Save Link Chart" 
                                message={"Do you want to save your changes to this link chart?"}
                                onYes={()=>{saveLinkChartFn();navigate(nextRoute);}}
                                onNo={()=>{linkChartModifiedRef.current=false;navigate(nextRoute);}}/>}
            {showEntityId && <EntityDisplayDialog entityId={showEntityId} entityUpdatedCallback={updateEntity} onClose={()=>setShowEntityId(false)}/>}
            </>
}