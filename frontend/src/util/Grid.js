//
//  Grid is a React component to make tables uniform within the app
//

/////////// React imports //////////
import React from "react";
/////////// MUI imports //////////
import { useTheme } from "@emotion/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/system";
import LoadingSkeleton from "./LoadingSkeleton";

// Example input parameters

// const columnHeadingsTest = 
// ["Username", "Last Name", "First Name", "Email", "Cell Number", "Work Number", "Agency", "Admin"]

// function clickFunction()
// {
//     alert("ABC");
// }

// const rowsTest = 
// [
//     { rowProperties:{id:1, abc:"123", onClick:clickFunction}, values:[["dallison"], ["Allison"], ["Daryl"], ["adfa@adsfasdf"], ["333-333-3333"], ["234-234-2342"], ["FBI"], ["Yes"]]},
//     { rowProperties:{id:2, abc:"2343"}, values:[["jgoeden"], ["Jolene"], ["Goeden"], ["adfa@ddddddddd"], ["335-346-3345"], ["111-111-111"], ["AST"], ["No"]]},
//     { rowProperties:{id:3, abc:"4323"}, values:[["dallison"], ["Allison"], ["Daryl"], ["adfa@adsfasdf"], ["333-333-3333"], ["234-234-2342"], ["FBI"], ["Yes"]]},
//     { rowProperties:{id:4, abc:"erwe"}, values:[["dallison"], ["Allison"], ["Daryl"], ["adfa@adsfasdf"], ["333-333-3333"], ["234-234-2342"], ["FBI"], ["Yes"]]},
// ]

// const columnTypes =
// [
//     TEXT,TEXT,TEXT,TEXT
// ]
// export default function Grid({header=undefined, columnHeadings=columnHeadingsTest, columnTypes={columnTypes}, rowValues=rowsTest})

/**
 * Returns a Grid component, used to standardize the look of tables.  
 *     
 * See example parameters above
 * 
 * @param {String} header - String to display above the table
 * @param {[]} columnHeadings - array of strings used as column headings
 * @param {[]} columnTypes - array of property types defined in PropertyType.js
 * @param {[]} rowValues - array of objects.  Each object contains an object identified with key "rowProperties"
 *                          and an array of arrays identified by the values key.  The row properties will be
 *                          spread as attributes of the table row (<tr>) element. 
 * @returns <Grid> component
 */

const rowsTest = 
[
    // {   rowProperties:{id:1, onClick:()=>console.log("row 1 clicked")}, 
    //     values:[    {value:["dallison"],sx:{color:'red', cursor:'pointer'}, cellProperties:{onClick:()=>console.log("cell 1 clicked")}}, 
    //                 {value:["Allison"],sx:{color:'yellow'}}, 
    //                 {value:["Daryl"],sx:{color:'red'}}, 
    //                 {value:["Yes"],sx:{color:'red'}}, 
    //                 {value:["Yes"],sx:{color:'red'}} 
    //             ]
    // },
]

const columnHeadingsTest = 
["Username", "Last Name", "First Name", "Enabled", "Admin"]

export default function Grid({header=undefined, 
                                columnHeadings=columnHeadingsTest, 
                                cellCss=[], 
                                rowValues=rowsTest, 
                                isFetching=false,
                                noResultsMessage})
{
    const theme = useTheme();
    
    return ( 
        <>
            <Box><h5 style={{paddingBottom:1,margin:0}}>{header}</h5></Box>
            <Box sx={{flexGrow:1, overflow:'hidden', position:'relative'
            }}> 
                <TableContainer sx={{ height:'100%',maxWidth:'100%',scrollbarWidth:'thin', overflow:isFetching?'hidden':'auto', borderRadius:'5px'}}>
                    <Table stickyHeader aria-label="sticky table" size="small" sx={{height:noResultsMessage?'100%':undefined}}> 
                        <TableHead> 
                        <TableRow key={"firstRow"}>
                            {   
                                columnHeadings.map((heading, index) =>  
                                    <TableCell key={index} sx={{pt:1, 
                                                                pb:1, 
                                                                verticalAlign:'middle', 
                                                                backgroundColor:theme.palette.primary.main, 
                                                                color:theme.palette.primary.contrastText, 
                                                                borderColor: theme.palette.background.default, 
                                                                position:'sticky', 
                                                                whiteSpace:'nowrap',}}>{heading}</TableCell>
                                )
                            }
                        </TableRow>
                        </TableHead>
                        <TableBody sx={{}}> 
                        {
                            isFetching &&
                            <TableRow sx={{ zIndex:1000, p:0, position:'absolute', height:'100%', width:'100%', overflow:'hidden', backgroundColor:theme.palette.background.default}}>
                                <TableCell colSpan={columnHeadings?.length} sx={{position:'absolute', width:'100%', height:'100%', overflow:'hidden', p:0, m:0}}><LoadingSkeleton/></TableCell>
                            </TableRow>
                        }
                        { 
                            rowValues.length===0 && noResultsMessage?
                                <TableRow sx={{ p:0, height:'100%', width:'100%', overflow:'hidden'}}>
                                    <TableCell colSpan={columnHeadings?.length} sx={{ p:0, textAlign:'center', opacity:0.5, border:0 }}>
                                        <h2 sx={{p:0}}>{noResultsMessage}</h2>
                                    </TableCell>
                                </TableRow>
                            : rowValues && rowValues.map((row, rowIndex) =>
                                <TableRow key={rowIndex} {...row.rowProperties} sx={{...row.sx}}>
                                {
                                        row.values?.map((value, valueIndex) => (
                                            <TableCell key={valueIndex}  {...value.cellProperties} 
                                                        sx={{ p:1, whiteSpace:'pre-wrap', verticalAlign:'middle', ...value.sx, }}>
                                                        {value?.value}
                                            </TableCell>   
                                        ))
                                }
                                </TableRow>
                            )
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}