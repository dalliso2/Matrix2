//import { UPLOAD_FILE_URL } from '../../api/file';
const UPLOAD_FILE_URL = '/api/file/upload';

export default class FileUpload
{
    constructor(file, caseId, authToken, statusChangeFunction )
    {
        this.fileName = file.name;
        this.size = file.size;
        this.statusChangeFunction = statusChangeFunction;
        this.progressPercentage = 0.0;
        this.loaded = 0.0;
        this.completed = false;
        this.error = false;
        this.abort = false;
        this.fileId = undefined;
        this.errorMessage = '';

        this.userName = '';
        this.userDescription = '';
        this.inputError = false;
        this.helperText = '';   

        this.tempFileId = file.tempFileId;

        this.updateProgress.bind(this);
        this.setComplete.bind(this);
        this.setFileId.bind(this);
        this.setError.bind(this);
        this.setAbort.bind(this);

        this.ajax = new XMLHttpRequest();
        this.ajax.withCredentials = "true";
        const formData = new FormData();
        formData.append('files',file);
        formData.append('matrixCaseId',caseId)

        this.ajax.responseType="json";
        this.ajax.onloadstart = this.updateProgress;
        this.ajax.upload.onprogress = this.updateProgress;
        this.ajax.onload = this.setFileId;
        this.ajax.onloadend = this.setComplete;
        this.ajax.onerror = event=>console.log(event);//this.setError;
        this.ajax.onabort = this.setAbort;
        //make async request
        this.ajax.open("POST", UPLOAD_FILE_URL);
        this.ajax.setRequestHeader("Authorization", "Bearer " + authToken);
        //this.ajax.setRequestHeader('Access-Control-Allow-Origin','*');
        this.ajax.send(formData);
    }

    updateProgress = (e) =>
    {
        this.loaded = e.loaded;
        this.total = e.total;
        this.progressPercentage = this.loaded * 1.0 / this.size * 100;
        if (this.loaded == this.size)
            this.completed = true;
        this.statusChangeFunction();
    }; 

    setFileId = () =>
    {
        if (this.ajax.response?.length)
            this.fileId = this.ajax.response[0].id;
        this.statusChangeFunction();
    }

    isComplete = () =>
    {
        return this.completed;
    }   

    setComplete = () =>
    {
        this.completed = true;
        if (this.ajax.status != 200)
        {
            this.error = true;
            this.errorMessage = this.ajax.response;
        }
        this.statusChangeFunction(this);
    }

    setError = () =>
    {
        this.error = true;
        this.statusChangeFunction();
    }

    setAbort = () =>
    {
        this.abort = true;
        this.statusChangeFunction();
    }

    abortUpload = () =>
    {
        this.ajax.abort();
        this.statusChangeFunction();
    }
}