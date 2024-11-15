import React, { useState } from "react";
import List from '@mui/material/List';
import Property from './Property';
import { Divider } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import PropertyDialog from "./PropertyDialog";
import { Box, Button } from "@mui/material";
import { TEXT } from "../../util/PropertyType";
import { getUniqueId } from "../../util/utils";

export const defaultProp = {
    name: '',
    description: '',
    type: TEXT,
    required: false,
    includeInList: false,
    includeInTitle: false,
    numLines: '',
    maxLength: '',
    mask: '',
    options: '',
    id: undefined,
};

export default function PropertyList({properties, setProperties})
{
    const [editProperty, setEditProperty] = useState(undefined);

    const handleDragEnd = (results) => 
    {
        if (!results.destination) 
            return;
        
        const newPropList = [...properties];    

        const [movedItem] = newPropList.splice(results.source.index,1);
        newPropList.splice(results.destination.index, 0, movedItem);

        let order = 0;
        setProperties(newPropList.map((prop) => ({...prop, propOrder:order++})));
    };

    function saveProperty(property)
    {
        if (property.id === undefined)
        {
            property.id = getUniqueId();
            property.propOrder = properties.length;
            setProperties([...properties, property]);
        }
        else
        {
            const newProps = properties.map((prop) => prop.id === property.id ? property : prop);   
            setProperties(newProps);
        }
    }

    function removeProperty(propertyId)
    {
        // find the property to remove
        const propToRemove = properties.find(prop=>prop.id === propertyId);
        // mark it as deleted
        const newProp = {...propToRemove, deleted:true, propOrder:0};
        // copy the remaining properties in the list
        const newProperties = properties.filter(prop=>prop.id !== propertyId).map((prop) => ({...prop}));
        // add the deleted property back to the list
        newProperties.push(newProp);
        
        setProperties(newProperties);
    }

    return (
        <>
        <Box sx={{display:'flex', flexDirection:'column', width:'400px', p:1}}>
            <Box sx={{ml:2, mr:2, display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                <Box>Properties</Box>
                <Box><Button disabled={!properties} onClick={()=>setEditProperty({...defaultProp, dragId:getUniqueId()})}>New</Button></Box>
            </Box>
            <Box sx={{display:'flex', flexGrow:1, border:'2px solid black', height:'1px', borderRadius:'20px', overflow:'auto', scrollbarWidth:'thin'}}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='theList'>
                {
                    (provided) => (
                        <List {...provided.droppableProps} key={1} ref={provided.innerRef} sx={{width:"100%", }} >
                        {
                            properties?.filter(prop=>!prop.deleted)?.map((prop, index) =>{
                                return (
                                        <Draggable key={prop.id} draggableId={prop.id+''} index={index}>
                                        {   
                                            (provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps}>
                                                <Divider />
                                                <Property   property={prop}
                                                            dragHandleProps={provided.dragHandleProps} 
                                                            setEditProperty={setEditProperty} 
                                                            removeProperty={()=>removeProperty(prop.id)}
                                                            sx={{}}/>
                                                <Divider />
                                            </div>                
                                        )}
                                        </Draggable>
                            )}
                            )}
                            {provided.placeholder}
                        </List>
                )}
                </Droppable>
            </DragDropContext>  
            </Box>
        </Box>
        { editProperty && <PropertyDialog property={editProperty} savePropertyFn={saveProperty} closeFn={()=>setEditProperty(undefined)}/> }
        </>
    );
}