import React from "react";
import { Box } from "@mui/material";
import { MULTILINE_TEXT, TEXT, SWITCH } from "../../util/PropertyType";
import { getInputComponent } from "../../util/InputComponentFactory";
import { clearErrors, validate } from "../../validation/validation";

const nameProp = { name: 'name', label: 'Name',type: TEXT,required: true, required:true, value: '',};
const descriptionProp = { name: 'description', label: 'Description',type: MULTILINE_TEXT,rows: 8,required: false,value: ''};
const includeInLinkChartProp = { name: 'includeInLinkChart', label: 'IncludeInLinkChart',type: SWITCH,required: true, value: false};

export default function EntityDefinitionBasic({entityDefinition, setName, setDescription, setIncludeInLinkChart, validateFields    })
{
    nameProp.disabled = descriptionProp.disabled = includeInLinkChartProp.disabled = !entityDefinition;
    descriptionProp.onChange = (event) => setDescription(event.target.value);
    nameProp.onChange = (event) => setName(event.target.value); 
    includeInLinkChartProp.onChange = (event) => setIncludeInLinkChart(event.target.checked);

    nameProp.value = entityDefinition?.name || '';
    descriptionProp.value = entityDefinition?.description || '';  
    includeInLinkChartProp.value = entityDefinition?.includeInLinkChart;

    if (validateFields) 
        validate([nameProp]);
    else
        clearErrors([nameProp]);

    return (
                <Box sx={{ overflow:'auto', flexGrow:1, p:1}}>
                    <Box sx={{display:'flex',height:'100%', width:'30ch', display:'flex', flexDirection:'column',p:1}}>
                        <Box sx={{ml:2, mr:2, display:'flex'}}></Box>
                        <Box>{getInputComponent(nameProp)}</Box>
                        <Box>{getInputComponent(descriptionProp)}</Box>
                        <Box>{getInputComponent(includeInLinkChartProp)}</Box>
                    </Box>
                </Box>  
    );
}