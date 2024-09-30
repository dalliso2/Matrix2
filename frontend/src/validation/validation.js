import { DATE_RANGE, DATE_TIME_RANGE, SWITCH } from "../util/PropertyType";

const errorTextSuffix = '-errorText';

function validate(fields)
{ 
    let valid = true;
 
    fields.forEach((field) => 
    {
        field.error = false;
        field.helperText = ' ';
        switch (field.type)
        {
            case DATE_RANGE:
            case DATE_TIME_RANGE:                
                const arraySize = field.value.length;
                field.error = new Array(arraySize);
                field.helperText = new Array(arraySize);
                field.value.forEach((value,index) => 
                {
                    const results = checkValue(field, value);
                    field.error[index] = results.error;
                    field.helperText[index] = results.helperText;
                    valid &&= !field.error[index];
                });
                break;
            case SWITCH:
                break;
            default:
                const results = checkValue(field, field.value);
                field.error = results.error;
                field.helperText = results.helperText;
                valid &&= !field.error;
        }
    });
    return valid;
}

function isEmpty(value) 
{
    return !value || Number.isNaN(value) || (typeof value === "string" && value.trim().length === 0)
            || (Array.isArray(value) && value.length === 0);
}

function checkValue(field, value)
{
    const results = {error: false, helperText: ' '};
    if (field.minLength && value?.length < field.minLength)
    {
        results.helperText = "(Minimum 8 characters)";
        results.error = true;
    }
    else if (field.required && isEmpty(value))
    {
        results.helperText = "(required)";            
        results.error = true;
    }
    else if (field.maxLength && value?.length > field?.maxLength)
    {
        results.helperText = "(Maximum " + field.maxLength + " characters)";
        results.error = true;
    }    
    else if (field.mask && value.includes('_'))
    {
        results.helperText = "Invalid " + field.label;
        results.error = true;
    }

    return results;
}

function clearErrors(fields)
{
    fields.forEach((field) => 
    {
        field.error = false;
        field.helperText = ' ';
    });
}

export {errorTextSuffix, validate, clearErrors};