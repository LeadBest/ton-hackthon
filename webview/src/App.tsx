/** @format */

import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { getGlobal } from './store/states';
import { usersApi, type UserInfoResponse } from '@/services/user';
import type { Locales } from './locales/default/index';
import type { AppDispatch } from '@/store';
import AppPlugins from '@/components/AppPlugins';
import { Outlet, type Params } from 'react-router-dom';
import locales from './locales';
import type { EnhancedStore } from '@reduxjs/toolkit';

export const appLoader = async ({
	store,
	request,
	params,
}: {
	store: EnhancedStore;
	request: Request;
	params: Params;
}) => {
	const dispatch: AppDispatch = store.dispatch;
	try {
		const searchParams = new URLSearchParams(location.search);
		const tgUserId = searchParams.get('tgUserId');
		if(tgUserId) {
			const response = await dispatch(usersApi.endpoints.getUser.initiate(tgUserId));
		}
		

	} catch (error) {
		
	}
	
	return null;
};

export const App = () => {
	const { locale } = useSelector(getGlobal);
	const i8nMessages = locales;

	return (
		<IntlProvider locale="en" messages={i8nMessages?.[locale] || {}}>
			<>
				<Outlet />
				<AppPlugins />
			</>
		</IntlProvider>
	);
};

export default App;
