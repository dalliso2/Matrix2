import { DialogContent } from "@mui/material";
import React from "react";
import { useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { getInputComponent } from "../util/InputComponentFactory";
import {
    TEXT,
    MULTILINE_TEXT,
    PROFILE_IMAGE,
    IMAGE_ARRAY,
    DATE,
    DATE_RANGE,
    DATE_TIME,
    DATE_TIME_RANGE,
    CHECKBOX,
    SELECT,
    SELECT_MULTIPLE,
    ADDRESS_US
} from '../util/PropertyType';
import dayjs from 'dayjs';
import { Button, DialogActions } from "@mui/material";
import { useStoreEntityMutation } from "../api/EntityApi";
import { handleMutationResults } from "../api/ApiUtils";
import { useDispatch } from "react-redux";
import { validate } from "../validation/validation";
import { useSelector } from "react-redux";
import { selectActiveCase, updateEntityTabTitle } from "../state/AppSlice";
import { getTitle } from "../util/utils";
import { enqueueSnackbar } from "notistack";
import { useTheme } from "@emotion/react";

function getFields(entityDefinition)
{
    if (!entityDefinition)
        return undefined;

    return entityDefinition.props.filter(prop=>!prop.deleted).map((propDef) =>
    {
        const newField = {};
        newField.propDefId = propDef.id,
        newField.name = propDef.id.toString();
        newField.label = propDef.name;
        newField.required = propDef.required;
        newField.maxLength = propDef.maxLength;
        newField.type = propDef.type;
        newField.mask = propDef.mask;
        newField.value = undefined;
        switch (propDef.type)
        {
            case TEXT:
                break;
            case MULTILINE_TEXT: 
                newField.multiline = true;
                newField.rows = propDef.numLines;
                break;
            case PROFILE_IMAGE: 
                break;
            case IMAGE_ARRAY: 
                newField.value = [];
                break; 
            case DATE:
                break;
            case DATE_RANGE: 
                newField.value = new Array(2);  
                break; 
            case DATE_TIME: 
                break; 
            case DATE_TIME_RANGE: 
                newField.value = [new Array(2)];
                break;
            case CHECKBOX: 
                break;
            case SELECT: 
                newField.selectData = propDef.options.split("\n").map(prop => ({id:prop,name:prop}));
                break;
            case SELECT_MULTIPLE:
                newField.value = [];
                newField.selectData = propDef.options.split("\n").map(prop => ({id:prop,name:prop}));
                break;
            case ADDRESS_US: 
                newField.value = new Array(5).fill('');
                break;
        }
        
        return newField;
    });
}

function setValue(setEntityProps, entityId, propDefId, valOrder, value)
{
    setEntityProps(prevData => {
        console.log(prevData);
        const newData = JSON.parse(JSON.stringify(prevData));
        const prop = newData.find((element) => element.propertyDefinition === propDefId && element.valOrder === valOrder);
        if (prop)
            prop.value = value;
        else
            newData.push({id:entityId, propertyDefinition: propDefId, valOrder: valOrder, value:value});

        return newData;
    });
}

export default function AddEditEntityDialog({entity, entityDefinitions, closeFn, entityUpdatedCallback})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const [selectedEntityDefId, setSelectedEntityDefId] = useState(entity && entity.entityDefinition);
    const [entityProps, setEntityProps] = useState(entity && entity.propertyValues || []);
    const [reRender, setReRender] = useState(false);
    const activeCase = useSelector(selectActiveCase);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    // generate field array for entity definition
    const fields = useMemo(() => getFields(entityDefinitions.find(def=>def.id === selectedEntityDefId)), [selectedEntityDefId]);

    // mutation to store entityselectedEntityDefId
    const [storeEntity,entityMutationState] = useStoreEntityMutation();
    handleMutationResults(entityMutationState, 
                            dispatch, 
                            ()=>{ enqueueSnackbar( (entity?.id?"Updated ":"Created ") + " entity " + getTitle(entityDefinitions,entityMutationState.data), {variant:'success'}); closeFn();});

    fields?.forEach(field => {
        if (field.type === IMAGE_ARRAY || field.type === SELECT_MULTIPLE || field.type === ADDRESS_US)
            field.value = [];
    });

    console.log(entityProps);
    // set the field values from the entity object
    entityProps && entityProps.forEach(element => {
        const field = fields.find(e=>e.propDefId===element.propertyDefinition);
        if (field)
        {
            switch (field.type)
            {
                case DATE:
                case DATE_TIME:
                    field.value = element.value && dayjs(element.value);
                    break;
                case DATE_RANGE:
                case DATE_TIME_RANGE:
                    field.value[element.valOrder] = element.value && dayjs(element.value);
                    break;
                case IMAGE_ARRAY:
                case SELECT_MULTIPLE:
                    field.value[element.valOrder] = element.value;
                    break;
                case ADDRESS_US:
                    field.value[element.valOrder] = element.value;
                    break;
                default:
                    field.value = element.value;
                    break;
            }
        }
    });

    fields && fields.forEach((field, index) => {
        switch (field.type)
        {
            case TEXT:
            case MULTILINE_TEXT:
            case SELECT:
                field.onChange = (event) => setValue(setEntityProps, field.id, field.propDefId, 0, event.target.value);
                break;
            case DATE:  
            case DATE_TIME:
                // val is a dayjs object
                field.onChange = (val) => setValue(setEntityProps, field.id, field.propDefId, 0, val.format());
                break;
            case DATE_RANGE:
            case DATE_TIME_RANGE:
                // val is a dayjs object
                field.onChangeStartDate = (val) => setValue(setEntityProps, field.id, field.propDefId, 0, val?.format());
                field.onChangeEndDate = (val) => setValue(setEntityProps, field.id, field.propDefId, 1, val?.format());
                break;
            case PROFILE_IMAGE:
                field.caseId = activeCase.id;
                field.onChange = (val) => setValue(setEntityProps, field.id, field.propDefId, 0, val);
                break;
            case IMAGE_ARRAY:
                field.caseId = activeCase.id;
                field.onChange = (val) => {
                    setEntityProps(prevData => {
                        const prevDataCopy = (prevData && prevData.map((element) => ({...element}))) || [];
                        const newData = prevDataCopy.filter(element => element.propertyDefinition !== field.propDefId);
                        val.forEach((imageId, index) => {
                            newData.push({id:field.id, propertyDefinition: field.propDefId, valOrder: index, value:imageId});
                        })
                        return newData;
                    });
                }
                break;
            case SELECT_MULTIPLE:
                field.onChange = (event) => {
                    const val = event.target.value;
                    setEntityProps(prevData => {
                        const prevDataCopy = JSON.parse(JSON.stringify(prevData)).filter(element => element.propertyDefinition !== field.propDefId);
                        val.forEach((selectVal, index) => {
                            prevDataCopy.push({id:field.id, propertyDefinition: field.propDefId, valOrder: index, value:selectVal});
                        })
                        return prevDataCopy;
                    });
                }
                break;
            case ADDRESS_US:
                field.onChangeStreet1 = (event) => setValue(setEntityProps, field.id, field.propDefId, 0, event.target.value);
                field.onChangeStreet2 = (event) => setValue(setEntityProps, field.id, field.propDefId, 1, event.target.value);
                field.onChangeCity = (event) => setValue(setEntityProps, field.id, field.propDefId, 2, event.target.value);
                field.onChangeState = (event) => setValue(setEntityProps, field.id, field.propDefId, 3, event.target.value);
                field.onChangeZip = (event) => setValue(setEntityProps, field.id, field.propDefId, 4, event.target.value);
                break;
            default:
                field.onChange = (val) => setValue(setEntityProps, field.id, field.propDefId, 0, val);
                break;
        }
    });

    function save()
    {
        setButtonsDisabled(true);
        if (validate(fields))
        {
            const e = {id:entity?.id, matrixCase: activeCase.id, entityDefinition: selectedEntityDefId, propertyValues:entityProps};
            storeEntity(e);
            dispatch(updateEntityTabTitle({entityId:e.id,title:getTitle(entityDefinitions,e)}));
            if (entityUpdatedCallback)
            {
                e.__title = getTitle(entityDefinitions,e);
                entityUpdatedCallback(e);
            }
        }
        else
        {
            setButtonsDisabled(false);
            setReRender(!reRender);
        }
    }

    const imageFields = fields && fields.filter(field => field.type == PROFILE_IMAGE || field.type == IMAGE_ARRAY);
    const nonImageFields = fields && fields.filter(field => field.type != PROFILE_IMAGE && field.type != IMAGE_ARRAY);

    console.log(entityProps);
    return (
        <Dialog open={true}  maxWidth={'md'} fullWidth={!!selectedEntityDefId} sx={{height:'100%'}}>
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText, 
                                borderColor: theme.palette.background.default, }}>Add/Edit Entity</DialogTitle>
            <DialogContent>
                { !selectedEntityDefId &&
                <FormControl fullWidth={true} size="small" sx={{mt:1, flexGrow:1}}>
                    <InputLabel id={'entity_type_select'} >Entity Type</InputLabel>
                    <Select label={'Entity Type'} value={selectedEntityDefId || ''} labelId={'entity_type_select'} onChange={event=>setSelectedEntityDefId(event.target.value)}>
                    {
                        [{id:0,name:''}].concat(entityDefinitions).map((item,index) =>
                        (
                            <MenuItem key={index} value={item.id}>
                                    <span>{item.name}</span>
                            </MenuItem>
                        ))
                    }
                    </Select>
                </FormControl>
                }
                <Collapse in={!!selectedEntityDefId}>
                { 
                    fields && 
                        <Box sx={{display:'flex',mt:2}}>
                        {
                        fields &&
                            <Box sx={{display:'flex', gap: '30px', width:'100%', justifyContent:'space-around'}}>
                                <Box sx={{}}> 
                                { 
                                    nonImageFields.map((field,index) => 
                                    (
                                        <Box key={index} sx={{m:0,}}>{getInputComponent(field, index)}</Box>
                                    )) 
                                }
                                </Box>
                                {
                                    imageFields.length > 0 && 
                                        <Box sx={{display:'flex', flexGrow:1, flexDirection:'column', alignContent:'flex-start', alignItems:'center'}}>
                                        { imageFields.map((field,index) => getInputComponent(field, index, dispatch)) }
                                        </Box>
                                }
                            </Box>
                        }
                        </Box>
                }
                </Collapse>
            </DialogContent>
            <DialogActions>
                <Button disabled={buttonsDisabled} onClick={() => save()}>Save</Button>
                <Button disabled={buttonsDisabled} onClick={() => closeFn()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}