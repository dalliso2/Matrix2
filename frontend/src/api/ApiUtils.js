import { setMessageBoxData, setWaitMessage, removeWaitMessage, setSystemInErrorState, setCurrentUser, setAuthToken } from "../state/AppSlice";

function handleQueryError(queryResults, dispatch, navigate, errorFn)
{
    if (!queryResults)
        return;
    if (queryResults.error)
    {
        if (queryResults.error?.data?.api_error)
        {
            dispatch(setMessageBoxData(queryResults.requestId, 
                                        "Error",
                                        queryResults.error.data.message + " " + 
                                        queryResults.error.data?.errors?.map(error=>"\n"+error.field+" - "+error.message).join(""),));
        }
        else if (queryResults.error?.data?.error)
        {
            dispatch(setMessageBoxData(queryResults.requestId, 
                                        "Error" ,
                                        queryResults.error.data.error + " " + 
                                        queryResults.error.data.message)); 
        }
        else if (queryResults.error?.status === 401)
        {
            dispatch(setCurrentUser(undefined));
            dispatch(setAuthToken(undefined));
            navigate("/login");
        }
        else
        {
            dispatch(setSystemInErrorState(true));
        }

        dispatch(removeWaitMessage(queryResults.requestId));

        if (errorFn)
            errorFn();
    }
}

function handleMutationResults(mutationResults, 
                                dispatch, 
                                navigate,
                                waitForResults=false, 
                                waitMessage = "Please wait...", 
                                errorMsgBoxTitle = "Error ", 
                                successFn=()=>{}, 
                                failureFn=()=>{})
{
    if (mutationResults.error)
    {
        dispatch(removeWaitMessage(mutationResults.requestId));
        if (failureFn)
            failureFn();
        mutationResults.reset();        
        
        if (mutationResults.error?.data?.api_error)
        {
            const errorList = (mutationResults.error.data?.errors?.length)?("\n\n" + mutationResults.error.data.errors.join("\n")):"";
            dispatch(setMessageBoxData(mutationResults.requestId, 
                                        errorMsgBoxTitle,
                                        mutationResults.error.data.message + 
                                        errorList));
        }
        else if (mutationResults.error?.data?.error)
        {
            dispatch(setMessageBoxData(mutationResults.requestId, mutationResults.error.data.error, mutationResults.error.data.message)); 
        }
        else if (mutationResults.error?.status === 401)
        {
            dispatch(setCurrentUser(undefined));
            dispatch(setAuthToken(undefined));
            navigate("/login");
        }
    }
    else if (mutationResults.isLoading && mutationResults.requestId && waitForResults)
    {
        dispatch(setWaitMessage(mutationResults.requestId, waitMessage));
    }
    else if (mutationResults.isSuccess && mutationResults.requestId)
    {
        dispatch(removeWaitMessage(mutationResults.requestId));
        if (successFn)
            successFn();
        mutationResults.reset();
    }
}

function handleQueryResultsWithWaitMessage(queryResults, dispatch, navigate, waitMessage = "Please wait...", successFn)
{
    if (queryResults.error)
    {
        if (queryResults.error?.data?.api_error)
        {
            dispatch(   (queryResults.requestId, 
                                        "Error",
                                        queryResults.error.data.message + " " + 
                                            queryResults.error.data?.errors.map(error=>"\n"+error.field+" - "+error.message).join("")));
        }
        else if (queryResults.error?.data?.error)
        {
            dispatch(setMessageBoxData(queryResults.requestId, queryResults.error.data.error, queryResults.error.data.message)); 
        }
        else if (queryResults.error?.status === 401)
        {
            dispatch(setCurrentUser(undefined));
            dispatch(setAuthToken(undefined));
            navigate("/login");
        }
        else
        {
            dispatch(setMessageBoxData(queryResults.requestId, "Unexpected Error", queryResults?.error?.data || "An unexpected error occurred"));
        }

        dispatch(removeWaitMessage(queryResults.requestId));
    }
    else if (queryResults.isLoading && queryResults.requestId)
        dispatch(setWaitMessage(queryResults.requestId, waitMessage));
    else if (queryResults.isSuccess && queryResults.requestId)
    {
        dispatch(removeWaitMessage(queryResults.requestId));
        if (successFn)
            successFn();
    }
}

function showApiErrorMessageBox(queryStatus, dispatch)
{
    console.log("showApiErrorMessageBox");
    const error = queryStatus.error;
    if (error.data)
    {
        // console.log(error);
        // console.log(error.data.errors.length);
        if (error.data.api_error)
        {
            const message =  error.data.message
                            + error.data.errors.reduce((acc, error)=>acc + error.field + " - " + error.message + "\n", "\n\n")
                            + (error.data.errors.length>0?"\n":"\n\n") + "error code: " + error.data.errorCode;
            
            dispatch(setMessageBoxData(queryStatus.requestId, "Unexpected Error", message));
        }
        else
        {
            dispatch(setMessageBoxData(queryStatus.requestId, "Unexpected Error", error.data));
        }
    }
    else
        dispatch(setMessageBoxData(queryStatus.requestId, "Unexpected Error", "An unexpected error occurred"));

}

export { handleQueryResultsWithWaitMessage, handleMutationResults, handleQueryError, showApiErrorMessageBox };