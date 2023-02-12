/** @format */

import { api, prefixProxyEndpoint } from '@/services';

export interface TasksResponse {
	totalRows: number;
	totalPages: number;
	pageSize: number;
	currentPage: number;
	data: TaskItem[];
}

export interface TaskItem {
	taskId: number;
	taskName: string;
	description: string;
	status: string;
	expiredTime: string;
	updateTime: string;
	createTime: string;
}

export const tasksApi = api.injectEndpoints({
	endpoints: builder => ({
		getTasks: builder.query<TasksResponse, unknown>({
			query: tgUserId => prefixProxyEndpoint(`/api/tasks/users/${tgUserId}`),
		}),
	}),
	overrideExisting: false,
});

tasksApi.enhanceEndpoints({
	addTagTypes: ['Tasks'],
	endpoints: {
		getTasks: {
			providesTags: ['Tasks'],
		},
	},
});

export default tasksApi;
