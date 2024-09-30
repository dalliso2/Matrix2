import { createSelector, createSlice } from '@reduxjs/toolkit';
import { current } from '@reduxjs/toolkit';

export const TAB_TYPE_SEARCH = 0;
export const TAB_TYPE_TASK = 1;

export const taskSearchDataTemplate = {
    id: undefined,
    tabType: TAB_TYPE_SEARCH,
    searchText: undefined,
    assignedTo: [],
    status: [],
    results: []
};

export const taskDataTemplate = {
    id: undefined,
    tabType: TAB_TYPE_TASK,
    title: undefined,
    taskData: undefined,
}

const initialState = 
{
    systemInErrorState: false,
    messageBoxData: [],
    waitMessages: [],
    sysAdminTab: 0,
    // current user state
    darkTheme: false,
    // case tabs
    caseTabCaseIds: [],
    currentCaseTabIndex: 0,
    activeCase: undefined,
    // user tabs
    userSearchText: "",
    // entity tabs
    entitySearchText: "",
    entitySearchEntityDefIdArray: [],   
    entitySearchResults: [],
    entityTabEntityData: [],
    currentEntityTabIndex: 0,
    // entity designer tab
    selectedEntityDefinitionId: undefined,
    // task tabs
    currentTaskTabIndex: 0,
    taskTabData: [{...taskSearchDataTemplate, title: "Search Tasks"}],
    // link chart state
    currentLinkChartId:undefined,
    chartEditsNotSaved: false,
};

const appSlice = createSlice({
    name: "appReducer",
    initialState,  
    reducers:
    {
        setSystemInErrorState:
        {
            reducer(state, action)
            {
                console.log(action);
                state.systemInErrorState = action.payload;
            },
        },
        setMessageBoxData:
        {
            reducer(state, action)
            {
                if (state.messageBoxData.findIndex(entry => action.payload.key === entry.key) === -1)
                {
                    state.messageBoxData.push(action.payload);
                }
            },
            prepare(key, title, message)
            {
                return { payload: { key, title, message } };
            }
        },
        removeMessageBoxData:
        {
            reducer(state, action)
            {
                state.messageBoxData = state.messageBoxData.filter(entry => action.payload.key != entry.key)
            },
            prepare(key)
            {
                return { payload: { key } };
            }
        },
        setWaitMessage:
        {
            reducer(state, action)
            {
                if (state.waitMessages.findIndex(entry => action.payload.key === entry.key) == -1)
                    state.waitMessages.push(action.payload);
            },
            prepare(key, message)
            {
                return { payload: { key, message } };
            }
        },
        removeWaitMessage:
        {
            reducer(state, action)
            {
                state.waitMessages = state.waitMessages.filter(entry => action.payload.key != entry.key)
            },
            prepare(key)
            {
                return { payload: { key } };
            }
        },
        clearAllMessages:
        {
            reducer(state, action)
            {
                state.messageBoxData = [];
                state.waitMessages = [];
            }
        },
        setSysAdminTab: (state, action) =>
        {
            state.sysAdminTab = action.payload;
        },
        setStateDarkTheme: (state, action) =>
        {
            state.darkTheme = action.payload;
        },
        addCaseTab:
        {
            // payload is the case id
            reducer(state, action)
            {
                const caseIdIndex = state.caseTabCaseIds.findIndex(caseId => caseId === action.payload);
                if (caseIdIndex < 0)
                {
                    state.caseTabCaseIds.push(action.payload);
                    state.currentCaseTabIndex = state.caseTabCaseIds.length;
                }
                else
                {
                    state.currentCaseTabIndex = caseIdIndex + 1;    
                }
            }
        },
        removeCaseTab:
        {
            // payload is the id of the case to remove
            reducer(state, action)
            {
                if (state.currentCaseTabIndex == state.caseTabCaseIds.length)
                    state.currentCaseTabIndex = state.currentCaseTabIndex - 1;
                state.caseTabCaseIds = state.caseTabCaseIds.filter(caseId => caseId !== action.payload);
            },
        },
        setCurrentCaseTab:
        {
            reducer(state, action)
            {
                state.currentCaseTabIndex = action.payload;
            },
        },
        setActiveCase:
        {
            reducer(state, action)
            {
                state.activeCase = action.payload;
            },
        },
        setUserSearchText:
        {
            reducer(state, action)
            {
                state.userSearchText = action.payload;
            },
        },
        setEntitySearchText:
        {
            reducer(state, action)
            {
                state.entitySearchText = action.payload;
            },
        },
        setEntitySearchEntityDefIdArray:
        {
            reducer(state, action)
            {
                state.entitySearchEntityDefIdArray = action.payload;
            }
        },
        setEntitySearchResults:
        {
            reducer(state, action)
            {
                state.entitySearchResults = action.payload;
            },
        },
        replaceSearchResult:
        {
            reducer(state, action)
            {
                console.log(current(state));
                for (let entityType in state.entitySearchResults)
                {
                    const entityIndex = state.entitySearchResults[entityType].findIndex(entityData => entityData.id === action.payload.id);
                    if (entityIndex >= 0)
                    {
                        state.entitySearchResults[entityType][entityIndex] = action.payload;
                        break;
                    }
                }
                console.log(current(state));
            }
        },
        addEntityTab:
        {
            // payload is the entity
            reducer(state, action)
            {
                const entityIndex = state.entityTabEntityData.findIndex(entityTabData => entityTabData.entityId === action.payload.entityId);
                if (entityIndex < 0)
                {
                    state.entityTabEntityData.push(action.payload);
                    state.currentEntityTabIndex = state.entityTabEntityData.length;
                }
                else
                {
                    state.entityTabEntityData[entityIndex] = action.payload;
                    state.currentEntityTabIndex = entityIndex + 1;
                }
            }
        },
        removeEntityTab:
        {
             // payload is the id of the entity to remove
             reducer(state, action)
             {
                 if (state.currentEntityTabIndex == state.entityTabEntityData.length)
                     state.currentEntityTabIndex = state.currentEntityTabIndex - 1;
                 state.entityTabEntityData = state.entityTabEntityData.filter(entityData => entityData.entityId !== action.payload);
             }
        },
        setCurrentEntityTab:
        {
            reducer(state, action)
            {
                console.log("setCurrentEntityTab")
                console.log(action.payload);
                state.currentEntityTabIndex = action.payload;
            }
        },
        updateEntityTabTitle:
        {
            reducer(state, action)
            {
                // payload wll be {enityId, title}
                state.entityTabEntityData.find(entityTabData => entityTabData.entityId === action.payload.entityId).title = action.payload.title;   
            }
        },
        setSelectedEntityDefinitionId:
        {
            reducer(state, action)
            {
                state.selectedEntityDefinitionId = action.payload;
            }
        },
        setCurrentTaskTab: 
        {
            reducer(state, action)
            {
                state.currentTaskTabIndex = action.payload;
            },
            prepare(tabIndex)
            {
                return { payload: tabIndex };
            }
        },               
        addTaskTab:
        {
            reducer(state, action)
            {
                console.log(action);
                const existingTabIndex = state.taskTabData.findIndex(tab=>tab.tabType===TAB_TYPE_TASK && tab.id === action.payload.taskId);

                if (existingTabIndex < 0)
                {
                    state.taskTabData.push(action.payload);
                    state.currentTaskTabIndex = state.taskTabData.length-1;// subtract 1 because of permanent search tab
                }
                else
                {
                    state.taskTabData[existingTabIndex] = action.payload;
                    state.currentTaskTabIndex = existingTabIndex;
                }
            },
            prepare(tabData)
            {
                return { payload: tabData };
            }
        },
        removeTaskTab: 
        {
            reducer(state, action)
            {
                console.log('removeTaskTab');
                console.log(current(state.taskTabData));
                console.log(action.payload);
                state.taskTabData = state.taskTabData.filter(tabData=>tabData.tabType===TAB_TYPE_SEARCH
                    || tabData.taskId !== action.payload);
                state.currentTaskTabIndex = 0;  
            },
            prepare(taskId)
            {
                return { payload: taskId };
            }
        },
        updateTaskTabData:
        {
            reducer(state, action)
            {
                console.log('updateTaskTabData');
                console.log(action);
                state.taskTabData[state.currentTaskTabIndex][action.payload.key] = action.payload.value;
            },
            prepare(tabId, key, value)
            {
                return { payload: {tabId, key, value} };
            }
        },
        setChartEditsNotSaved:
        {
            reducer(state, action)
            {
                state.chartEditsNotSaved = action.payload;
            }
        },
    },
});

