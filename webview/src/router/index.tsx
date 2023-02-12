/** @format */

import React from 'react';
import { type EnhancedStore } from '@reduxjs/toolkit';
import Loadable, { type LoadableClassComponent } from '@loadable/component';
import { createBrowserRouter, type RouteObject, matchRoutes, matchPath, redirect, Outlet } from 'react-router-dom';
import type { Router as RemixRouter } from '@remix-run/router';
import routesJSON from './routes.json';
import { type AppDispatch } from '@/store';
import LayoutLoading from '@/components/LayoutLoading';
import layoutPlugins from '@/components/layouts';
import PageLoading from '@/components/PageLoading';
import _ from 'lodash';
import App, { appLoader } from '@/App';
import { globalApi } from '@/services/globalApi';
import { globalActions } from '@/store/default.slice';
import PageError from '@/pages/PageError';
import ProjectConfig from '@/project.config.json';

export type RoutesJSON = typeof routesJSON;
export interface RouteItem {
	path?: string;
	index?: boolean;
	children?: RouteItem[];
	caseSensitive?: boolean;
	id?: string;
	errorElement?: React.ReactNode | null;
	title?: string;
	icon?: string | React.FC | LoadableClassComponent<React.ComponentClass>;
	redirect?: any;
	element: string;
	order?: number;
	hiddenBreadcrumb?: boolean;
	disabledBreadcrumbLink?: boolean;
	hiddenNavigation?: boolean;
}

export interface LangsKey {
	locale: string;
	label: string;
	id: number;
	keys: string;
}

const languages = _.values(ProjectConfig.languages);
const langsKeys = _.chain(languages).value();
const langPathRegex =
	langsKeys.length > 1
		? _.chain(langsKeys)
				.reduce((a, b) => a + `|${b.keys}`, langsKeys[0].keys)
				.value()
		: langsKeys[0].keys;
const langs = langPathRegex.split('|');
const isVerifyToken = ProjectConfig.enableVerifyToken.value;
const isEnableMetaAPI = ProjectConfig.enableMetaAPI.value;

export const createRouter = (store: EnhancedStore): RemixRouter => {
	const createRoute = (routes?: RouteItem[]): RouteObject[] => {
		const childrenRoutes: RouteObject[] =
			routes?.map(route => {
				const newRoute: RouteObject = {};
				const isLayout = !(route.element.match('layout/') == null);
				const elementPath = route.element.replace('layout/', '').replace('pages/', '');
				const Element = Loadable(
					async () =>
						isLayout
							? await import('@/layouts').then((module: any) => module[elementPath])
							: await import(`@/pages/${elementPath}`),
					{
						fallback: isLayout ? <LayoutLoading /> : <PageLoading />,
					},
				);
				const layoutName = isLayout ? route.element.replace(/layout\//i, '') : '';

				newRoute.path = route.path;
				newRoute.element = <Element routes={route.children} Outlet={Outlet} {...layoutPlugins[layoutName]} />;
				newRoute.errorElement = <PageError />;
				newRoute.children = createRoute(route.children);
				newRoute.loader = async ({ request, params }) => {
					const dispatch: AppDispatch = store.dispatch;
					const { lang } = params;
					const pathnames = request.url.replace(window.location.origin, '').split('?');
					const location = {
						pathname: pathnames[0],
						search: pathnames.length >= 2 ? `?${pathnames[1]}` : '',
					};

					const matchedRoute =
						matchRoutes(routesJSON, location, (langs.includes(lang || '') && `/${lang}`) || '') || [];
					const matchPathRoute = matchPath(
						lang ? `/${lang}/${route.path ?? ''}` : route.path ?? '',
						request.url.replace(window.location.origin, ''),
					);

					if (isLayout) {
						if (isVerifyToken && request.url.replace(window.location.origin, '').match('user') == null) {
							const meResponse = await dispatch(globalApi.endpoints.getMe.initiate());

							if (meResponse.isError) {
								throw new Response('Token Invalid', {
									status: 401,
								});
							}
						}

						if (isEnableMetaAPI) {
							await dispatch(globalApi.endpoints.getMeta.initiate());
						}
					}
					// 合法語系
					if ((lang && !langs.includes(lang)) || (!isLayout && matchedRoute.length <= 0)) {
						throw new Response('Not Found', { status: 404 });
					}

					// has redirect
					else if (
						route.redirect &&
						request.url.replace(window.location.origin, '') !== route.redirect &&
						matchPathRoute != null
					) {
						return redirect(lang ? `/${lang}${route.redirect}` : route.redirect);
					}

					// page loader
					else {
						const pageModule: any = await Element.load();
						if (typeof pageModule === 'object' && pageModule.loader) {
							const loader = await pageModule.loader({ store, request, params });
							return loader;
						} else {
							return null;
						}
					}
				};
				return newRoute;
			}) || [];

		childrenRoutes.push({
			path: '*',

			errorElement: <PageError />,
		});
		return childrenRoutes;
	};

	const router = createBrowserRouter([
		{
			path: '/:lang?',
			element: <App />,
			children: createRoute(routesJSON),
			loader: async ({ request, params }) => {
				const dispatch: AppDispatch = store.dispatch;
				const { lang } = params;

				if (lang) {
					const currentLang = languages.find(item => {
						const keys = item.keys.split('|');
						return keys.includes(lang);
					});

					if (currentLang?.locale) {
						dispatch(globalActions.changeLanguage(currentLang?.locale));
					}
				}

				return await appLoader({ store, request, params });
			},
		},
	]);

	return router;
};
