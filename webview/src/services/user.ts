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

export interface ClaimsResponse {
	url: string;
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
		getClaims: builder.query<ClaimsResponse,string>({
			query: tgUserId => prefixProxyEndpoint(`/api/users/nfts/claims/${tgUserId}`),
		})
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
		getClaims: {
			providesTags: ['Users'],
		}
	},
});

export default usersApi;
