/** @format */

import defaultTheme from './default';
import { createTheme } from '@mui/material/styles';

export const exampleTheme = createTheme({
	typography: {
		fontFamily: ['Montserrat', 'Noto Sans TC', 'sans-serif'].join(','),
	},
	palette: defaultTheme.palette,
});

export default exampleTheme;
