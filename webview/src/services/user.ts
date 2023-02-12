/** @format */

import { api, prefixProxyEndpoint } from '@/services';

export interface UserInfoResponse {
	data: {
		tgUserId: string;
		tonAddress: string;
		updateTime: string;
		createTime: string;
	};
}

export interface CreateUserRequest {
	tgUserId: string;
	tonAddress: string;
}

export const usersApi = api.injectEndpoints({
	endpoints: builder => ({
		createUser: builder.mutation<UserInfoResponse, CreateUserRequest>({
			query: body => ({
				url: prefixProxyEndpoint('/api/users'),
				method: 'POST',
				body,
			}),
		}),
		getUser: builder.query<UserInfoResponse, string>({
			query: tgUserId => prefixProxyEndpoint(`/api/users/${tgUserId}`),
		}),
	}),
	overrideExisting: false,
});

usersApi.enhanceEndpoints({
	addTagTypes: ['Users'],
	endpoints: {
		getUser: {
			providesTags: ['Users'],
		},
		createUser: {
			invalidatesTags: ['Users'],
		},
	},
});

export default usersApi;
