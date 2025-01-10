import dayjs from "dayjs";

const ADMIN = 0;
const PARTICIPANT = 1;
const REVIEWER = 2;

import { PROFILE_IMAGE, IMAGE_ARRAY } from '../util/PropertyType';

const CaseRoles = ['Admin','Participant','Reviewer'];

function userCanModifyCase(user, caseId)
{
    if (!caseId || !user)
        return false;

    if (user.isAdmin)
        return true;

    return user.authorities.findIndex(auth => auth === 'CASE_' + caseId + 'ADMIN' 
                                                || auth === 'CASE_' + caseId + 'EDIT') >= 0;
}

function getMessageBoxAPIError(apiError)
{
    if (apiError.api_error)
        return apiError.message + "\n" + apiError.errors?.map(error => "\t" + error.message).join('\n')+'\n\ncode: '+apiError.errorCode;
    else
        return "An unknown error occurred.";
}

const getUniqueId = () => Math.random().toString(36).substring(2, 9);

const getRoleText = (role) => CaseRoles[role];

// returns an array of object, each consisting of an propertyDefinition(id) and an array of property values
export function consolidatePropValues(entityObj)
{
    const entityPropValues = [];
    for (let prop of entityObj.propertyValues)
    {
        if (!entityPropValues.length || entityPropValues[entityPropValues.length-1].propertyDefinition !== prop.propertyDefinition)
            entityPropValues.push({values:[prop.value], propertyDefinition: prop.propertyDefinition})
        else
            entityPropValues[entityPropValues.length-1].values.push(prop.value);
      
    }

    return entityPropValues;
}

function getEntityDefinitionColumnHeadings(entityDefinition)
{
    return entityDefinition.props.filter(prop=>!prop.deleted && prop.includeInList).map(prop => prop.name);
}

function trimObjectValues(obj, ...excludeKeys)
{
    try
    {
        Object.keys(obj).forEach((key) => 
        { 
            if (typeof obj[key] === 'string' && !excludeKeys.includes(key))
            {
                obj[key] = obj[key].trim();
            }
        });
    }
    catch (err)
    {
        //console.log(err);
    }
}

function duplicateObject(obj)
{
    return JSON.parse(JSON.stringify(obj));
}

function getDateString(value)
{
    if (value)
    {
        return dayjs(value).format('M/D/YYYY');
    }
    else
        return "";
}

function getDateTimeString(value)
{
    if (value)
    {
        // const date = new Date(Number(value));
        // return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.toLocaleTimeString();
        return dayjs(value).format('M/D/YYYY HH:mm:ss');
    }
    else
        return "";
}

function getTitle(entityDefinitions, entity)
{
    if (!entityDefinitions || !entity)
        return "";

    const entityDefProperties = entityDefinitions.find((def) => def.id === entity.entityDefinition)?.props;

    return entityDefProperties.reduce((acc,cur) => {
        let val = "";
        const prop = entity.propertyValues.find(prop => prop.propertyDefinition === cur.id);
        if (prop && prop.hasOwnProperty('value'))
            val = prop.value;      
      return (val && cur.includeInTitle)?(acc + (acc.length?', ':'') + val):acc;
    },'');
}

// function getImageId(entityDefinitions, entity)
// {
//     const profileImageDef = entityDefinitions.find(def => def.id === entity.entityDefinition)?.props.find(prop => prop.type === PROFILE_IMAGE);
//     if (profileImageDef)
//     {
//         const prop = entity.propertyValues.find(prop => prop.propertyDefinition === profileImageDef.id);
//         if (prop && prop.hasOwnProperty('value'))
//             return prop.value;
//     }

    
//     const imageArrayDef = entityDefinitions.find(def => def.id === entity.entityDefinition)?.props.find(prop => prop.type === IMAGE_ARRAY);
//     if (imageArrayDef)
//     {
//         const prop = entity.propertyValues.find(prop => prop.propertyDefinition === imageArrayDef.id);
//         if (prop && prop.hasOwnProperty('value') && prop.value.length > 0)
//             return prop.value;
//     }
//     return null;
// }

function getImageId(entityDefinitions, entity)
{
    if (!entityDefinitions || !entity)
        return undefined;

    let imageId = undefined;

    const entityDefinition = entityDefinitions.find((defs) => defs.id === entity.entityDefinition );
    let defProp = entityDefinition.props.find((def) => def.type == PROFILE_IMAGE);
    if (defProp) // no PROFILE_IMAGE property in the entity definition
        imageId = entity.propertyValues.find((pVal) => defProp.id === pVal.propertyDefinition)?.value;

    // if no imageId found for PROFILE IMAGE use 
    if (!imageId)
    {
        defProp = entityDefinition.props.find((def) => def.type === IMAGE_ARRAY);
        if (defProp)
            imageId = entity.propertyValues.find((val) => val.propertyDefinition === defProp.id)?.value;
    }

    return imageId;
}

function copyFields(fields)
{
    const fieldsCopy = [];
    fields.forEach(field =>
    {
        const newField = {};
        fieldsCopy.push(newField);
        for (const [key, value] of Object.entries(field))
        {
            if (Array.isArray(value))
                newField[key] = [...value];
            else
                newField[key] = value;
       }    
     });

     return fieldsCopy;
}

export { userCanModifyCase, getMessageBoxAPIError, getRoleText, CaseRoles, getDateString, getDateTimeString,
    ADMIN, PARTICIPANT, REVIEWER, getUniqueId, trimObjectValues,duplicateObject, getTitle, copyFields, getImageId, 
    getEntityDefinitionColumnHeadings}