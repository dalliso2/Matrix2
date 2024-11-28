import { setMessageBoxData, setWaitMessage, removeWaitMessage, resetState } from "../state/AppSlice";
import { api } from "../api/BaseApi";
import { router } from "../router/MatrixRouter";

function handleQueryError(queryResults, dispatch, navigate, errorFn)
{
    //console.log(queryResults);
    if (!queryResults)
        return;
    if (queryResults.data?.api_error)
    {
        const errorList = (queryResults.data.errors?.length)?("\n\n" + mutationResults.data.error.data.errors.join("\n")):"";

        dispatch(setMessageBoxData( queryResults.requestId, 
                                    "Error",
                                    queryResults.data.message + 
                                    errorList));

        if (errorFn)
            errorFn();
    }
}

function handleMutationResults(mutationResults, 
                                dispatch, 
                                // navigate,
                                // waitForResults=false, 
                                // waitMessage = "Please wait...", 
                                // errorMsgBoxTitle = "Error ", 
                                successFn=()=>{}, 
                                failureFn=()=>{})
{
    // console.log("handleMutationResults");
    // console.log(mutationResults);
    if (mutationResults.data?.api_error)
    {
        const errorList = (mutationResults.data.errors?.length)?("\n\n" + mutationResults.data.errors.join("\n")):"";
        console.log(errorList);
        dispatch(setMessageBoxData( mutationResults.requestId, 
                                    "Error",
                                    mutationResults.data.message + errorList));
        failureFn();
        mutationResults.reset();
    }
    else if (mutationResults.isSuccess && mutationResults.requestId)
    {
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
            dispatch(api.util.resetApiState());
            dispatch(resetState());
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

async function onQueryStartedHandler(queryFullfilledPromise, dispatch, mutatedObj, waitMessage)
{
    const messageId = JSON.stringify(mutatedObj);
    if (waitMessage)
        dispatch(setWaitMessage(messageId, waitMessage));

    queryFullfilledPromise.then((response) => {
        dispatch(removeWaitMessage(messageId));
    })
    .catch((error) => {
        dispatch(removeWaitMessage(messageId));
        router.navigate("/login");

        if (error.meta.response.status === 401)
            dispatch(setMessageBoxData(messageId, "Session expired", "Your session expired.  Please login again."));
        else
            dispatch(setMessageBoxData(messageId, "Unexpected Error", error.meta.response.status + " - " + error.meta.response.statusText));
    });
}

function showApiErrorMessageBox(queryStatus, dispatch)
{
    //console.log("showApiErrorMessageBox");
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

export { handleQueryResultsWithWaitMessage, handleMutationResults, onQueryStartedHandler, handleQueryError, showApiErrorMessageBox };