import React from 'react';
import { TextField } from '@mui/material';

export default function TextFieldCallback({ callbackFn, delayMilliseconds, label, disabled, width="40ch" })
{
    let timerId = undefined;

    function handleInputChange(event)
    {
        if (timerId)
            clearTimeout(timerId);
        if (event.target.value !== '')
            timerId = setTimeout(()=>callbackFn(event.target.value), delayMilliseconds);
    }

    return (
        <TextField
            label={label}
            onChange={handleInputChange}
            fullWidth
            size="small"
            disabled={disabled}
            sx={{width:width}}
        />
    );
}