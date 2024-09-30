import { setWaitMessage, removeWaitMessage, setMessageBoxData } from '../state/AppSlice';

export async function apiCall({method, dispatchFn, waitMessage, successMessage, blockUI = true})
{
    const messageKey = "Key_" + Math.random();
    if (blockUI)
        dispatchFn(setWaitMessage(messageKey, waitMessage));

    let json = undefined;
    try
    {
        let response = await method();

        console.log(response);
        if (response.redirected)
            window.location.href = '/';

        if (!response.ok && !response.api_error)
            throw new Error("Server error.  Http response code: " + response.status);   
    
        json = await response.json();
    }
    catch (error)
    {
        console.log(error);
        dispatchFn(setMessageBoxData(messageKey, "Error", error.message));
    }
    finally
    {
        if (blockUI)
            dispatchFn(removeWaitMessage(messageKey));
    }

    return json;
}

export async function executeGet(url, ...parameters)
{
    const url2 = url + parameters.reduce( (final='',current) => (final + '/' + current),'' );
    console.log(url2);
    const response = await fetch(url2,
        {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        }    
    ); 

    return response;
}

export async function executeDelete(url, ...parameters)
{
    const url2 = url + parameters.reduce( (final='',current) => (final + '/' + current),'' );
    console.log(url2);
    const response = await fetch(url2,
        {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        }    
    ); 
    
    return response;
}

async function executeSendJSON(method, url, data)
{
    console.log(url);
    const response = await fetch(url, 
            {
                method:method,
                credentials: 'include',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

    return response;
}

export async function executePutJSON(url, data)
{
    return executeSendJSON('PUT', url, data);
}

export async function executePatchJSON(url, data)
{
    return executeSendJSON('PATCH', url, data);
}   

export async function executePostJSON(url, data)
{
    console.log("executePostJSON");
    return executeSendJSON('POST', url, data); 
}

export async function executePostFormData(url, parameterObject)
{
    console.log(url);
    const formData = new FormData();
    if (parameterObject)
        Object.keys(parameterObject).forEach((key) => formData.append(key,parameterObject[key]));

    const response = await fetch(url, 
            {
                method:'POST',
                mode: 'cors',
                credentials: 'include',
                body: formData
            });
            
    if (response.redirected)
        window.location.href = '/';
    if (response.status >= 300)
        throw new Error("Server error.");
       
   return await response.json();
}