import React from "react";
import { Box, Chip, FormHelperText, IconButton, Switch, TextField, Tooltip } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import './InputComponentFactory.css';
import {
    TEXT,
    MULTILINE_TEXT, PASSWORD, CHECKBOX,
    SELECT, SELECT_MULTIPLE, DATE, DATE_RANGE, DATE_TIME, DATE_TIME_RANGE, PROFILE_IMAGE
} from './PropertyType';
import { DesktopDatePicker, DesktopDateTimePicker } from "@mui/x-date-pickers";
import InputMask from "react-input-mask";
import DragDropTarget from "./dragdrop/DragDropTarget";
import ImageArrayInput from "./ImageArrayInput";
import Image from "./Image";

const RETRIEVE_FILE_URL = "/api/file/";

export function getInputComponent(fieldData, key, dispatch)
{
    var {selectData, helperText, visible, caseId, propDefId, ...field} = fieldData;
    const error = field.error || false;
    if (!helperText)
        helperText = ' ';

    if (visible == false)
        return undefined;

    var component = undefined;  

    switch (field.type)
    {
        case TEXT:
        case PASSWORD:
            if (field.mask)
            {
                const {onChange, value, ...rest} = field;
                component = 
                <InputMask
                    key={key}
                    onChange={onChange}
                    value={value || ''}
                    mask={field.mask}
                    disabled={false}
                    maskChar='_'
                    alwaysShowMask
                    >
                    {() => 
                        <FormControl sx={{width:'100%'}}>
                        <TextField 
                            {...rest}
                            key={key}
                            fullWidth
                            size="small"
                            sx={{marginTop:1}} />
                            <FormHelperText id={field.name + "-label"} error={true}>
                                {helperText}
                            </FormHelperText>
                        </FormControl>}
                </InputMask>
            }
            else
                component = 
                    <FormControl sx={{width:'100%'}} key={key}>
                    <TextField 
                        {...field}
                        value={field.value || ''}
                        fullWidth
                        size="small"
                        inputProps={{ maxLength: field.maxLength }}
                        sx={{mt:1, 
                            width:field.width?(field.width + 2) + 'ch':undefined}} />
                        <FormHelperText id={field.name + "-label"} error={true}>
                            {helperText}
                        </FormHelperText>
                    </FormControl>
            break;
        case MULTILINE_TEXT:
            component =
                <FormControl sx={{width:'100%'}} key={key}>
                <TextField  
                    {...field}
                    value={field?.value || ''}
                    multiline
                    fullWidth
                    onChange={field.onChange}
                    size="small"
                    inputProps={{ maxLength: field.maxLength }}
                    sx={{mt:1}}
                />
                <FormHelperText id={field.name + "-label"} error={true}>
                    {helperText}
                </FormHelperText>
                </FormControl>  
            break;  
        case CHECKBOX:
            component =
                <FormControlLabel key={key} control={ <Checkbox  {...field} /> } 
                                    onChange={field.onChange}
                                    checked={ !!field.value ? field.value:false }
                                    sx={{ margin:'auto'}} 
                                    label={field.label}
                />
            break;
        case SELECT:
            component =  
                <FormControl fullWidth={true} size="small" key={key} error={field.error} required={field.required} sx={{mt:1}}>
                    <InputLabel id={field.name + field.id} >{ field.label }</InputLabel>
                    <Select {...field} fullWidth={true} labelId={field.name + field.id} value={field?.value}  sx={{}}>
                    {
                        selectData?.map((item,index) =>
                        (
                            <MenuItem key={item.name} value={item.id}>
                                    <span>{item.name}</span>
                            </MenuItem>
                        ))
                    }
                    </Select>
                    <FormHelperText id={field.name + "-label"} error={true}>
                    {helperText}
                    </FormHelperText>
                </FormControl>
            break;
        case SELECT_MULTIPLE:
            component =
                <FormControl fullWidth={true} size="small" key={key} error={field.error} required={field.required} sx={{mt:1}}>
                    <InputLabel id={field.name + field.id} >{ field.label }</InputLabel>
                    <Select {...field} 
                            multiple 
                            fullWidth={true} 
                            labelId={field.name + field.id} 
                            value={field?.value || []}  
                            renderValue={(selected) => {
                                return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {
                                    selected.map((value) =><Chip key={value} sx={{height:'auto'}} label={selectData.find(item => item.id == value).name} />)
                                }
                                </Box>
                            )}}
                            sx={{}}>
                    {
                        selectData?.map((item,index) =>
                        (
                            <MenuItem key={item.name} value={item.id}>
                                    <span>{item.name}</span>
                            </MenuItem>
                        ))
                    }
                    </Select>
                    <FormHelperText id={field.name + "-label"} error={true}>
                    {helperText}
                    </FormHelperText>
                </FormControl>
            break;
        case 'SWITCH':
            component =
            <FormControlLabel key={key} control={<Switch 
                                disabled={field.disabled}
                                name={field.name} 
                                onChange={field.onChange}/>} 
                                label={field.label}
                                value={true}
                                checked={field.value}/>
            break;
        case DATE:
            component =
                <React.Fragment key={key}>
                    <DesktopDatePicker
                        value={field.value?field.value:null}
                        onChange={field.onChange}
                        disabled={field.disabled}
                        slotProps={{ textField:{    
                            label: field.label,
                            error: field.error,
                            size:'small',
                            helperText:helperText,
                            clearable: true,
                            onClear: () => field.onChange(null),
                            required: field.required
                            },
                            actionBar:{actions:['clear']}
                        }}
                        sx={{width:'25ch', mt:1}}
                    />
                </React.Fragment>
            break;
        case DATE_RANGE:
            field.error || (field.error = [false, false]);
            component =
                <React.Fragment key={key}>
                <Box sx={{}}>
                <Box sx={{ marginBottom:2, borderBottom:1 }}>{field.label}</Box>
                <Box sx={{display:'flex'}}>
                <DesktopDatePicker
                    value={field.value[0]?field.value[0]:null}
                    onChange={field.onChangeStartDate}
                    sx={{width:'25ch'}}
                    disabled={field.disabled}
                    slotProps={{ textField:{    
                        label: "Start Date",
                        error: field.error[0],
                        size:'small',
                        helperText:helperText[0],
                        helperText:helperText[0],
                        clearable: true,
                        onClear: () => field.onChangeStartDate(null),
                        required: field.required
                        },
                        actionBar:{actions:['clear']}
                    }}
                />
                <Box sx={{width:'1ch'}} />
                <DesktopDatePicker
                    value={field.value[1]?field.value[1]:null}
                    onChange={field.onChangeEndDate}
                    sx={{width:'25ch'}}
                    disabled={field.disabled}
                    slotProps={{ textField:{    
                        label: "End Date",
                        error: field.error[1],
                        helperText:helperText[1],
                        size:'small',
                        helperText:helperText[1],
                        clearable: true,
                        onClear: () => field.onChangeEndDate(null),
                        required: field.required
                        },
                        actionBar:{actions:['clear']}
                    }}
                />
                </Box>
                </Box>
                </React.Fragment>
            break;
        case DATE_TIME:
            component =
                    <FormControl sx={{width:'100%'}} key={key} >
                        <DesktopDateTimePicker
                            value={field.value?field.value:null}                   
                            onChange={field.onChange}
                            disabled={field.disabled}
                            slotProps={{ textField:{    
                                label: field.label,
                                error: field.error,
                                helperText:helperText,
                                size:'small',
                                clearable: true,
                                onClear: () => field.onChange(null),
                                required: field.required
                                },
                                actionBar:{actions:['accept','clear']}
                            }}             
                            sx={{width:'30ch', mt:1}}
                        />
                    </FormControl>
            break
        case DATE_TIME_RANGE:
            const error0 = field.error && field?.error[0];
            const error1 = field.error && field?.error[1];
            field.error || (field.error = [false, false]);
            component =
                <Box sx={{}} key={key}>
                    <Box sx={{ marginBottom:2, borderBottom:1 }}>{field.label}</Box>
                        <Box sx={{display: 'flex'}}>
                        <DesktopDateTimePicker
                            value={field.value[0]?field.value[0]:null}
                            onChange={field.onChangeStartDate}
                            disabled={field.disabled}
                            slotProps={{ textField:{    
                                label: "Start Date/Time",
                                error: field.error[0],
                                size:'small',
                                helperText:helperText[0],
                                clearable: true,
                                onClear: () => field.onChangeStartDate(null),
                                required: field.required
                                },
                                actionBar:{actions:['accept','clear']}
                            }}             
                            sx={{width:'30ch', mt:1}}
                        />
                        <div style={{width:'20px'}}/>
                        <DesktopDateTimePicker
                            value={field.value[1]?field.value[1]:null}
                            onChange={field.onChangeEndDate}
                            disabled={field.disabled}
                            slotProps={{ textField:{    
                                label: "End Date/Time", 
                                error: field.error[1],
                                size:'small',
                                helperText:helperText[1],
                                clearable: true,
                                onClear: () => field.onChangeEndDate(null),
                                required: field.required
                                },
                                actionBar:{actions:['accept','clear']}
                            }}             
                            sx={{width:'30ch', mt:1}}
                        />
                    </Box>
                </Box>
            break;
        case PROFILE_IMAGE:
            component = 
                <Box sx={{mt:3}} key={key}>
                {
                    field?.value?
                    (
                    <Box id="profile_image_container" sx={{display:'inline-block'}}>
                        <DragDropTarget fileIdsCallback={(id)=>field.onChange(id)} caseId={caseId} multiple={false} dispatch={dispatch}/>
                        <Image id={field.value} className="label-profile-image"/>
                        <Tooltip title="Delete Image">
                            <IconButton onClick={()=>field.onChange(undefined)} sx={{ cursor: "pointer", 
                                position:'absolute', 
                                right:15, bottom: 15, 
                                bgcolor: 'primary.main',
                                zIndex: 10002,
                                ':hover': {bgcolor: 'primary.main', color: 'white',}
                            }}>
                                <DeleteTwoToneIcon />
                            </IconButton>    
                        </Tooltip>
                    </Box>
                    ):
                    (
                    <Box className={error?"error-label-file-upload":"label-file-upload"}  sx={{float:'right'}}>
                        <DragDropTarget fileIdsCallback={(id)=>field.onChange(id)} caseId={caseId} accept="image/*" multiple={false} dispatch={dispatch}/>

                            <Box sx={{textAlign:'center', width:'100%'}}>Drop profile image here</Box>
                            <Box sx={{textAlign:'center', width:'100%'}}>or click to select file.</Box>
                            <Box sx={{textAlign:'center', width:'100%', position:'absolute',bottom:0}}>
                                <FormControl sx={{width:'100%'}} key={key}>
                                    <FormHelperText id={field.name + "-label"} error={true} sx={{textAlign:'center'}}>
                                    {helperText}
                                </FormHelperText>
                            </FormControl>
                            </Box>
                    </Box>
                    )
                }
                </Box>
            break;  
        case 'IMAGE_ARRAY':
            component = <ImageArrayInput field={field} caseId={caseId} key={key}/>;

    }

    return component
}