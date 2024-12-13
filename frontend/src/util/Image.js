import React from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../state/AppSlice";
import './DisplayComponentFactory.css';

const RETRIEVE_FILE_URL = "/api/file/";

export default function Image({id, className, style})
{
    const authToken = useSelector(selectAuthToken);
    const imgRef = useRef(null);

    return (
        <img ref={imgRef} id={'img_' + id} className={className} style={{...style}}
                src={RETRIEVE_FILE_URL + id + "?t=" + authToken} />
    );
}