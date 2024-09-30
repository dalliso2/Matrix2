import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import React from "react";

export default function APIErrorDialog({ title="Error", error, closeFn })
{
    return (
        !!error &&
        <Dialog open={true}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{error.data.message}</p>
            </DialogContent>
            <DialogActions><Button onClick={() => closeFn()}>OK</Button></DialogActions>
        </Dialog>
    );
}