/** @format */

import { ThemeProvider } from '@mui/material/styles';
import * as themes from '@/themes';
import ProjectConfig from '../project.config.json';

interface Props {
	children?: React.ReactNode;
}

const theme = themes[ProjectConfig.themeName] || themes.defaultTheme;

const APPThemeProvider = (props: Props) => {
	const { children } = props;
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
export default APPThemeProvider;
