/** @format */

import { useState, useEffect, memo } from 'react';
import { Box, Button, TextField, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import todosApi, { type TodoItem } from '@/services/todosApi';
interface TodoInputProps {
	data?: TodoItem;
	updateCompleteHandle?: () => void;
}

const TodoInput = memo((props: TodoInputProps) => {
	const { data, updateCompleteHandle } = props;

	const [createTodo, { isLoading: isCreateTodoLoading, isError }] = todosApi.useCreateTodoMutation();
	const [updateTodo, { isLoading: isUpdateTodoLoading, isSuccess: isUpdateTodoSuccess }] =
		todosApi.useUpdateTodoMutation();
	const [message, setMessage] = useState<string>(data?.title || '');
	const [completed, setCompleted] = useState<boolean>(data?.completed || false);
	const onAdd = () => {
		if (data) {
			void updateTodo([
				{
					_uuid: data._uuid,
					title: message,
					completed,
				},
			]);
		} else {
			void createTodo([
				{
					title: message,
					completed,
				},
			]);
		}
	};

	useEffect(() => {
		if (isUpdateTodoSuccess && typeof updateCompleteHandle === 'function') {
			updateCompleteHandle();
		}
	}, [isUpdateTodoSuccess]);

	return (
		<Box p={3} display="flex">
			<Box>
				<FormControlLabel
					control={
						<Checkbox
							checked={completed}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompleted(event.target.checked)}
						/>
					}
					label="Completed"
				/>
			</Box>
			<Box flex={1} mr={1}>
				<TextField
					fullWidth
					value={message}
					onInput={(event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value)}
				/>
			</Box>

			<Button disabled={isCreateTodoLoading || isUpdateTodoLoading} variant="contained" color="primary" onClick={onAdd}>
				{(isCreateTodoLoading || isUpdateTodoLoading) && <CircularProgress size={14} />}
				{data ? 'Confirm' : 'Add'}
			</Button>
		</Box>
	);
});

export default TodoInput;
