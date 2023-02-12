/** @format */

import { type ExampleState } from '@/store/example.slice';
import { type GlobalState } from '@/store/default.slice';

export interface RootState {
	global: GlobalState;
	example: ExampleState;
}

export const getRoot = (state: RootState): RootState => state;
export const getGlobal = (state: RootState): GlobalState => state.global;
