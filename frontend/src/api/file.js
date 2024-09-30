import { executeGet, executePostJSON } from "./base";

export const UPLOAD_FILE_URL = "/api/file/upload";
export const RETRIEVE_FILE_URL = "/api/file/";
export const UPDATE_FILES = '/api/file/update_files';
export const UNLINK_ENTITY_FILE = '/api/entity_file/remove';

export async function apiGetFile(fileId, fileName)
{
    fetch(RETRIEVE_FILE_URL + fileId, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    }).then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    });
}


export async function apiUpdateFiles(files)
{
    return await executePostJSON(UPDATE_FILES, files);
}

export async function apiUnlinkFile(entityFileId)
{
    return await executeGet(UNLINK_ENTITY_FILE, entityFileId);
}