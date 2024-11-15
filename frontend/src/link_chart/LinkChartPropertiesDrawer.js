import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import styled from '@mui/material/styles/styled';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import LinkChartsList from './LinkChartsList';
import Box from '@mui/material/Box';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  }));

const layouts = [
    {name:'cose', layout:{name:'cose', componentSpacing:1000, nodeDimensionsIncludeLabels:true}},
    {name:'random', layout:{name:'random'}},
    {name:'grid', layout:{name:'grid'}},
    {name:'circle', layout:{name:'circle'}},
    {name:'concentric', layout:{name:'concentric'}},
    {name:'breadthfirst', layout:{name:'breadthfirst'}},
];

const shapes = [
    {name:'ellipse', shape:'ellipse'},
    {name:'rectangle', shape:'rectangle'},
    {name:'roundrectangle', shape:'roundrectangle'},
    {name:'triangle', shape:'triangle'},
    {name:'pentagon', shape:'pentagon'},
    {name:'hexagon', shape:'hexagon'},
    {name:'heptagon', shape:'heptagon'},
    {name:'octagon', shape:'octagon'},
    {name:'star', shape:'star'},
    {name:'diamond', shape:'diamond'},
    {name:'vee', shape:'vee'},
    {name:'rhomboid', shape:'rhomboid'},
];

const edgeStyles = [
    {name:'haystack', style:'haystack'},
    {name:'straight', style:'straight'},
    {name:'straight-triangle', style:'straight-triangle'},
    {name:'bezier', style:'bezier'},
    {name:'unbundled bezier', style:'unbundled-bezier'},
    {name:'segments', style:'segments'},
    {name:'round segments', style:'round-segments'},
    {name:'taxi', style:'taxi'},
    {name:'round taxi', style:'round-taxi'},
]    

export default function LinkChartPropertiesDrawer({cy}) 
{
    const [open, setOpen] = useState(false);
    const [chartProperties, setChartProperties] = useState({layout:0, shape:0, edgeStyle:0 });

    // load saved charts


    if (cy.current)
    {
        cy.current.layout(layouts[chartProperties.layout].layout).run();
        cy.current.nodes().style('shape',shapes[chartProperties.shape].shape);
        //cy.current.nodes().style('width',120);
        cy.current.edges().style('curve-style',edgeStyles[chartProperties.edgeStyle].style);
    }

    return (
        <>
        <Drawer
        sx={{ 
            width: '400px',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
            width: '400px',
            },
        }}
        anchor="right"
        open={open}
        >
            <DrawerHeader/>
            <b>Link Charts</b>
            <LinkChartsList/>
            <Button onClick={()=>setOpen(false)}>Close</Button>
            <Box sx={{p:1, width:'100%', display:'flex', flexDirection:'column'}}>
                <b>Layout</b>
                <Select     value={chartProperties.layout} 
                            onChange={event=>setChartProperties(old=>({...old,layout:event.target.value}))}
                            sx={{p:0, m:0, '& .MuiSelect-select':{p:1}}}>
                    {layouts.map((layout, index) => 
                        <MenuItem key={index} value={index} sx={{p:1}}>{layout.name}</MenuItem>
                    )}
                </Select>
            </Box>
            <Box sx={{p:1, width:'100%', display:'flex', flexDirection:'column'}}>
                <b>Shapes</b>
                <Select value={chartProperties.shape} 
                        onChange={event=>setChartProperties(old=>({...old,shape:event.target.value}))}
                        sx={{p:0, m:0, '& .MuiSelect-select':{p:1}}}>
                    {shapes.map((shape, index) => 
                        <MenuItem key={index} value={index} sx={{p:1}}>{shape.name}</MenuItem>
                    )}
                </Select>
            </Box>
            <Box sx={{p:1, width:'100%', display:'flex', flexDirection:'column'}}>
                <b>Edge Styles</b>
                <Select value={chartProperties.edgeStyle} 
                        onChange={event=>setChartProperties(old=>({...old,edgeStyle:event.target.value}))}
                        sx={{p:0, m:0, '& .MuiSelect-select':{p:1}}}>
                    {edgeStyles.map((edgeStyle, index) => 
                        <MenuItem key={index} value={index} sx={{p:1}}>{edgeStyle.name}</MenuItem>
                    )}
                </Select>        
            </Box>
        </Drawer>
        <Fab color="primary" aria-label="add" sx={{position:'absolute', bottom:10,right:10}} onClick={()=>setOpen(true)}><EditNoteTwoToneIcon/></Fab>
        </>
    );
}
