import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DragHandleTwoTone from '@mui/icons-material/DragHandleTwoTone';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import AvatarGroup from '@mui/material/AvatarGroup';
import TextFieldsTwoToneIcon from '@mui/icons-material/TextFieldsTwoTone';
import NotesTwoToneIcon from '@mui/icons-material/NotesTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';

import {
    TEXT,
    MULTILINE_TEXT,
    PROFILE_IMAGE,
    IMAGE_ARRAY,
    DATE,
    DATE_RANGE,
    DATE_TIME,
    DATE_TIME_RANGE,
    typeDescriptionsMap
} from '../../util/PropertyType';

const dateTimeIcon = (<Avatar><CalendarMonthTwoToneIcon sx={{position:"absolute", top: 2, left: 2}} />
                        <AccessTimeTwoToneIcon sx={{position:"absolute", bottom: 2, right: 2}}/></Avatar>);

const Property = ({property, dragHandleProps, setEditProperty, removeProperty, updateProp}) =>
{
    let icon1 = undefined;
    let icon2 = undefined;
    let description = "Type: " + typeDescriptionsMap.get(property.type) + "  Required: " + property.required;

    switch (property.type)
    {
        case TEXT:
            icon1 = (<TextFieldsTwoToneIcon />);
            description += ";  Max length: " + property.maxLength + ";  Mask: " + property.mask;
            break;
        case MULTILINE_TEXT:
            icon1 = (<NotesTwoToneIcon />);
            description += ";  Max length: " + property.maxLength + ";  Number of Lines: " + property.numLines;
            break;
        case DATE:
            icon1 = (<CalendarMonthTwoToneIcon />);
            break;
        case DATE_TIME:
            icon1 = dateTimeIcon;
            break;
        case DATE_RANGE:
            icon1 = (<CalendarMonthTwoToneIcon />);
            icon2 = (<CalendarMonthTwoToneIcon />);
            break;
        case DATE_TIME_RANGE:
            icon1 = dateTimeIcon;
            icon2 = dateTimeIcon;
            break;
        case PROFILE_IMAGE:
            icon1 = (<InsertPhotoTwoToneIcon />);
            break;
        case IMAGE_ARRAY:
            icon1 = (<InsertPhotoTwoToneIcon />);
            icon2 = (<InsertPhotoTwoToneIcon />);
    }

    icon1 = (<Avatar>{icon1}</Avatar>);
    if (icon2)
        icon2 = (<Avatar>{icon2}</Avatar>);
    else
        icon2 = (<Avatar sx={{visibility: "hidden"}} ><CalendarMonthTwoToneIcon /></Avatar>);

    return (
        <ListItem 
            sx={{}}
            children=
            {
                (
                    [<AvatarGroup spacing="small">
                            {icon1}
                            {icon2}
                    </AvatarGroup>,
                    <ListItemText>
                        <div style={{paddingLeft:"10px"}}>
                            <div style={{width:"18ch", wordBreak:"break-all"}}>
                                <Typography variant="h6" >{property.name}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle1" sx={{ width:"25ch", wordBreak:"break-word"}}>{property.description}</Typography>
                            </div>
                            <div>
                                <Typography variant="subtitle2" sx={{ width:"25ch", wordBreak:"break-word"}}>Type: {typeDescriptionsMap.get(property.type)}</Typography>
                            </div>
                            <div> 
                                <Typography variant="subtitle2" sx={{ width:"25ch", wordBreak:"break-word"}}>Required: {"" + property.required}</Typography>
                            </div>
                            {
                                (property.maxLength) &&
                                <div>
                                    <Typography variant="subtitle2" sx={{ width:"25ch", wordBreak:"break-word"}}>Max length: {property.maxLength}</Typography>
                                </div>
                            }
                            {
                                (property.numLines) &&
                                <div>
                                    <Typography variant="subtitle2" sx={{ width:"25ch", wordBreak:"break-word"}}>Max length: {property.numLines}</Typography>
                                </div>
                            }                            
                            {
                                (property.mask) &&
                                <div>
                                    <Typography variant="subtitle2" sx={{ width:"25ch", wordBreak:"break-word"}}>Mask: {property.mask}</Typography>
                                </div>
                            }
                        </div>
                    </ListItemText>]
                )
            }
            secondaryAction={
                <div>
                    <IconButton edge="end" aria-label="edit" onClick={()=>setEditProperty(property)}>
                        <EditTwoTone />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete"  onClick={()=>removeProperty()}>
                        <DeleteTwoTone />
                    </IconButton>
                    <IconButton edge="end" aria-label="drag" {...dragHandleProps}>
                        <DragHandleTwoTone />
                    </IconButton>
                </div>
            }/>
    );
}

export default Property;