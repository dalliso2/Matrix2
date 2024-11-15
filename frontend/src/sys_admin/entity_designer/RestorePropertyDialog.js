import React from "react";
import { useState } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, ListItemButton } from "@mui/material";

export default function RestorePropertyDialog({properties, updatePropertiesFn, closeFn})
{
    const [deletedProperties, setDeletedProperties] = useState([...properties.filter((prop)=>prop.deleted)]);
    const [selected, setSelected] = useState(properties.filter(prop=>prop.deleted).map(()=>false));

    function restoreProperties()
    {
        const newProps = properties.map((prop,index) => ({...prop}));
        newProps.filter((prop)=>prop.deleted).forEach((prop,index) => prop.deleted = !selected[index]);

        updatePropertiesFn(newProps);
        closeFn();
    }

    return (
        <Dialog open={true}>
            <DialogTitle>Restore Deleted Property</DialogTitle>
            <DialogContent>
                {deletedProperties.map((prop,index) =>
                    <ListItemButton key={index} 
                        selected = {selected[index]}
                        onClick={(event)=>setSelected(oldSelected=>{
                            const newSelected = [...oldSelected];
                            
                            newSelected[index] = !newSelected[index];
                            
                            return newSelected;
                        })}
                    >
                    {prop.name}
                    </ListItemButton>
                )}    
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>restoreProperties()}>Restore Selected</Button>
                <Button onClick={closeFn}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}