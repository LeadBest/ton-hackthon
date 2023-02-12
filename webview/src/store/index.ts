/** @format */

import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/index';
import reducers from '@/store/reducers';
import logger from 'redux-logger';
import { globalReducer, GLOBAL_FEATURE_KEY } from './default.slice';

const store = configureStore({
	reducer: {
		...(reducers as any),
		[api.reducerPath]: api.reducer,
		[GLOBAL_FEATURE_KEY]: globalReducer,
	},
	// Additional middleware can be passed to this array
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			window.Config.NODE_ENV !== 'production' ? [logger, api.middleware] : [],
		),
	devTools: window.Config.NODE_ENV !== 'production',
	// Optional Redux store enhancers
	enhancers: [],
});

export type AppDispatch = typeof store.dispatch;

export default store;
