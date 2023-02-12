/** @format */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
	baseUrl: window.Config.ENV === 'local' ? '' : `${window.Config.API_HOST}`,
	prepareHeaders: headers => {
		const authToken = localStorage.getItem('auth-token');
		headers.set('Content-Type', 'application/json;charset=UTF-8');
		if (authToken) {
			headers.set('Authorization', `Bearer ${authToken}`);
		}

		return headers;
	},
});

const baseQueryWithInterceptor: BaseQueryFn = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);
	if (result.error != null && result.error.status === 401) {
		// here you can deal with 401 error
	}
	return result;
};

export const prefixProxyEndpoint = (url: string) => {
	return window.Config.ENV === 'local' ? `/proxy-api${url}` : url;
};

export const api = createApi({
	reducerPath: 'services',
	baseQuery: baseQueryWithInterceptor,
	endpoints: () => ({}),
});
