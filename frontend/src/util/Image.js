import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../state/AppSlice";
import './DisplayComponentFactory.css';

const RETRIEVE_FILE_URL = "/api/file/";

export default function Image({id, className})
{
    const authToken = useSelector(selectAuthToken);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current && authToken)
        {
            const imgElement = imgRef.current;
            fetch(RETRIEVE_FILE_URL + id, {headers: {Authorization: `Bearer ${authToken}`}})  
                    .then(response => response.blob())
                    .then(blob => { imgRef.current.src = URL.createObjectURL(blob);});
        }
    }, [imgRef.current, authToken]);

    return (
        <img ref={imgRef} id={'img_' + id} className={className}/>
    );
}