export const selectSystemInErrorState = state => state.app.systemInErrorState;
export const selectMessageBoxData = state => state.app.messageBoxData.values().next().value;
export const selectDarkTheme = state => state.app.darkTheme;    
export const selectCurrentSysAdminTab = state => state.app.sysAdminTab;
export const selectCaseTabCaseIds = state => state.app.caseTabCaseIds;
export const selectCurrentCaseTabIndex = state => state.app.currentCaseTabIndex;
export const selectActiveCase = state => state.app.activeCase;
export const selectUserSearchText = state => state.app.userSearchText;
export const selectEntitySearchText = state => state.app.entitySearchText;
export const selectEntityTabData = state => state.app.entityTabEntityData;
export const selectEntitySearchEntityDefIdArray = state => state.app.entitySearchEntityDefIdArray;
export const selectEntitySearchResults = state => state.app.entitySearchResults;
export const selectEntityFromSearchResults = createSelector(selectEntitySearchResults, (state,entityId) => entityId, 
            (searchResults,entityId) => searchResults.flat().find(entity => entity.id === entityId));
export const selectCurrentEntityTabIndex = state => state.app.currentEntityTabIndex;
export const selectSelectedEntityDefinitionId = state => state.app.selectedEntityDefinitionId;
// export const selectWaitingOnKey = state => state.app.waitMessages.find(entry => entry.key === key);
// export const selectCurrentWaitMessageKey = state => state.app.waitMessages;
export const selectTabTaskData = state => state.app.taskTabData;
export const selectCurrentTaskTabIndex = state => state.app.currentTaskTabIndex;
export const selectCurrentTabData = state => state.app.taskTabData[state.app.currentTaskTabIndex];
// link charts
export const selectChartEditsNotSaved = state => state.app.chartEditsNotSaved;

export const selectGetWaitMessage = state => 
{
    const val = state.app.waitMessages.values().next().value;
    if (val)
        return val.message;
    else
        return val;
}

export const {  
                setSystemInErrorState,    
                setWaitMessage, 
                removeWaitMessage, 
                setMessageBoxData, 
                removeMessageBoxData,
                clearAllMessages,
                setStateDarkTheme,
                setSysAdminTab,
                addCaseTab,
                setCurrentCaseTab,
                removeCaseTab,
                setUserSearchText,
                setActiveCase,
                setEntitySearchEntityDefIdArray,
                setEntitySearchResults,
                replaceSearchResult,
                setEntitySearchText,
                addEntityTab,
                removeEntityTab,
                updateEntityTabTitle,
                setCurrentEntityTab,
                setOneEntity,
                setManyEntites, 
                setSelectedEntityDefinitionId,
                setCurrentTaskTab,
                addTaskTab,
                removeTaskTab,
                updateTaskTabData,
            } = appSlice.actions;

export default appSlice.reducer;