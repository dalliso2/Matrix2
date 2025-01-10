import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTheme } from "@emotion/react";

export default function BinaryChoiceMessageBox({ title, message, onYes, onNo, yesButtonText='Yes', noButtonText='No' }) 
{
    const theme = useTheme();
    return (
        <Dialog     open={true} 
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
            <DialogTitle sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText, 
                borderColor: theme.palette.background.default, }} id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description"sx={{pt:3}}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onYes}>{yesButtonText}</Button>
                <Button onClick={onNo} autoFocus>{noButtonText}</Button>
            </DialogActions>
        </Dialog>
    );
}