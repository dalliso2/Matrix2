import { DATE_RANGE, DATE, DATE_TIME, DATE_TIME_RANGE, SWITCH, ADDRESS_US } from "../util/PropertyType";
import dayjs from "dayjs";

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
                    const results = checkDates(field, value);
                    field.error[index] = results.error;
                    field.helperText[index] = results.helperText;
                    valid &&= !field.error[index];
                });
                if (valid)
                {
                    const startDate = field.value[0];
                    const endDate = field.value[1];
                    if (dayjs(startDate).isAfter(dayjs(endDate)))
                    {
                        field.error[1] = true;
                        field.helperText[1] = "End date must be after start date";
                        valid = false;
                    }
                }
                break;
            case DATE_TIME:
            case DATE:
                const dateResults = checkDates(field, field.value);
                field.error = dateResults.error;
                field.helperText = dateResults.helperText;
                valid &&= !field.error;
                break;
            case SWITCH:
                break;
            case ADDRESS_US:
                field.error = new Array(5).fill(true);
                field.helperText = new Array(5).fill("(required)");
                field.value.forEach((value,index) => 
                {
                    if (index === 1 || value.valu)
                    {
                        field.error[1] = false;
                        field.helperText[1] = true;
                    }
                    else
                    {
                        field.error[index] = results.error;
                        field.helperText[index] = results.helperText;
                        valid &&= !field.error[index];
                    }
                });
                break;
            case 'hidden':
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

function checkDates(field, value)
{
    const results = {error: false, helperText: ' '};
    if (!value)
    {
        if (field.required)
        {
            results.helperText = "(required)";            
            results.error = true;
        }
    }
    else if (!dayjs(value).isValid())
    {
        results.helperText = "Invalid date/time";
        results.error = true;
    }
    return results; 
}

function checkValue(field, value)
{
    const results = {error: false, helperText: ' '};

    if (!value || (typeof value === "string" && value.trim().length === 0))
    {
        if (field.required)
        {
            results.helperText = "(required)";            
            results.error = true;
        }
    }
    else if (field.minLength && (typeof value === "string" && value.length < field.minLength))
    {
        results.helperText = "(Minimum " + field.minLength + " characters)";
        results.error = true;
    }
    else if (field.maxLength && (typeof value === "string" && value.length > field.maxLength))
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

// function checkValue(field, value)
// {
//     const results = {error: false, helperText: ' '};
//     if (field.minLength && value < field.minLength)
//     {
//         results.helperText = "(Minimum " + field.minLength + " characters)";
//         results.error = true;
//     }
//     else if (field.required && isEmpty(value))
//     {
//         results.helperText = "(required)";            
//         results.error = true;
//     }
//     else if (field.maxLength && value > field.maxLength)
//     {
//         results.helperText = "(Maximum " + field.maxLength + " characters)";
//         results.error = true;
//     }    
//     else if (field.mask && value.includes('_'))
//     {
//         results.helperText = "Invalid " + field.label;
//         results.error = true;
//     }

//     return results;
// }

function clearErrors(fields)
{
    fields.forEach((field) => 
    {
        field.error = false;
        field.helperText = ' ';
    });
}

export {errorTextSuffix, validate, clearErrors};