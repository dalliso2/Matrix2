import { setMessageBoxData, setWaitMessage, removeWaitMessage, setAuthToken } from "../state/AppSlice";
import { router } from "../router/MatrixRouter";

function getTags(tagName, results)
{
    console.log("getTags");
    console.log("tagName: ", tagName); 
    console.log("results: ", results);
    if (!results)
        return [];

    if (Array.isArray(results))
        return results.map(({id})=>({type: tagName, id}));
    else
        return [{type: tagName, id: results.id}];
}

function handleQueryError(queryResults, dispatch, navigate, errorFn)
{
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
                                successFn=()=>{}, 
                                failureFn=()=>{})
{
    if (mutationResults.data?.api_error)
    {
        const errorList = (mutationResults.data.errors?.length)?("\n\n" + mutationResults.data.errors.join("\n")):"";
        dispatch(setMessageBoxData( mutationResults.requestId, 
                                    "Error",
                                    mutationResults.data.message + errorList));
        if (failureFn)
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

// this method should be called with the useEffect hook with queryResults.isFetching as the dependency
// waitMessage, successFn, and failurFn are optional
function handleQueryResultsWithWaitMessage(queryResults, dispatch, waitMessage, successFn, failurFn)
{
    if (!queryResults)
        return;

    if (queryResults.isFetching && waitMessage)
    {
        dispatch(setWaitMessage(waitMessage, waitMessage));
        return;
    }   
    
    if (waitMessage)
        dispatch(removeWaitMessage(waitMessage));

    // This method handles api errors, not http status code errors (400+)
    // isSuccces should be true if the query was successful, even if there was an api error
    if (!queryResults.isSuccess)
        return ;

    if (queryResults.data.api_error)
    {
        dispatch(setMessageBoxData (queryResults.requestId, 
            "Error",
            queryResults.data.message + 
            (queryResults.data.errors?("\n" + queryResults.data.errors.map(error=>"\n" + error).join("")):"")
        ));

        if (failurFn)
            failurFn();
    }
    else
    {
        if (successFn)
            successFn();
    }
}

// this method handles HTTP errors (400+)
const HTTP_ERROR = "HTTP_ERROR";
async function onQueryStartedHandler(queryFullfilledPromise, dispatch, requestId, waitMessage, successFn, failFn)
{
    if (waitMessage)
        dispatch(setWaitMessage(requestId, waitMessage));

    queryFullfilledPromise.then((response) => {
        dispatch(removeWaitMessage(requestId));
        if (response.data.authToken)
            dispatch(setAuthToken(response.data.authToken));
        if (successFn)
            successFn();
    })
    .catch((error) => {
        dispatch(removeWaitMessage(requestId));
        if (failFn)
            failFn();
        router.navigate("/login");

        console.log(error);
        if (error.meta.response.status === 401)
            dispatch(setMessageBoxData(HTTP_ERROR, "Session expired", "Your session expired.  Please login again."));
        else if (error.meta.response.status === 403)
            dispatch(setMessageBoxData(HTTP_ERROR, "Access Denied", error.error.data.message));
        else
            dispatch(setMessageBoxData(HTTP_ERROR, "Unexpected Error", error.meta.response.status + " - " + error.meta.response.statusText));
    })
    .finally(() => {
        dispatch(removeWaitMessage(HTTP_ERROR));
    });
    
}

function showApiErrorMessageBox(queryStatus, dispatch)
{
    const error = queryStatus.error;
    if (error.data)
    {
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

export {    getTags,
            handleQueryResultsWithWaitMessage, 
            handleMutationResults, 
            onQueryStartedHandler, 
            handleQueryError, 
            showApiErrorMessageBox };