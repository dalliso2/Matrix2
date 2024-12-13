import { api } from './BaseApi';
import { getTags, onQueryStartedHandler } from './ApiUtils';

const taskApi = api.enhanceEndpoints({addTagTypes:['Task','TaskEntity', 'TaskFile']}).injectEndpoints({
    endpoints: (builder) => ({
        searchTasks: builder.query({
            query: (body) => ({url:`/task/search`, method: 'POST', body}),
            async onQueryStarted(body, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, filter) => getTags('Task', result),
            keepUnusedDataFor: 300
        }),
        getTask: builder.query({
            query: (id) => ({url:`/task/${id}`}),
            async onQueryStarted(id, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, id) => getTags('Task', result),
            keepUnusedDataFor: 300
        }),
        storeTask: builder.mutation({
            query: (task) => ({url: '/task/store', method: 'POST', body: task}),
            async onQueryStarted(data, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving task..." );
            },
            invalidatesTags: (result, error, task) => getTags('Task', result),
        }),
        getEntitiesForTask: builder.query({
            query: (taskId) => ({url:`/task_entity/all_for_task/${taskId}`}),
            async onQueryStarted(data, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, taskId) => getTags('TaskEntity', result),
            keepUnusedDataFor: 300
        }),
        getTasksForEntity: builder.query({
            query: (entityId) => ({url:`/task_entity/all_for_entity/${entityId}`}),
            async onQueryStarted(entityId, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, taskId) => getTags('TaskEntity', result),
            keepUnusedDataFor: 300
        }),
        searchUnlinkedEntitiesForTask: builder.query({
            query: ({taskId, caseId , entityDefinitionIds, searchText}) => ({url:`/task_entity/search_unlinked_entities`, method: 'POST', body: {taskId, caseId, entityDefinitionIds, searchText}}),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId,);
            },
            keepUnusedDataFor: 300
        }),
        storeTaskEntity: builder.mutation({
            query: ({taskId,entityId,description}) => ({url: '/task_entity/store', method: 'POST', body: {taskId,entityId,description}}),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving task...");
            },
            invalidatesTags: (result, error, {taskId, entityId}) => getTags('TaskEntity', result),
        }),
        deleteTaskEntity: builder.mutation({
            query: (taskEntityId) => ({url: '/task_entity/delete', method: 'POST', body: {id:taskEntityId}}),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Deleting task...");
            },
            invalidatesTags: (result, error, taskEntityId) => getTags('TaskEntity', result),
        }),
        getFilesForTask: builder.query({
            query: (taskId) => ({url:`/task_file/all_for_task/${taskId}`}),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, taskId) => getTags('TaskFile', result),
            keepUnusedDataFor: 300
        }),
        searchFilesNotLinkedToTask: builder.query({
            query: ({taskId, searchText}) => ({ url:`/task_file/search_unlinked_files`, 
                                                            method: 'POST', 
                                                            body: {taskId, searchText}
                                                        }),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            keepUnusedDataFor: 300
        }),
        addTaskFiles: builder.mutation({
            query: (taskFiles) => ({url: '/task_file/add', method: 'POST', body: taskFiles}),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Adding files to task...");
            },
            invalidatesTags: (result, error, arg) => getTags('TaskFile', result),
        }),
        removeTaskFile: builder.mutation({
            query: (taskFileId) => ({url: '/task_file/remove', method: 'POST', body: {id:taskFileId}}),
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Removing files from task...");
            },
            invalidatesTags: (result, error, data) => getTags('TaskFile', result),
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