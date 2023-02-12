/** @format */

import { useState, memo } from 'react';
import { Box, Button, TextField, CircularProgress, Paper } from '@mui/material';
import CreateTodo from './TodoInput';

const TodoCreate = () => {
	return (
		<>
			<h1>Create</h1>
			<Paper>
				<CreateTodo />
			</Paper>
		</>
	);
};

export default TodoCreate;
