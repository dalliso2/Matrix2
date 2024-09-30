import React, { useEffect } from 'react';
import Content from '../../util/Content';
import EntityDefinitionList from './EntityDefinitionList';
import EntityDefinition from './EntityDefinition';
//import { useGetAllEntityDefinitionsQuery } from '../../api/EntityDefinitionApi';
import { useSelector } from 'react-redux';
import { selectSelectedEntityDefinitionId, setSelectedEntityDefinitionId } from '../../state/AppSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const defaultEntityDefinition = { id: undefined,name: undefined,description: undefined,includeInLinkChart: true, version:1, props: [] }; 

export default function EntityDesigner()
{
    const dispatch = useDispatch();
    const selectedEntityDefinitionId = useSelector(selectSelectedEntityDefinitionId);
    const [selectedEntityDefinition, setSelectedEntityDefinition] = useState(undefined);

    useEffect(() => {
        if (selectedEntityDefinitionId === 'new')
            setSelectedEntityDefinition(()=>({...defaultEntityDefinition}));
    }, [selectedEntityDefinitionId]);

    useEffect(() => {
        if (selectedEntityDefinition)
            dispatch(setSelectedEntityDefinitionId(selectedEntityDefinition.id));
    }, [selectedEntityDefinition]);

    // const { data:envelope, refetch, error, isLoading } = useGetAllEntityDefinitionsQuery();
    // const entityDefinitions = envelope?.payload;
    // const selectedEntityDefinition = selectedEntityDefinitionId === 'new' ? {...defaultEntityDefinition} 
    //                                     :entityDefinitions?.find(entityDef=>entityDef.id === selectedEntityDefinitionId);

    return (
        <Content sx={{ display:'flex', gap:'10px', alignItems:'stretch'}}>
            <EntityDefinitionList setSelectedEntityDefinition={setSelectedEntityDefinition}/>
            <EntityDefinition selectedEntityDefinition={selectedEntityDefinition} />
        </Content>
    );
}