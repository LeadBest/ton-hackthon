/** @format */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from '@/router';
import { CssBaseline } from '@mui/material';
import { combineComponents } from '@/contexts/combineComponents';
import store from '@/store';
import AppLoading from '@/components/AppLoading';
import contexts from '@/contexts';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const router = createRouter(store);
const AppProviders:any = combineComponents(...contexts);

root.render(
	<React.StrictMode>
		<AppProviders>
			<>
				<CssBaseline />
				<RouterProvider router={router} fallbackElement={<AppLoading />} />
			</>
		</AppProviders>
	</React.StrictMode>,
);
