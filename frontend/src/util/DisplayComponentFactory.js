/**
 *      Utility functions that return React components to display values
 *      based on types defined in PropertyType.js
 */

/////////// React imports //////////
import React from "react";
/////////// MUI imports //////////
import Box from "@mui/material/Box";
import dayjs from "dayjs";
//import { RETRIEVE_FILE_URL } from "../../api/file";
import {
    TEXT,
    MULTILINE_TEXT,
    PROFILE_IMAGE,
    IMAGE_ARRAY,
    DATE,
    DATE_RANGE,
    DATE_TIME,
    DATE_TIME_RANGE, SELECT,
    SELECT_MULTIPLE
} from './PropertyType';
import { getDateString, getDateTimeString } from './utils';
//import './Entity.css';
import { Table, TableCell, TableRow } from "@mui/material";
import Image from "./Image";

const RETRIEVE_FILE_URL = "/api/file/";

const dateFormat = 'MM/DD/YYYY';
const dateTimeFormat = 'MM/DD/YYYY hh:mm:ss';

export const tableCellStyle = {display: 'revert', border:'none', p:1, whiteSpace: 'nowrap'};
export const tableCellBoldStyle ={...tableCellStyle, fontWeight:'bold'};

export function getFieldDisplay(propertyDefinition, prop, index)
{
    console.log("getFieldDisplay: ", propertyDefinition, prop, index);
    let component = undefined;
    
    if (prop)
        switch(propertyDefinition.type)
        {
            case TEXT:
            case SELECT:
                component = 
                    (<TableRow key={propertyDefinition.id}><TableCell sx={tableCellBoldStyle}>{propertyDefinition.name}:</TableCell><TableCell sx={tableCellStyle}>{prop?.values[0]}</TableCell></TableRow>);
                // component = 
                //     prop.values.length?
                //     (<tr key={index}><td className="td-no-wrap td-bold" >{propertyDefinition.name}:</td><td>{prop?.values[0]}</td></tr>)
                //     :(<tr><td></td><td></td></tr>);
                break;
            case SELECT_MULTIPLE:
                component =
                    (<TableRow key={propertyDefinition.id}><TableCell sx={tableCellBoldStyle}>{propertyDefinition.name}:</TableCell><TableCell sx={tableCellStyle}>{prop?.values.join(', ')}</TableCell></TableRow>);
                    break;
            case PROFILE_IMAGE:
                component = (
                    <Box key={index} id="profile_image_container">
                        {
                            prop?.values?.length && prop.values[0]?
                            (
                                <Image key={propertyDefinition.id} className={"label-profile-image"} id={prop.values[0]} />
                            ):
                            (
                                <Box className="entity-profile-image-empty">
                                    <Box className="">No Photo Uploaded</Box>
                                </Box>
                            )
                        }
                    </Box>
                );
                break;
            case MULTILINE_TEXT:
                console.log("MULTILINE_TEXT: ", prop?.values[0]);
                component = 
                    (<TableRow key={propertyDefinition.id}>
                        <TableCell  sx={{...tableCellBoldStyle, verticalAlign:'top'}}>{propertyDefinition.name}:</TableCell>
                        <TableCell  sx={tableCellStyle}><div style={{ overflow: 'auto', width:'100%', whiteSpace:'pre', textWrap:'wrap' }}>{prop?.values[0]}</div></TableCell>
                    </TableRow>)                      
                break;
                // component = 
                // prop.values.length?
                // (<tr key={index}><TableCell className="td-no-wrap td-bold">{propertyDefinition.name}:</TableCell><TableCell><div style={{ height: (propertyDefinition.numLines * 1.5) + 'rem', overflow: 'auto', width:'100%', textWrap:'pretty' }}>{prop?.values[0]}</div></TableCell></tr>)
                // :(<tr><TableCell></TableCell><TableCell></TableCell></tr>);                        
                // break;
            case IMAGE_ARRAY:
                component = (
                    <div key={propertyDefinition.id} style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    {
                        (prop.values && prop.values.length)?
                        prop.values.map((value,index2) => (<Image key={index + index2} className={"entity-array-image"} id={value} />))
                        :(<Box className="entity-array-image-empty"><div>No Photo Uploaded</div></Box>)
                    }
                    </div>
                )
                break;
            case DATE:
                const date = prop.values[0]?dayjs(prop.values[0]).format(dateFormat):'';
                component = 
                    (<TableRow key={propertyDefinition.id}><TableCell sx={tableCellBoldStyle}>{propertyDefinition.name}:</TableCell><TableCell sx={tableCellStyle}>{date}</TableCell></TableRow>);
                break;
            case DATE_RANGE:
                const startDate = prop.values[0]?dayjs(prop.values[0]).format(dateFormat):'';
                const endDate = prop.values[1]?dayjs(prop.values[1]).format(dateFormat):'';
                component = 
                    (<TableRow key={propertyDefinition.id}>
                        <TableCell sx={tableCellBoldStyle}>{propertyDefinition.name}:</TableCell>
                        <TableCell sx={tableCellStyle}>
                            <Box>
                                {startDate} - {endDate}
                            </Box>
                        </TableCell>
                    </TableRow>);
                break;
            case DATE_TIME:
                const dateTime = prop.values[0]?dayjs(prop.values[0]).format(dateTimeFormat):'';
                component = 
                    (<TableRow key={propertyDefinition.id}><TableCell sx={tableCellBoldStyle}>{propertyDefinition.name}:</TableCell><TableCell sx={tableCellStyle}>{dateTime}</TableCell></TableRow>);
                break;
            case DATE_TIME_RANGE:
                const startDateTime = prop.values[0]?dayjs(prop.values[0]).format(dateTimeFormat):'';
                const endDateTime = prop.values[1]?dayjs(prop.values[1]).format(dateTimeFormat):'';
                
                component = 
                    (<TableRow key={propertyDefinition.id}>
                        <TableCell sx={tableCellBoldStyle}>{propertyDefinition.name}:</TableCell>
                        <TableCell sx={tableCellStyle}>
                            <Box>
                                {startDateTime} - {endDateTime}
                            </Box>
                        </TableCell>
                    </TableRow>);
                break;
        }
    else
        component = (<TableRow key={propertyDefinition.id}><TableCell sx={tableCellBoldStyle} >{propertyDefinition.name}:</TableCell><TableCell sx={tableCellStyle}>&nbsp;</TableCell></TableRow>);

    return component;
}

