/** @format */

import globalLocales from './default/index';
import ProjectConfig from '@/project.config.json';

type ProjectConfigJSON = typeof ProjectConfig;
export interface ProjectConfigJSONExtends extends Omit<ProjectConfigJSON, 'languages'> {
	languages: Record<string, Language>;
}
interface Language {
	locale: string;
	label: string;
	id: number;
	keys: string;
	messages?: any;
}

type messages = Record<string, any>;

const projectConfig: ProjectConfigJSONExtends = ProjectConfig;
export const languages = projectConfig.languages;
const projectLocales = import.meta.glob('./project/*.json', { eager: true });

const i18nMessages: messages = {};
Promise.all(
	Object.keys(projectConfig.languages).map(async key => {
		const response = await projectLocales[`./project/${key}.json`];
		const message = response.default;
		i18nMessages[key] = {
			...globalLocales[key],
			...message,
		};
	}),
).catch(error => {
	console.log(error);
});

export default i18nMessages;
