// import React from "react";
// import { useState } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";
// import { MULTILINE_TEXT } from "../../util/PropertyType";
// import { getInputComponent } from "../../util/InputComponentFactory";
// import { apiCall } from "../../api/base";
// import { apiStoreTaskEntity } from "../../api/task";
// import { useDispatch } from "react-redux";

// export default function TaskEntityRelationshipDialog({taskObj,entityObj,successFn,closeFn})
// {
//     const [description, setDescription] = useState('');
//     const dispatch = useDispatch();

//     async function saveTaskEntityRelationship()
//     {
//         const json = await apiCall({  method:()=>apiStoreTaskEntity(taskObj.id, entityObj.id, description), 
//             dispatchFn: dispatch,
//             waitMessage: "Saving...",});

//         if (json && !json.api_error)
//         {
//             successFn(entityObj.id);
//             closeFn();
//         }
//     }

//     return (
//         <Dialog open={true} maxWidth='sm' fullWidth onClose={closeFn}>
//             <DialogTitle>Entity Reference</DialogTitle>
//             <DialogContent>
//                 <div>How was {entityObj.name} referenced in this task?</div>
//                 {getInputComponent({  name: 'description', 
//                                     label: 'Description', 
//                                     type: MULTILINE_TEXT, 
//                                     rows:4, value:'',  
//                                     required: true, 
//                                     value: description,
//                                     onChange: (event) => setDescription(event.target.value) },
//             )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={()=>saveTaskEntityRelationship()}>Save</Button>
//                 <Button onClick={()=>closeFn()}>Cancel</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }