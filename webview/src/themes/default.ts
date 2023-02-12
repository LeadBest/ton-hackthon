/** @format */

import { createTheme } from '@mui/material/styles';

import { type AlertClassKey } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
	interface TypeBackground {
		default: string;
		paper: string;
		surface: string;
		onSurface: string;
		top: string;
	}
	interface TypeText {
		darkPrimary1: string;
		darkPrimary2: string;
		darkPrimary3: string;
		darkPrimary4: string;
		lightPrimary1: string;
		lightPrimary2: string;
		lightPrimary3: string;
		lightPrimary4: string;
		gary1: string;
		gary2: string;
		gary3: string;
		gary4: string;
		gary5: string;
		gary6: string;
		gary7: string;
		gary8: string;
		gary9: string;
		gary10: string;
	}
	interface Palette {
		default: Palette['primary'];
		border: Palette['primary'];
		background: Palette['background'];
		text: Palette['text'];
	}
	interface PaletteOptions {
		default?: PaletteOptions['primary'];
		border?: PaletteOptions['primary'];
		background?: Partial<TypeBackground>;
		text?: Partial<TypeText>;
	}
}

declare module '@mui/material/styles/overrides' {
	export interface ComponentNameToClassKey {
		MuiAlert: AlertClassKey;
	}
}

export const defaultTheme = createTheme({
	palette: {
		primary: {
			light: '#757ce8',
			main: '#1976D2',
			dark: '#002884',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff7961',
			main: '#f44336',
			dark: '#ba000d',
			contrastText: '#000',
		},
		background: {
			default: '#2F373E',
			paper: '#404D57',
		},
		success: {
			main: '#4DCC76',
		},
		text: {
			primary: '#fff',
		},
		default: {
			main: '#fff',
			contrastText: '#fff',
		},
		border: {
			main: '#fff',
		},
	},
});

export default defaultTheme;
