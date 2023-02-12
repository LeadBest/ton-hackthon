/** @format */

import { api, prefixProxyEndpoint } from '@/services';

export interface TodoItem {
	_created: number;
	_data_type: string;
	_is_deleted: boolean;
	_modified: number;
	_self_link: string;
	_user: string;
	_uuid: string;
	completed: boolean;
	title: string;
}

export interface TodosResponse {
	cursor?: number;
	items: TodoItem[];
	next_page?: number;
}

interface TodoBody {
	_uuid?: string;
	title: string;
	completed: boolean;
}

interface DeleteTodoBody {
	_uuid: string;
}

export const todosApi = api.injectEndpoints({
	endpoints: builder => ({
		createTodo: builder.mutation<TodosResponse, TodoBody[]>({
			query: body => ({
				url: prefixProxyEndpoint('/v1/task'),
				method: 'POST',
				body,
			}),
		}),
		deleteTodo: builder.mutation<TodosResponse, DeleteTodoBody[]>({
			query: body => ({
				url: prefixProxyEndpoint('/v1/task'),
				method: 'DELETE',
				body,
			}),
		}),
		updateTodo: builder.mutation<TodosResponse, TodoBody[]>({
			query: body => ({
				url: prefixProxyEndpoint('/v1/task'),
				method: 'PUT',
				body,
			}),
		}),
		getTodos: builder.query<TodosResponse, unknown>({
			query: () => prefixProxyEndpoint('/v1/task'),
		}),
	}),
	overrideExisting: false,
});

todosApi.enhanceEndpoints({
	addTagTypes: ['Todos'],
	endpoints: {
		getTodos: {
			providesTags: ['Todos'],
		},
		createTodo: {
			invalidatesTags: ['Todos'],
		},
		deleteTodo: {
			invalidatesTags: ['Todos'],
		},
		updateTodo: {
			invalidatesTags: ['Todos'],
		},
	},
});

export default todosApi;
