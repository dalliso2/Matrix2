import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SideDrawer from '../../navigation/SideDrawer';
import { Outlet } from 'react-router-dom';
import MatrixAppBar from '../../navigation/MatrixAppBar';
import SideDrawerSpacer from '../../navigation/SideDrawerSpacer';
import { useSelector } from 'react-redux';
import { selectWaitProgressOn } from '../../state/MatrixAppSlice';
import '../../style/Main.css'
import '../../style/DragDropFile.css'
import './dragdroptesttarget.css'
import { selectMatrixCaseStatusLoading } from '../../state/MatrixCaseSlice';
import DragDropTarget from './DragDropTarget';

export default function DragDropTest()  
{ 
  function fileIdsCallback(fileIds)
  {
    //console.log(fileIds);
  }

  return (
    <Box className="appcontainer" sx={{height:"100%", display:"flex"}}>
        <Box className="maincontentcontainer" sx={{display: "flex"}}>
          <Box id="label-file-upload" sx={{height:'300px',width:'300px', backgroundColor:'black', position:'relative'}}>
            <DragDropTarget fileIdsCallback={fileIdsCallback}/>
          </Box>
        </Box>        
    </Box>
  );
}
