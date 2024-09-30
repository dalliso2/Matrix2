// import React from "react";
// import Grid from '../../util/Grid';
// import { useDispatch } from "react-redux";
// import { AddLinkSharp } from "@mui/icons-material";
// import { useTheme } from "@mui/material";
// import { getListComponent } from "../../util/DisplayComponentFactory";
// import IconButton from "@mui/material/IconButton";
// import TaskEntityRelationshipDialog from "./TaskEntityRelationshipDialog";

// // entityList is an array of entity objects with the same entityDefinition
// export default function TaskEntityLinkList({taskObj, entityDefinition, entityList, reRenderFn, })
// {
//     const dispatch = useDispatch(); 
//     const theme = useTheme();
//     const [entityObj, setEntityObj] = React.useState(undefined);
//     //const [unlinkedEntityList, setUnlinkedEntityList] = React.useState([...entityList]);
//     const [render, setRender] = React.useState(false);

//     const [showLinkDialog, setShowLinkDialog] = React.useState(false);  

//     const columnHeadings = !!entityDefinition && ["",...entityDefinition.props.filter(prop=>prop.includeInList).map(prop => prop.name)];

//     function removeEntityFn(entityId)
//     {
//         entityList.splice(entityList.findIndex(entity=>entity.id === entityId),1);
//         setRender(!render);
//         reRenderFn();
//     }

//     const rows = [];
//     entityList.forEach(entity => {
//         const row = {rowProperties:{id:entity.id}, 
//                         values:[{   cellProperties:{ }, 
//                                     sx:{ width:0 }, 
//                                     value:[<IconButton onClick={()=>setEntityObj(entity)}><AddLinkSharp/></IconButton>]},
//                                 ...entityDefinition.props.filter(prop=>prop.includeInList).map(prop => {return{propertyDefinition: prop.id, type:prop.type, value:[]}})
//                             ]};

//         for (let prop of entity.propertyValues)
//             row.values.find(value=>value.propertyDefinition === prop.propertyDefinition)?.value.push(prop.value);
    
//         row.values.forEach(value=>value.value = getListComponent(value.type, value.value));
//         rows.push(row);
//     });

//     return (
//         <>
//         {
//             rows.length > 0 &&
//                 <Grid header={entityDefinition.name} columnHeadings={columnHeadings} rowValues={rows}/>
//         }
//         {entityObj && <TaskEntityRelationshipDialog taskObj={taskObj} 
//                                         entityObj={entityObj} 
//                                         successFn={(id)=>removeEntityFn(id)}
//                                         closeFn={()=>setEntityObj(undefined)}/>}
//         </>
//     );
// }