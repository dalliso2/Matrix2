import React from "react";
import { Select, MenuItem } from "@mui/material";

const layouts = [
    {name:'cose', layout:{name:'cose', componentSpacing:1000, nodeDimensionsIncludeLabels:true}},
    {name:'random', layout:{name:'random'}},
    {name:'grid', layout:{name:'grid'}},
    {name:'circle', layout:{name:'circle'}},
    {name:'concentric', layout:{name:'concentric'}},
    {name:'breadthfirst', layout:{name:'breadthfirst'}},
];

export default function LinkChartLayoutsSelect({ setLayoutFn }) 
{
    return (
        <Select onChange={event=>{setLayoutFn(event.target.value.layout)}}
                        sx={{p:0, m:0, '& .MuiSelect-select':{p:1}}}>
        {layouts.map((layout, index) => 
            <MenuItem key={index} value={layout} sx={{p:1}}>{layout.name}</MenuItem>
        )}
        </Select>
    );
}