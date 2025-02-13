/**
 *      Component to display list of system users
 */
/////////// React imports //////////
/////////// MUI imports //////////
import React from 'react';
/////////// redux imports //////////
/////////// Matrix2 imports //////////
import { TEXT, PROFILE_IMAGE } from "../../util/PropertyType";
import Grid from "../../util/Grid";
import { useTheme } from "@mui/material";
import { getListComponent } from "../../util/DisplayComponentFactory";
import { useGetAllAgenciesQuery } from '../../api/AgencyApi';
import { handleQueryResultsWithWaitMessage } from '../../api/ApiUtils';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const emptyEntity = 
{ 
    name: "", 
    description: "",
    removed: false,
    props: []
} 

const columnHeadings = ["Username", "Last Name", "First Name", "Photo", "Email", "Cell Number", "Work Number", "Agency", "Admin"]
const columnTypes = [TEXT,TEXT,TEXT,PROFILE_IMAGE, TEXT,TEXT,TEXT,TEXT,TEXT];

export default function UserDataGrid({users, onClickUser}) 
{
    const dispatch = useDispatch();
    const allAgencyQueryResults = useGetAllAgenciesQuery();
    const allAgencies = allAgencyQueryResults?.data?.payload;

    useEffect(() => {
        handleQueryResultsWithWaitMessage(allAgencyQueryResults, dispatch);
    }, [allAgencyQueryResults?.isFetching]);

    const theme = useTheme();
    const rowValues = users && users.map((user) => {
        return {rowProperties:{ id:user.id, onClick: ()=>onClickUser(user)},
                sx:{cursor:'pointer', '&:hover':{backgroundColor:theme.palette.action.hover}},
                values:[{value:[user.username]}, {value:[user.lastName]}, {value:[user.firstName]}, 
                {value:user.profileImage && [getListComponent(PROFILE_IMAGE, [user.profileImage])]},
                {value:[user.email]},{value:[user.cellNumber]}, {value:[user.workNumber]}, 
                {value:[allAgencies.find(agency=>agency.id === user.agency)?.name]},{value:[user.isAdmin?"Yes":"No"]}]}});

    return (
            <Grid columnHeadings={columnHeadings} rowValues={rowValues}/>
    );
}

