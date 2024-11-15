import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveCase } from '../state/AppSlice';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slider } from '@mui/material';
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { useState } from 'react';

function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
}

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

export default function EditNodeDialog({node, closeFn})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const activeCase = useSelector(selectActiveCase);
    const [nodeProps, setNodeProps] = useState({'shape':node.style('shape'), 
                                                'width':node.style('width'),
                                                'height':node.style('height'),});   
    


    return (
        <Dialog open={true} maxWidth='sm' 
                fullWidth={true} 
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title">
        <DialogTitle    sx={{backgroundColor:theme.palette.primary.main, color:theme.palette.primary.contrastText }}
                        style={{ cursor: 'move' }}
                        id="draggable-dialog-title">Edit Node: {node.style('label')}</DialogTitle>
        <DialogContent>
            <Box sx={{p:1}}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>Shape</Grid>
                    <Grid item xs={6}>
                    <Select value={node.style('shape')} 
                            onChange={event=>node.style('shape', event.target.value)}
                            sx={{p:0, m:0, '& .MuiSelect-select':{p:1}}}>
                        {shapes.map((shape, index) => 
                            <MenuItem key={index} value={shape.name} sx={{p:1}}>{shape.name}</MenuItem>
                        )}
                    </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <Slider defaultValue={node.style('width')}
                                min={10} max={500}
                                onChange={event=>node.style('width',event.target.value.toString() + 'px')}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField size="small"
                            sx={{mt:1, width:'3ch'}} />
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>closeFn()}>Cancel</Button>
            <Button color="primary">Save</Button>
        </DialogActions>
    </Dialog>
    );
}