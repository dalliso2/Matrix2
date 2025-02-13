/**
 *      Input comonent that displays a box where an image or
 *      images can be dropped.  The image(s) will be uploaded
 *      and displayed in a vertical column.  The box where
 *      images can be dropped will be displayed at the bottom
 *      of the column.
 */
/////////// React imports //////////
import React, { useEffect, useState } from "react";
/////////// MUI imports //////////
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
/////////// DnD imports //////////
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
/////////// Matrix2 imports //////////
import DragDropTarget from "./dragdrop/DragDropTarget";
import Image from "./Image";
import { Tooltip } from "@mui/material";

const RETRIEVE_FILE_URL = "/api/file/";

export default function ImageArrayInput({value, onChange, error, caseId})
{        
    // field.value will be an array 
    const [imageIds, setImageIds] = useState(value);

    console.log(value, onChange, error, caseId);
    useEffect(()=>{ 
        onChange(imageIds);
    },[imageIds]);

    function handleDragEnd(dragResults)
    {
        const imageIdCopy = [...imageIds];
        if (dragResults.destination)
        {
            const [movedItem] = imageIdCopy.splice(dragResults.source.index,1);
            imageIdCopy.splice(dragResults.destination.index, 0, movedItem);
        }

        setImageIds(() => imageIdCopy);
    }

    function handleDrop(value)
    {
        setImageIds((prevState) => {
            const newState = [...prevState];
            newState.push(value.toString());
            return newState;
        });
    }

    function handleDragStart(params)
    {
    }

    function handleDelete(imageId)
    {
        setImageIds((prevImageIds) => [...imageIds].filter(val => val != imageId));
    }

    //let error = false;
    if (error) // may be an array
    {
        if (Array.isArray(error))
            error = error.reduce((acc, curr) => acc || curr, false);
    }

    return (
        <Box sx={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', padding:'20px'}}>
        {
            imageIds?.length?
            (
                <DragDropContext onDragEnd={(results) => handleDragEnd(results)} onDragStart={handleDragStart}>
                    <Droppable droppableId='droppable'>
                    {
                        (provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            {
                                imageIds.map((value,index) => 
                                (
                                <Draggable key={value+''} draggableId={value+''} index={index}>
                                {(provided,snapshot) => (
                                    <div className="image_array_image_container"  ref={provided.innerRef} 
                                        {...provided.draggableProps} 
                                        {...provided.dragHandleProps} 
                                        >
                                        <Image key={undefined} className={"image_array_image"} id={value} />
                                        <Tooltip title="Delete Image">
                                            <IconButton onClick={() => handleDelete(value)} sx={{ cursor: "pointer", 
                                                                                                    position:'absolute', 
                                                                                                    right:15, bottom: 15, 
                                                                                                    bgcolor: 'primary.main',
                                                                                                    ':hover': {bgcolor: 'primary.main', color: 'white',}
                                                                                                }}>
                                                <DeleteTwoToneIcon />
                                            </IconButton>    
                                        </Tooltip>
                                    </div>
                                )}
                                </Draggable>))
                            }
                            {provided.placeholder}
                            </div>
                        )

                    }
                    </Droppable>
                </DragDropContext>
            ):undefined
        }
        <Box className={error?"image-array-label-file-upload-error":"image-array-label-file-upload "}>
            <DragDropTarget caseId={caseId} fileIdsCallback={(values) => handleDrop(values)} accept="image/*" multiple={true} />
            <div>Drop image here or click to select file.</div>
        </Box>
        </Box>   
    )
}
