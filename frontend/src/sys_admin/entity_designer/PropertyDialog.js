import React, { useState } from 'react';
import { TEXT, MULTILINE_TEXT, DATE, SELECT, SWITCH, DATE_RANGE, DATE_TIME, DATE_TIME_RANGE, typeDescriptionsObjectArray, SELECT_MULTIPLE, PROFILE_IMAGE } from '../../util/PropertyType';
import { getInputComponent } from '../../util/InputComponentFactory';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { validate } from '../../validation/validation';

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

const optionsProp =  { 
    name: 'options', 
    label: 'Options', 
    type: MULTILINE_TEXT, 
    rows: 4,
    value:''
    //disabled: !property, display: (property?.type ==MULTILINE_TEXT)?'none':'initial'
};

const maskProp =     { 
    name: 'mask', 
    label: 'Mask', 
    type: TEXT, 
    required: false,
    value:''
    //disabled: !property, display: (property?.type == TEXT)?'none':'initial'
};

const maxLengthProp = {
        name: 'maxLength', 
        label: 'Max Length', 
        type: TEXT, 
        required: false,
        value:'' 
};

const numLinesProp = { 
    name: 'numLines', 
    label: 'Number of Lines', 
    type: TEXT, 
    required: false,
    value:''
    //disabled: !property, display: (property?.type ==MULTILINE_TEXT)?'none':'initial'
};

const typeProp = { 
    name: 'type', 
    label: 'Property Type', 
    type: SELECT, 
    value: DATE,
    selectData: typeDescriptionsObjectArray
};

const includeInTitle = 
{ 
    name: 'includeInTitle', 
    label: 'Include In Title', 
    type: SWITCH, 
    value: false
};

const includeInList = 
{ 
    name: 'includeInList', 
    label: 'Include In List', 
    type: SWITCH, 
    value: false
};

const includeInTimeline = 
{ 
    name: 'includeInTimeline', 
    label: 'Include In Timeline', 
    type: SWITCH, 
    value: false
};

const fields = 
[
    {   
        name: 'name', 
        label: 'Property Name', 
        type: TEXT, 
        required: true, 
        value:''
        //disabled: !property 
    },
    { 
        name: 'description', 
        label: 'Property Description', 
        type: TEXT, 
        required: false,
        value:''
        //disabled: !property 
    },
    typeProp,
    { 
        name: 'required', 
        label: 'Required', 
        type: SWITCH, 
        value: false
    },    
    includeInList,   
    includeInTitle,
    includeInTimeline,
    numLinesProp,
    maxLengthProp,
    maskProp,
    optionsProp,
    {
        name: 'id',  
        value:''
    },
];
 
export default function PropertyDialog({property, savePropertyFn, closeFn})
{
    const theme = useTheme();
    const [localProperty, setLocalProperty] = useState(property);   

    function saveProperty()
    {
        if (validate(fields))
        {
            savePropertyFn(localProperty);
            closeFn();
        }
        else
        {
            setLocalProperty(old=>({...old}));
        }
    }

    function setPropsEnabledDisabled(type)
    {
        numLinesProp.disabled = true;
        numLinesProp.required = false;
        maxLengthProp.disabled = true;
        maskProp.disabled = true;
        includeInList.disabled = true;
        includeInTitle.disabled = true;
        optionsProp.disabled = true;
        optionsProp.required = false;
        includeInTimeline.disabled = true;
        includeInTimeline.required = false;

        switch (type)
        {
            case TEXT:
                maxLengthProp.disabled = false;
                maxLengthProp.maxLength = 255;
                maxLengthProp.minLength = 0;
                maskProp.disabled = false;
                includeInTitle.disabled = false;
                includeInList.disabled = false;  
                break;
            case MULTILINE_TEXT:
                numLinesProp.disabled = false;
                numLinesProp.required = true;
                maxLengthProp.disabled = false;
                includeInList.disabled = false;
                break;
            case SELECT:
            case SELECT_MULTIPLE:
                optionsProp.disabled = false;
                optionsProp.required = true;
                includeInList.disabled = false;
                break;
            case PROFILE_IMAGE:
                includeInList.disabled = false;
                break;
            case DATE:
            case DATE_RANGE:
            case DATE_TIME:
            case DATE_TIME_RANGE:
                includeInList.disabled = false;
                includeInTimeline.disabled = false;
                break; 
        }
    }
    
    function handleInputChange(event)
    {
        const target = event.target;
        const inputName = target.name;
        const value = (target.type==="checkbox")?target.checked:target.value;

        const temp = {};
        if (inputName === 'type')
        {
            setPropsEnabledDisabled(value);

            temp.numLines = '';
            temp.maxLength = '';    
            temp.mask = '';
            temp.required = false;
            temp.includeInList = false;
            temp.includeInTitle = false;
        }
        
        setLocalProperty((prev) => ({...prev, [inputName]: value, ...temp}));

        // const field = fields.find(field => field.name === inputName);

        // if (field.name == 'type')
        // {
        //     field.value = typeDescriptionsObjectArray.find(type => type.id == event.target.value).id;
        //     setPropsEnabledDisabled();
        // }
        // else
        // {
        //     field.value = value;
        //     validate(fields);
        // }
        // setRender((prev)=>!prev);
    }

    function handleClickSave()
    {
        // savePropertyFn(property);
        // closeFn();
    }  

    setPropsEnabledDisabled(localProperty.type);
    fields.forEach((field) => { 
        field.value = localProperty[field.name];
        field.onChange = handleInputChange;
        // if the id of the property is a number then don't allow the property type to be changed
        if (field.name === 'type')
            field.disabled = typeof property.id === 'number';
    });

    return (
        <Dialog open={true} fullWidth={true}>
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}>{localProperty.name?"Edit Property: " + localProperty.name:"New Property"}</DialogTitle>
            <DialogContent sx={{overflow:'auto', mt:2}}>
                <Box>
                    {
                        fields.slice(0,2).map((field, index) => <Box key={index}>{getInputComponent(field, index)}</Box>)
                    }
                    <Box sx={{ display:'flex', flexDirection:'row' }}>
                    </Box>
                    <Box sx={{ display:'flex', gap:2, flexDirection:'row', paddingTop:"20px"}}>
                        <Box sx={{flexGrow: 1, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <Box>{getInputComponent(fields[2])}</Box>
                            <Box>{getInputComponent(fields[7])}</Box>
                            <Box>{getInputComponent(fields[8])}</Box>
                            <Box>{getInputComponent(fields[9])}</Box>
                        </Box>
                        <Box sx={{flexGrow: 1}}>
                            <Box sx={{width:'100%'}}>{getInputComponent(fields[3])}</Box>
                            <Box sx={{width:'100%'}}>{getInputComponent(fields[4])}</Box>
                            <Box sx={{width:'100%'}}>{getInputComponent(fields[5])}</Box> 
                            <Box sx={{width:'100%'}}>{getInputComponent(fields[6])}</Box>    
                            <Box sx={{ flexGrow:1}}>{getInputComponent(fields[10])}</Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions> 
                <Button type="submit" onClick={saveProperty}>Save</Button>
                <Button onClick={()=>closeFn()}>Cancel</Button>
            </DialogActions>
        </Dialog>
      );
}