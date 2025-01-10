
export const RETRIEVE_FILE_URL = "/api/file/";

export async function apiGetFile(authToken, fileId, fileName)
{
    const params = new URLSearchParams({t:authToken}).toString();

    fetch(RETRIEVE_FILE_URL + fileId + "?" + params, {
        method: 'GET',
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