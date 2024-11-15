import React from "react";
import { Dialog, DialogContent, DialogTitle, Box, DialogActions, Button, FormControl, TextField } from "@mui/material";
import { getTitle } from "../../util/utils";
import { IMAGE_ARRAY, PROFILE_IMAGE } from "../../util/PropertyType";
import './LinkDialog.css';
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import Image from "../../util/Image";
//import { apiLinkEntities } from "../../api/entity";
//import { setReRender } from "../../state/EntityTabsSlice";


function getImageId(entityDefinitions, entityOne)
{
    if (!entityDefinitions || !entityOne)
        return undefined;

    let imageId = undefined;

    const entityDefinition = entityDefinitions.find((defs) => defs.id === entityOne.entityDefinition );
    let defProp = entityDefinition.props.find((def) => def.type == PROFILE_IMAGE);
    if (defProp) // no PROFILE_IMAGE property in the entity definition
        imageId = entityOne.propertyValues.find((pVal) => defProp.id === pVal.propertyDefinition)?.value;

    // if no imageId found for PROFILE IMAGE use 
    if (!imageId)
    {
        defProp = entityDefinition.props.find((def) => def.type === IMAGE_ARRAY);
        if (defProp)
            imageId = entityOne.propertyValues.find((val) => val.propertyDefinition === defProp.id)?.value;
    }

    return imageId;
}

export default function LinkDialog({entityOne, entityTwo, entity1Entity2Description, entity2Entity1Description, entityDefinitions, linkFn, closeFn})
{
    const theme = useTheme();
    const dispatch = useDispatch();
    const [entity1Entity2DescriptionState, setentity1Entity2DescriptionState] = React.useState(entity1Entity2Description);
    const [entity2Entity1DescriptionState, setentity2Entity1DescriptionState] = React.useState(entity2Entity1Description);

    const imageId1 = getImageId(entityDefinitions, entityOne);
    const imageId2 = getImageId(entityDefinitions, entityTwo);

    const entityOneName = getTitle(entityDefinitions, entityOne);
    const entityTwoName = getTitle(entityDefinitions, entityTwo);

    return (
        <Dialog open={true} maxWidth='lg'>
            <DialogTitle>Link Entities</DialogTitle>
            <DialogContent>
                <Box sx={{ display:'flex',flexDirection:'row' }}>
                    <Box sx={{ display:'flex', justifyContent:'center', flexDirection:'column' }}>
                        <Box sx={{maxWidth:'200px'}}>{entityOneName}</Box>
                        <Box>                        
                        {
                            imageId1 && 
                            <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', border: imageId1?undefined:'1px solid grey', borderRadius: 5 }}>
                                <Image className={"label-profile-image"} id={imageId1} />
                            </Box>
                        }
                        </Box>
                    </Box>
                    <Box className='arrow-box'>
                        <Box className='arrow-container'>
                            <Box sx={{ borderStyle:'solid', borderColor: theme.palette.primary.main, borderWidth:'7px 0px 7px 7px',  }}>
                                <FormControl variant="standard" fullWidth>
                                    <TextField  
                                        name="entity1Entity2DescriptionState"
                                        fullWidth
                                        size="small"
                                        inputProps={{style:{padding: '0px 5px 0px 5px'}}}
                                        onChange={(event)=>setentity1Entity2DescriptionState(event.target.value)}
                                        value={ entity1Entity2DescriptionState }
                                        sx={{"& fieldset": { border: 'none', boxSizing: 'border-box',},}}/>
                                </FormControl>
                            </Box>
                            <Box className="right-head" sx={{ borderLeftColor:theme.palette.primary.main}}/>
                        </Box>
                        <Box className='arrow-container'> 
                            <Box className="left-head"  sx={{ borderRightColor:theme.palette.primary.main}}/>
                                <Box sx={{ borderStyle:'solid', borderColor: theme.palette.primary.main, borderWidth:'7px 7px 7px 0px' }}>
                                    <FormControl variant="standard" fullWidth>
                                        <TextField
                                            name="entity2Entity1DescriptionState"
                                            fullWidth
                                            size="small"
                                            inputProps={{style:{padding: '0px 5px 0px 5px' }}}
                                            onChange={(event)=>setentity2Entity1DescriptionState(event.target.value)}
                                            value={ entity2Entity1DescriptionState }
                                            sx={{
                                                "& fieldset": { border: 'none', boxSizing: 'border-box' }
                                                }}
                                        />
                                    </FormControl>
                                </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display:'flex', justifyContent:'center', flexDirection:'column' }}>
                        <Box>{entityTwoName}</Box>
                        <Box>
                            {
                                imageId2 && 
                                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'200px', width:'200px', border: imageId2?undefined:'1px solid grey', borderRadius: 5 }}>
                                    <Image className={"label-profile-image"} id={imageId2} />    
                                </Box>
                            }
                        </Box>
                    </Box>                    
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => linkFn(entity1Entity2DescriptionState,entity2Entity1DescriptionState)}>Submit</Button>
                <Button onClick={()=> closeFn()}>Cancel</Button>
            </DialogActions> 
        </Dialog>
    );
}