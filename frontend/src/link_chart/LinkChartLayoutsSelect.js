import React from "react";

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
        <Select     value={chartProperties.layout} 
                    onChange={event=>setLayoutFn(event.target.value)}
                    sx={{p:0, m:0, '& .MuiSelect-select':{p:1}}}>
        {layouts.map((layout, index) => 
            <MenuItem key={index} value={index} sx={{p:1}}>{layout.name}</MenuItem>
        )}
        </Select>
    );
}