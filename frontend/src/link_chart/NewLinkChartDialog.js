import { Dialog } from "@mui/material";
import React from "react";
import { Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

export default function NewLinkChartDialog({  })
{
    return (
        <Dialog open={true} maxWidth='sm' fullWidth={true} >
            <DialogTitle>New Link Chart</DialogTitle>
            <DialogContent>
                <Box sx={{p:1}}>
                    <TextField label="Name" fullWidth/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}