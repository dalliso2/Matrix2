import { api } from './BaseApi';

const taskApi = api.enhanceEndpoints({addTagTypes:['Task','TaskUnlinkedEntity']}).injectEndpoints({
    endpoints: (builder) => ({
        searchTasks: builder.query({
            query: (body) => ({url:`/task/search`, method: 'POST', body}),
            transformResponse: (response, meta, arg) => 
            {
                return response || [];
            },
            providesTags: (result, error, filter) => Array.isArray(result)?[...result.map(({id}) => ({type: 'Task', id}))]:[],
            keepUnusedDataFor: 300
        }),
        getTask: builder.query({
            query: (id) => ({url:`/task/${id}`}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, id) => [{type: 'Task', id:result.id}],
            keepUnusedDataFor: 300
        }),
        storeTask: builder.mutation({
            query: (data) => ({url: '/task/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, data) => [{type: 'Task', id:result.id}],
            //invalidatesTags: (result, error, data) => [{type: 'Task', id:result.id}],
        }),
        getEntitiesForTask: builder.query({
            query: (taskId) => ({url:`/task_entity/all_for_task/${taskId}`}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, taskId) => [{type: 'TaskEntities', id:taskId}].concat(
                                result.payload.map(taskEntity=>({type:'TaskEntity', id:taskEntity.id}))),
        }),
        getTasksForEntity: builder.query({
            query: (entityId) => ({url:`/task_entity/all_for_entity/${entityId}`}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, taskId) => [{type: 'EntityTasks', id:taskId}].concat(
                                result.payload.map(taskEntity=>({type:'TaskEntity', id:taskEntity.id}))),
        }),
        searchUnlinkedEntitiesForTask: builder.query({
            query: ({taskId, caseId , entityDefinitionIds, searchText}) => ({url:`/task_entity/search_unlinked_entities`, method: 'POST', body: {taskId, caseId, entityDefinitionIds, searchText}}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, taskId) => result?
                result.payload.flatMap(entityGroup=>entityGroup.map(entity=>({type: 'TaskUnlinkedEntity', id:entity.id})))
                :[],
        }),
        storeTaskEntity: builder.mutation({
            query: ({taskId,entityId,description}) => ({url: '/task_entity/store', method: 'POST', body: {taskId,entityId,description}}),
            invalidatesTags: (result, error, {taskId, entityId}) => 
                [{type: 'TaskEntity', id:result.payload.id}, {type: 'TaskEntities', id:taskId}, {type: 'EntityTasks', id:entityId}],
        }),
        deleteTaskEntity: builder.mutation({
            query: (taskEntityId) => ({url: '/task_entity/delete', method: 'POST', body: {id:taskEntityId}}),
            invalidatesTags: (result, error, data) => [{type: 'TaskEntity', id:result.payload.id}],
        }),

        getFilesForTask: builder.query({
            query: (taskId) => ({url:`/task_file/all_for_task/${taskId}`}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, taskId) => [{type: 'TaskFiles', id:taskId}],
        }),
        searchFilesNotLinkedToTask: builder.query({
            query: ({taskId, searchText}) => ({ url:`/task_file/search_unlinked_files`, 
                                                            method: 'POST', 
                                                            body: {taskId, searchText}
                                                        }),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            keepUnusedDataFor: 300
        }),
        addTaskFiles: builder.mutation({
            query: (taskFiles) => ({url: '/task_file/add', method: 'POST', body: taskFiles}),
            invalidatesTags: (result, error, arg) => [{type: 'TaskFiles', id:arg[0].taskId}],
            // invalidatesTags: (result, error, data) => [{type: 'TaskUnlinkedEntity', id:result.payload.matrixEntity.id},
            //                                             {type: 'TaskEntity', id:result.payload.id},
            //                                             {type: 'Task', id:result.payload.task.id}],
        }),
        removeTaskFile: builder.mutation({
            query: (taskFileId) => ({url: '/task_file/remove', method: 'POST', body: {id:taskFileId}}),
            invalidatesTags: (result, error, data) => [{type: 'TaskFiles', id:taskFiles[0].taskId}],
            // invalidatesTags: (result, error, data) => [{type: 'TaskUnlinkedEntity', id:result.payload.matrixEntity.id},
            //                                             {type: 'TaskEntity', id:result.payload.id},
            //                                             {type: 'Task', id:result.payload.task.id}],
        }),
    }),
});

export const {  useLazySearchTasksQuery, 
                useGetTaskQuery, 
                useStoreTaskMutation, 
                useGetEntitiesForTaskQuery, 
                useGetTasksForEntityQuery, 
                useSearchUnlinkedEntitiesForTaskQuery, 
                useStoreTaskEntityMutation, 
                useLazySearchUnlinkedEntitiesForTaskQuery,
                useDeleteTaskEntityMutation,
                useGetFilesForTaskQuery,
                useAddTaskFilesMutation, 
                useLazySearchFilesNotLinkedToTaskQuery,
                useRemoveTaskFileMutation
            } = taskApi;