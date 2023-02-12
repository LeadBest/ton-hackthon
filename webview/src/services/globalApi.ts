/** @format */

import { api, prefixProxyEndpoint } from '@/services';

export interface MeResponse {
	error?: any;
	data?: any;
}

export interface MetaResponse {
	error?: any;
	data?: any;
}

export const globalApi = api.injectEndpoints({
	endpoints: builder => ({
		getMe: builder.query<MeResponse, undefined>({
			query: () => prefixProxyEndpoint('/v1/me'),
		}),
		getMeta: builder.query<MetaResponse, undefined>({
			query: () => prefixProxyEndpoint('/v1/meta'),
		}),
	}),
});

globalApi.enhanceEndpoints({
	addTagTypes: ['Global'],
	endpoints: {
		getMe: {
			providesTags: [{ type: 'Global', id: 'ME' }],
		},
		getMeta: {
			providesTags: [{ type: 'Global', id: 'META' }],
		},
	},
});

export default globalApi;
