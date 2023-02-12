/** @format */

import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
interface TodoProps {
	routes: any;
}
const Todo = (props: TodoProps) => {
	return (
		<>
			<Box p={3}>
				<h1>Todo</h1>
			</Box>
			<Outlet />
		</>
	);
};

export default Todo;
