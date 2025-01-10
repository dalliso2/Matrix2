import React from "react";
import { TEXT } from "../util/PropertyType";
import Grid from "../util/Grid";
import { useTheme } from "@mui/material/styles";

const columnHeadings = ["Case Number", "Title", "Description", "Role"];
const columnTypes = [TEXT, TEXT, TEXT, TEXT];
const cellCss = [{},{wordBreak:'break-word', whiteSpace:'break-spaces'},{wordBreak:'break-word', whiteSpace:'break-spaces'},{}];

export default function CaseGrid({cases, rowClickFn, isFetching})
{
    const theme = useTheme();   

    const rowValues = cases?.map((record) => 
        ({rowProperties: {id:record.id, key:record.id, onClick:()=>{rowClickFn(record);},},
            sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
            values:[{value:[record.caseNumber], sx:{whiteSpace:'pre'}, cellProperties:{key:record.id + "caseNumber"}}, 
                    {value:[record.title], sx:{whiteSpace:'pre'}, cellProperties:{key:record.id + "title"}}, 
                    {value:[record.description], cellProperties:{key:record.id + "description"}}, 
                    {value:[['Admin','Participant','Reviewer'][record.role]], cellProperties:{key:record.id + "role"}}]}));

    return (
            <Grid columnHeadings={columnHeadings} 
                    columnTypes={columnTypes} 
                    cellCss={cellCss} 
                    rowValues={rowValues} 
                    isFetching={isFetching}/>
    );
}