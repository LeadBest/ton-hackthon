/** @format */

import React, { useEffect } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	LinearProgress,
	TableRow,
	Icon,
	IconButton,
} from '@mui/material';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { globalActions } from '@/store/default.slice';
import { useDispatch } from 'react-redux';
import { todosApi, type TodoItem } from '@/services/todosApi';
import type { Params } from 'react-router-dom';
import type { AppDispatch } from '@/store';
import moment from 'moment';
import 'moment-timezone';
import TodoEdit from './TodoInput';

export const loader = async ({
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
		const response = await dispatch(todosApi.endpoints.getTodos.initiate(''));
		return response;
	} catch (error) {
		return error;
	}
};

const TodoList = () => {
	const dispatch = useDispatch();
	const [deleteTodo, { isSuccess: isDeleteTodoSuccess, isLoading: isDeleteTodoLoading }] =
		todosApi.useDeleteTodoMutation();
	const { data: todoListData, isFetching, isSuccess } = todosApi.useGetTodosQuery('');
	// const [getTodos, {isLoading: isLazyLoading, isSuccess: isLazySucess, data: lazyData, isFetching: isLazyFetching}] = todosApi.useLazyGetTodosQuery();

	useEffect(() => {
		if (isDeleteTodoSuccess) {
			dispatch(globalActions.toogleDialog({ visible: false }));
		}
	}, [isDeleteTodoSuccess]);
	return (
		<Box p={3}>
			<TableContainer sx={{ maxHeight: 440 }}>
				{isFetching && <LinearProgress />}
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Update Time</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{todoListData?.items?.map((item: TodoItem) => {
							return (
								<TableRow key={item._uuid} hover role="checkbox" tabIndex={-1}>
									<TableCell>{item.title}</TableCell>
									<TableCell>
										<Box color={item.completed ? 'success.main' : 'warning.main'}>
											{item.completed ? 'Done' : 'Undone'}
										</Box>
									</TableCell>
									<TableCell>
										{moment.tz(moment.unix(item._modified), 'Asia/Taipei').format('YYYY/MM/DD HH:mm')}
									</TableCell>
									<TableCell>
										<Box className="flex">
											<IconButton
												aria-label="delete"
												size="small"
												onClick={() =>
													dispatch(
														globalActions.toogleDialog({
															visible: true,
															close: true,
															backdropClose: true,
															confirm: true,
															contentComponent: (
																<TodoEdit
																	data={item}
																	updateCompleteHandle={() => {
																		dispatch(
																			globalActions.toogleDialog({
																				visible: false,
																			}),
																		);
																	}}
																/>
															),
															title: `Edit`,
														}),
													)
												}
											>
												<Icon>edit</Icon>
											</IconButton>
											<IconButton
												aria-label="delete"
												size="small"
												onClick={() =>
													dispatch(
														globalActions.toogleDialog({
															visible: true,
															close: true,
															backdropClose: true,
															confirm: true,
															content: 'delete item ?',
															title: `Confirm delete ${item.title}`,
															confirmHandle: async () => {
																await deleteTodo([{ _uuid: item._uuid }]);
																dispatch(
																	globalActions.toogleDialog({
																		loading: true,
																	}),
																);
															},
														}),
													)
												}
											>
												<Icon>delete_outline</Icon>
											</IconButton>
										</Box>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default TodoList;