/**
 * getListComponent returns a react component to display the value in a table cell based on the type
 * @param {*} type - type of data, listed in PropertyType.js
 * @param {*} values - array containing values to display.  Some types require two values, such
 *                      as a DATE_RANGE
 * @returns 
 */
export function getListComponent(type, values)
{
    let returnVal = undefined;
    if (values?.length)
    {
        switch(type)
        {
            case PROFILE_IMAGE:
                returnVal = values.length &&
                            (
                                <Box key={type} style={{width:'100%', display:'flex', justifyContent:'center'}}>
                                    <Image key={undefined} className={"list-image"} id={values[0]} />
                                </Box>
                            );
                break;
            case IMAGE_ARRAY:
                returnVal = !!values && values.length > 0 && 
                            (
                                <Box key={type} style={{width:'100%', display:'flex', justifyContent:'center'}}>
                                    <Image key={undefined} className={"list-image"} id={values[0]} />
                                </Box>
                            );
                break;
            case DATE:
                returnVal = ( <Box key={type}>{getDateString(values[0])}</Box> );            
                break; 
            case DATE_RANGE:
                    if (values.length > 1)
                        returnVal =  (
                            <Box key={type}>
                                <Box sx={{whiteSpace:"nowrap"}}>Begin: {getDateString(values[0])}</Box>
                                <Box sx={{whiteSpace:"nowrap"}}>End: {getDateString(values[1])}</Box>
                            </Box>
                    );
                break; 
            case DATE_TIME:
                    returnVal = (<Box  key={type} sx={{whiteSpace:"nowrap"}}>{getDateTimeString(values[0])}</Box>);
                break; 
            case DATE_TIME_RANGE:
                    if (values.length > 1) 
                        returnVal = (
                            <Table>
                                <TableRow>
                                    <TableCell sx={{...tableCellBoldStyle, whiteSpace:"nowrap"}}>Start:</TableCell><TableCell sx={tableCellStyle}>{getDateTimeString(values[0])}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{...tableCellBoldStyle, whiteSpace:"nowrap"}}>End:</TableCell><TableCell sx={tableCellStyle}>{getDateTimeString(values[1])}</TableCell>
                                </TableRow>
                            </Table>
                    );      
                break;
            case SELECT_MULTIPLE:
                    returnVal = (<Box key={type}>{values.join(', ')}</Box>);   
                    break;
            default:
                    returnVal =  (<Box key={type}>{values[0]}</Box>);
                    break;    
        }
    }   
    return returnVal;
}