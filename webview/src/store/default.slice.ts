/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { type Dispatch } from 'redux';
import { type AlertColor } from '@mui/material/Alert';
export const GLOBAL_FEATURE_KEY = 'global';

export interface GlobalState {
	locale: string;
	dialog: {
		confirm?: boolean | undefined;
		visible?: boolean;
		close?: boolean;
		closeHandle?: (dispatch?: Dispatch<any>, history?: any) => null | undefined | unknown;
		backdropClose?: boolean;
		fullScreen?: boolean | undefined;
		mobileFullScreen?: boolean | undefined;
		mobileVertical?: 'flex-start' | 'center' | 'flex-end';
		title?: string | React.FC;
		content?: string | React.FC;
		contentComponent?: React.FC;
		loading?: boolean | undefined;
		confirmHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
		confirmVariant?: 'contained' | 'outlined';
		confirmColor?: 'primary' | 'secondary';
		confirmText?: string;
		cancelHandle?: (dispatch?: Dispatch<any>, history?: any) => null | unknown;
		cancelVariant?: 'contained' | 'outlined';
		cancelColor?: 'primary' | 'secondary';
		cancelText?: string;
		maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
	};
	snackbar: {
		visible: boolean;
		close?: boolean;
		variant: 'default' | 'success' | 'error' | 'warning' | 'info';
		anchorOrigin?: {
			vertical: 'bottom' | 'top';
			horizontal: 'left' | 'center' | 'right';
		};
		icon?: string;
		content?: string | React.FC;
		snackbarComponent?: React.ReactNode;
		action?: React.ReactNode;
		persist?: boolean;
		preventDuplicate?: boolean;
		hideIconVariant?: boolean;
		dense?: boolean;
		autoHideDuration?: number;
		closeHandle?: (dispatch?: Dispatch<any>, history?: any) => null | undefined | unknown;
	};
	alert: {
		visible: boolean;
		position?: 'fixed' | 'relative' | 'absolute' | 'initial';
		severity: AlertColor;
		variant?: 'standard' | 'filled' | 'outlined';
		Icon?: React.ReactNode;
		close?: boolean;
		closeHandle?: (dispatch?: Dispatch<any>, history?: any) => null | undefined | unknown;
		vertical?: 'top' | 'bottom';
		top?: number | undefined;
		bottom?: number | undefined;
		content?: string | JSX.Element | React.FC;
		animationBackground?: {
			leftColor?: string;
			rightColor?: string;
			deg?: string;
		};
	};
	breadcrumbName: any;
}

export const initialGlobalState: GlobalState = {
	locale: 'en_us',
	dialog: {
		confirm: false,
		visible: false,
		close: false,
		backdropClose: false,
		fullScreen: false,
		mobileFullScreen: false,
		title: undefined,
		content: undefined,
		contentComponent: undefined,
		loading: false,
		confirmVariant: 'contained',
		confirmColor: 'primary',
		confirmText: 'action.confirm',
		cancelVariant: 'outlined',
		cancelColor: 'secondary',
		cancelText: 'action.cancel',
		maxWidth: 'xs',
	},
	snackbar: {
		visible: false,
		close: true,
		variant: 'default',
		anchorOrigin: {
			vertical: 'bottom',
			horizontal: 'left',
		},
	},
	alert: {
		visible: false,
		position: 'fixed',
		severity: 'success',
		variant: 'filled',
		Icon: null,
		close: true,
		vertical: 'top',
		content: '',
	},
	breadcrumbName: {},
};

export const globalSlice = createSlice({
	name: GLOBAL_FEATURE_KEY,
	initialState: initialGlobalState,
	reducers: {
		toogleDialog(state, action) {
			let globalDialogSettings = { ...state.dialog };

			if (action.payload.visible) {
				globalDialogSettings = {
					confirm: false,
					close: false,
					closeHandle: undefined,
					backdropClose: false,
					mobileFullScreen: false,
					mobileVertical: undefined,
					title: undefined,
					loading: false,
					content: undefined,
					contentComponent: undefined,
					confirmHandle: undefined,
					confirmVariant: 'contained',
					confirmColor: 'primary',
					confirmText: 'action.confirm',
					cancelHandle: undefined,
					cancelVariant: 'outlined',
					cancelColor: 'secondary',
					cancelText: 'action.cancel',
					maxWidth: 'xs',
				};
			}

			globalDialogSettings = {
				...globalDialogSettings,
				...action.payload,
			};
			state.dialog = {
				...state.dialog,
				...globalDialogSettings,
			};
		},
		snackbarRequest(state, action) {
			let snackbarSettings = { ...state.snackbar };

			if (action.payload.visible) {
				snackbarSettings = {
					...snackbarSettings,
					autoHideDuration: 3000,
					content: undefined,
					snackbarComponent: null,
					action: undefined,
					hideIconVariant: false,
					close: false,
					persist: false,
				};
			}
			snackbarSettings = {
				...snackbarSettings,
				...action.payload,
			};
			state.snackbar = {
				...state.snackbar,
				...snackbarSettings,
			};
		},
		changeLanguage(state, action) {
			state.locale = action.payload;
		},
	},
});

/*
 * Export reducer for store configuration.
 */
export const globalReducer = globalSlice.reducer;
export const globalActions = globalSlice.actions;
