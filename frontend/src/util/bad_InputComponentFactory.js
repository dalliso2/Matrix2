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
    SELECT, SELECT_MULTIPLE, DATE, DATE_RANGE, DATE_TIME, DATE_TIME_RANGE, PROFILE_IMAGE,
    LAT_LONG,
    ADDRESS_US
} from './PropertyType';
import { DesktopDatePicker, DesktopDateTimePicker } from "@mui/x-date-pickers";
import InputMask from "react-input-mask";
import DragDropTarget from "./dragdrop/DragDropTarget";
import ImageArrayInput from "./ImageArrayInput";
import Image from "./Image";

const RETRIEVE_FILE_URL = "/api/file/";

export function getInputComponent(fieldData, key, dispatch)
{
    var {   type, id, propDefId, name, label, caseId, value, disabled, visible, required, 
            maxLength, selectData, helperText, multiLine, rows, width, mask,
            onChange, onChangeEndDate, onChangeStartDate,
             ...field} = fieldData;
         
    if (visible == false)
        return undefined;

    const error = field.error || false;
    if (!helperText)
        helperText = ' ';

    var component = undefined;  

    switch (type)
    {
        case TEXT:
        case PASSWORD:
            if (mask)
            {
                //const {onChange, value, ...rest} = field;
                component = 
                <InputMask
                    key={key}
                    onChange={onChange}
                    value={value || ''}
                    mask={mask}
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
                            <FormHelperText id={name + "-label"} error={true}>
                                {helperText || ' '}
                            </FormHelperText>
                        </FormControl>}
                </InputMask>
            }
            else
                component = 
                    <FormControl sx={{width:'100%'}} key={key}>
                    <TextField 
                        {...field}
                        value={value || ''}
                        fullWidth
                        size="small"
                        inputProps={{ maxLength: maxLength }}
                        sx={{mt:1, 
                            width:width?(width + 2) + 'ch':undefined}} />
                        <FormHelperText id={name + "-label"} error={true}>
                            {helperText || ' '}
                        </FormHelperText>
                    </FormControl>
            break;
        case MULTILINE_TEXT:
            component =
                <FormControl sx={{width:'100%', flexGrow:1, display:'flex', flexDirection:'column',}} key={key}>
                <TextField  
                    {...field}
                    value={field?.value || ''}
                    multiline
                    fullWidth
                    onChange={onChange}
                    size="small"
                    inputProps={{ maxLength: maxLength,}}
                    sx={{mt:1, flexGrow:1}}
                />
                <FormHelperText id={name + "-label"} error={true}>
                    {helperText || ' '}
                </FormHelperText>
                </FormControl>  
            break;  
        case CHECKBOX:
            component =
                <FormControlLabel key={key} control={ <Checkbox  {...field} /> } 
                                    onChange={onChange}
                                    checked={ !!value ? value:false }
                                    sx={{ margin:'auto'}} 
                                    label={label}
                />
            break;
        case SELECT:
            component =  
                <FormControl fullWidth={true} size="small" key={key} error={error} required={required} sx={{mt:1}}>
                    <InputLabel id={name + id} >{ label }</InputLabel>
                    <Select {...field} fullWidth={true} labelId={name + id} value={field?.value}  sx={{}}>
                    {
                        selectData?.map((item,index) =>
                        (
                            <MenuItem key={item.name + key} value={item.id}>
                                    <span>{item.name}</span>
                            </MenuItem>
                        ))
                    }
                    </Select>
                    <FormHelperText id={name + "-label"} error={true}>
                    {helperText || ' '}
                    </FormHelperText>
                </FormControl>
            break;
        case SELECT_MULTIPLE:
            component =
                <FormControl fullWidth={true} size="small" key={key} error={error} required={required} sx={{mt:1}}>
                    <InputLabel id={name + id} >{ label }</InputLabel>
                    <Select {...field} 
                            multiple 
                            fullWidth={true} 
                            labelId={name + id} 
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
                    <FormHelperText id={name + "-label"} error={true}>
                    {helperText || ' '}
                    </FormHelperText>
                </FormControl>
            break;
        case 'SWITCH':
            component =
            <FormControlLabel key={key} control={<Switch 
                                disabled={disabled}
                                name={name} 
                                onChange={onChange}/>} 
                                label={label}
                                value={true}
                                checked={value}/>
            break;
        case DATE:
            component =
                <React.Fragment key={key}>
                    <DesktopDatePicker
                        value={value?value:null}
                        onChange={onChange}
                        disabled={disabled}
                        slotProps={{ textField:{    
                            label: label,
                            error: error,
                            size:'small',
                            helperText:helperText || ' ',
                            clearable: true,
                            onClear: () => onChange(null),
                            required: required
                            },
                            actionBar:{actions:['clear']}
                        }}
                        sx={{width:'25ch', mt:1}}
                    />
                </React.Fragment>
            break;
        case DATE_RANGE:
            //error || (error = [false, false]);
            component =
                <React.Fragment key={key}>
                <Box sx={{}}>
                <Box sx={{ marginBottom:2, borderBottom:1 }}>{field.label}</Box>
                <Box sx={{display:'flex'}}>
                <DesktopDatePicker
                    value={value[0]?value[0]:null}
                    onChange={onChangeStartDate}
                    sx={{width:'25ch'}}
                    disabled={disabled}
                    slotProps={{ textField:{    
                        label: "Start Date",
                        error: error && error[0],
                        size:'small',
                        helperText:helperText[0] || ' ',
                        clearable: true,
                        onClear: () => onChangeStartDate(null),
                        required: required
                        },
                        actionBar:{actions:['clear']}
                    }}
                />
                <Box sx={{width:'1ch'}} />
                <DesktopDatePicker
                    value={value[1]?value[1]:null}
                    onChange={onChangeEndDate}
                    sx={{width:'25ch'}}
                    disabled={disabled}
                    slotProps={{ textField:{    
                        label: "End Date",
                        error: error && error[1],
                        size:'small',
                        helperText:helperText[1] || ' ',
                        clearable: true,
                        onClear: () => onChangeEndDate(null),
                        required: required
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
                            value={value?value:null}                   
                            onChange={onChange}
                            disabled={disabled}
                            slotProps={{ textField:{    
                                label: label,
                                error: error,
                                helperText:helperText || ' ',
                                size:'small',
                                clearable: true,
                                onClear: () => onChange(null),
                                required: required
                                },
                                actionBar:{actions:['accept','clear']}
                            }}             
                            sx={{width:'30ch', mt:1}}
                        />
                    </FormControl>
            break
        case DATE_TIME_RANGE:
            // const error0 = error && field?.error[0];
            // const error1 = error && field?.error[1];
            // error || (error = [false, false]);
            component =
                <Box sx={{}} key={key}>
                    <Box sx={{ marginBottom:2, borderBottom:1 }}>{label}</Box>
                        <Box sx={{display: 'flex'}}>
                        <DesktopDateTimePicker
                            value={value[0]?value[0]:null}
                            onChange={onChangeStartDate}
                            disabled={disabled}
                            slotProps={{ textField:{    
                                label: "Start Date/Time",
                                error: error && error[0],
                                size:'small',
                                helperText:helperText[0] || ' ',
                                clearable: true,
                                onClear: () => onChangeStartDate(null),
                                required: required
                                },
                                actionBar:{actions:['accept','clear']}
                            }}             
                            sx={{width:'30ch', mt:1}}
                        />
                        <div style={{width:'20px'}}/>
                        <DesktopDateTimePicker
                            value={value[1]?value[1]:null}
                            onChange={onChangeEndDate}
                            disabled={disabled}
                            slotProps={{ textField:{    
                                label: "End Date/Time", 
                                error: error && error[1],
                                size:'small',
                                helperText:helperText[1] || ' ',
                                clearable: true,
                                onClear: () => onChangeEndDate(null),
                                required: required
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
                        <DragDropTarget fileIdsCallback={(id)=>onChange(id)} caseId={caseId} multiple={false} dispatch={dispatch}/>
                        <Image id={value} className="label-profile-image"/>
                        <Tooltip title="Delete Image">
                            <IconButton onClick={()=>onChange(undefined)} sx={{ cursor: "pointer", 
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
                        <DragDropTarget fileIdsCallback={(id)=>onChange(id)} caseId={caseId} accept="image/*" multiple={false} dispatch={dispatch}/>

                            <Box sx={{textAlign:'center', width:'100%'}}>Drop profile image here</Box>
                            <Box sx={{textAlign:'center', width:'100%'}}>or click to select file.</Box>
                            <Box sx={{textAlign:'center', width:'100%', position:'absolute',bottom:0}}>
                                <FormControl sx={{width:'100%'}} key={key}>
                                    <FormHelperText id={name + "-label"} error={true} sx={{textAlign:'center'}}>
                                    {helperText || ' '}
                                </FormHelperText>
                            </FormControl>
                            </Box>
                    </Box>
                    )
                }
                </Box>
            break;  
        case 'IMAGE_ARRAY':
            component = <ImageArrayInput    value={value} 
                                            onChange={onChange} 
                                            error={error} 
                                            caseId={caseId} 
                                            key={key}/>;
            break;
        case LAT_LONG:
            break;
        case ADDRESS_US:
            console.log(field);
            console.log(helperText)
            if (!Array.isArray(helperText))
                helperText = new Array(5);
            component =       
                <Box>            
                {
                    ['Street1', 'Street2', 'City', 'State', 'Zip'].map((addressPart,index) => 
                        <Box>
                        <FormControl sx={{}} key={key}>
                            <TextField 
                                label={addressPart}
                                onChange={field['onChange' + addressPart]}
                                value={value[index] || ''}
                                size="small"
                                inputProps={{ maxLength: 75 }}
                                sx={{mt:1, width:'77 ch'}} />
                            <FormHelperText id={name + "-label"} error={true}>
                                {helperText[index] || ' '}
                            </FormHelperText>
                        </FormControl>
                        </Box>
                )
                }
                </Box>;
            break;
    }

    return component
}