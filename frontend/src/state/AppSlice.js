import { createSelector, createSlice } from '@reduxjs/toolkit';

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
    authToken: undefined,
    currentUser: undefined,
    systemInErrorState: false,
    messageBoxData: [],
    waitMessages: [],
    sysAdminTab: 0,
    // current user state
    //darkTheme: false,
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
    // link chart tabs
    currentLinkChartTabIndex: 0,
    linkChartTabIsNew: false,
    linkChartTabsData:[],
    // timeline tabs
    currentTimelineTabIndex: 0,
    timelineTabIsNew: false,
    timelineTabsData:[],
};

const appSlice = createSlice({
    name: "appReducer",
    initialState:JSON.parse(JSON.stringify(initialState)), 
    reducers:
    {
        resetState:
        {
            reducer(state, action)
            {
                return { ...JSON.parse(JSON.stringify(initialState)), messageBoxData:state.messageBoxData };
            }
        },
        setAuthToken:
        {
            reducer(state, action)
            {
                state.authToken = action.payload;
            },
        },
        setCurrentUser:
        {
            reducer(state, action)
            {
                state.currentUser = action.payload;
                //state.darkTheme = action.payload.darkTheme;
            },
        },
        setSystemInErrorState:
        {
            reducer(state, action)
            {
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
        // setStateDarkTheme: (state, action) =>
        // {
        //     state.darkTheme = action.payload;
        // },
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
                for (let entityType in state.entitySearchResults)
                {
                    const entityIndex = state.entitySearchResults[entityType].findIndex(entityData => entityData.id === action.payload.id);
                    if (entityIndex >= 0)
                    {
                        state.entitySearchResults[entityType][entityIndex] = action.payload;
                        break;
                    }
                }
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
                state.currentEntityTabIndex = action.payload;
            }
        },
        updateEntityTabTitle:
        {
            reducer(state, action)
            {
                // payload wll be {enityId, title}
                const tabData = state.entityTabEntityData.find(entityTabData => entityTabData.entityId === action.payload.entityId);
                if (tabData)
                    tabData.title = action.payload.title;   
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
                state.taskTabData[state.currentTaskTabIndex][action.payload.key] = action.payload.value;
            },
            prepare(tabId, key, value)
            {
                return { payload: {tabId, key, value} };
            }
        },
        addLinkChartTab:
        {
            // payload: {id: id, name: name, zoom:, pan:{x:,y:}}
            reducer(state, action)
            {
                const linkChartIndex = state.linkChartTabsData.findIndex(tabData => tabData.id === action.payload.id);

                if (linkChartIndex < 0)
                {
                    state.linkChartTabsData.push(action.payload);
                    state.currentLinkChartTabIndex = state.linkChartTabsData.length;
                    state.linkChartTabIsNew = true;
                }
                else
                {
                    state.linkChartTabsData[linkChartIndex] = action.payload;
                    // set current tab index to entityIndex + 1 because the first tab
                    // is always the link chart list
                    state.currentLinkChartTabIndex = linkChartIndex + 1;
                }
            }
        },
        removeLinkChartTab:
        {
             // payload is the id of the link chart to remove
             reducer(state, action)
             {
                 if (state.currentLinkChartTabIndex == state.linkChartTabsData.length)
                     state.currentLinkChartTabIndex = state.currentLinkChartTabIndex - 1;
                 state.linkChartTabsData = state.linkChartTabsData.filter(linkChartData => linkChartData.id !== action.payload);
             }
        },
        setCurrentLinkChartTab:
        {
            reducer(state, action)
            {
                state.currentLinkChartTabIndex = action.payload;
            }
        },
        setLinkChartTabIsNew:
        {
            reducer(state, action)
            {
                state.linkChartTabIsNew = action.payload;
            }
        },
        updateLinkChartTabTitle:
        {
            reducer(state, action)
            {
                // payload: {id: id, name: name}
                state.linkChartTabsData.forEach(linkChartTabData => 
                    {
                        if (linkChartTabData.id === action.payload.id)
                            linkChartTabData.name = action.payload.name;   
                    });
            }
        },
        /////////////////////////////////////////////////////
        addTimelineTab:
        {
            // payload: {id: id, name: name, zoom:, pan:{x:,y:}}
            reducer(state, action)
            {
                const timelineIndex = state.timelineTabsData.findIndex(tabData => tabData.id === action.payload.id);

                if (timelineIndex < 0)
                {
                    state.timelineTabsData.push(action.payload);
                    state.currentTimelineTabIndex = state.timelineTabsData.length;
                    state.timelineTabIsNew = true;
                }
                else
                {
                    state.timelineTabsData[timelineIndex] = action.payload;
                    // set current tab index to timeline index + 1 because the first tab
                    // is always the timeline list
                    state.currentTimelineTabIndex = timelineIndex + 1;
                }
            }
        },
        removeTimelineTab:
        {
             // payload is the id of the timeline to remove
             reducer(state, action)
             {
                 if (state.currentTimelineTabIndex == state.timelineTabsData.length)
                     state.currentTimelineTabIndex = state.currentTimelineTabIndex - 1;
                 state.timelineTabsData = state.timelineTabsData.filter(timelineData => timelineData.id !== action.payload);
             }
        },
        setCurrentTimelineTab:
        {
            reducer(state, action)
            {
                state.currentTimelineTabIndex = action.payload;
            }
        },
        setTimelineTabIsNew:
        {
            reducer(state, action)
            {
                state.timelineTabIsNew = action.payload;
            }
        },
        updateTimelineTabTitle:
        {
            reducer(state, action)
            {
                // payload: {id: id, name: name}
                state.timelineTabsData.forEach(timelineTabData => 
                    {
                        if (timelineTabData.id === action.payload.id)
                            timelineTabData.name = action.payload.name;   
                    });
            }
        },        
    },
});

export const selectAuthToken = state => state.app.authToken;    
export const selectCurrentUser = state => state.app.currentUser;    
export const selectSystemInErrorState = state => state.app.systemInErrorState;
export const selectMessageBoxData = state => state.app.messageBoxData.values().next().value;
//export const selectDarkTheme = state => state.app.darkTheme;    
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
export const selectCurrentLinkChartTabIndex = state=>state.app.currentLinkChartTabIndex;
export const selectLinkChartsTabData = state => state.app.linkChartTabsData;
export const selectLinkChartTabIsNew = state => state.app.linkChartTabIsNew;
// timelines
export const selectCurrentTimelineTabIndex = state=>state.app.currentTimelineTabIndex;
export const selectTimelinesTabData = state => state.app.timelineTabsData;
export const selectTimelineTabIsNew = state => state.app.timelineTabIsNew;
export const selectGetWaitMessage = state => 
{
    const val = state.app.waitMessages.values().next().value;
    if (val)
        return val.message;
    else
        return val;
}

export const {  
                resetState,
                setAuthToken,
                setCurrentUser,
                setSystemInErrorState,    
                setWaitMessage, 
                removeWaitMessage, 
                setMessageBoxData, 
                removeMessageBoxData,
                clearAllMessages,
                //setStateDarkTheme,
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
                addLinkChartTab,
                removeLinkChartTab,
                setCurrentLinkChartTab,
                updateLinkChartTabTitle,
                setLinkChartTabIsNew,
                addTimelineTab,
                removeTimelineTab,
                setCurrentTimelineTab,
                updateTimelineTabTitle,
                setTimelineTabIsNew
            } = appSlice.actions;

export default appSlice.reducer;