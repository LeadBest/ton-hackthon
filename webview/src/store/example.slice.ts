/** @format */

import { createSlice } from '@reduxjs/toolkit';

export const EXAMPLE_FEATURE_KEY = 'example';

/*
 * Update these interfaces according to your requirements.
 */

export interface ExampleTodoItem {
	id: number;
	message: string;
}

export interface ExampleState {
	todo: {
		loading: boolean;
		loaded: boolean;
		data: ExampleTodoItem[];
	};
}

export const initialExampleState: ExampleState = {
	todo: {
		loading: false,
		loaded: false,
		data: [],
	},
};

export const exampleSlice = createSlice({
	name: EXAMPLE_FEATURE_KEY,
	initialState: initialExampleState,
	reducers: {
		addRequest(state) {
			state.todo = {
				...state.todo,
				loading: true,
				loaded: false,
			};
		},
		addSuccess(state, action) {
			const item = {
				id: state.todo.data.length,
				message: action.payload.message,
			};
			const data = state.todo.data;
			data.push(item);
			state.todo = {
				loading: false,
				loaded: true,
				data,
			};
		},
		addFail(state) {
			state.todo = {
				...state.todo,
				loading: false,
				loaded: false,
			};
		},
	},
});

/*
 * Export reducer for store configuration.
 */
export const exampleReducer = exampleSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(exampleActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const exampleActions = exampleSlice.actions;
