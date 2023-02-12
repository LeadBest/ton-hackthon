/** @format */

import { Box, Button, Stack, Card, CardActionArea, Icon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tasksApi, type TaskItem } from '@/services/mission';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { type Params, useLocation } from 'react-router-dom';
import type { AppDispatch } from '@/store';
import moment from 'moment';
import 'moment-timezone';

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
		const searchParams = new URLSearchParams(location.search);
		const tgUserId = searchParams.get('tgUserId');
		const response = await dispatch(tasksApi.endpoints.getTasks.initiate(tgUserId));
		return response;
	} catch (error) {
		return error;
	}
};

const PieBox = styled(Box)`
	position: relative;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.6);
`;

const Mission = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const tgUserId = searchParams.get('tgUserId');

	const { data: tasksData, isFetching, isSuccess } = tasksApi.useGetTasksQuery(tgUserId);

	console.log(tasksData);
	return (
		<Box>
			<Box fontSize={20} fontWeight="bold" mb={3}>
				Mission status
			</Box>
			<Stack direction="column" spacing={2}>
				{tasksData?.data.map((item: TaskItem, index: numer) => {
					return (
						<Card sx={{ minWidth: 275 }}>
							<CardActionArea>
								<Box p={1.5} display="flex">
									<Box width={48} height={48} mr={2}>
										{item.status == 'COMPLETE' ? (
											<Box width={48} height={48} bgcolor="success.main" borderRadius="50%" fontSize={48}>
												<Icon fontSize="inherit">done</Icon>
											</Box>
										) : (
											<PieBox />
										)}
									</Box>
									<Box flex={1} display="flex" justifyContent="space-between" flexDirection="column">
										<Box display="flex" justifyContent="space-between">
											<Box fontSize={16} fontWeight="bold">
												{`${index + 1}. ${item.taskName}`}
											</Box>
											<Box
												fontSize={16}
												fontWeight="bold"
												color={item.status == 'COMPLETE' ? 'success.main' : 'warning.main'}
											>
												{item.status}
											</Box>
										</Box>
										<Box fontSize={14}>{item.description}</Box>
									</Box>
								</Box>
							</CardActionArea>
						</Card>
					);
				})}
			</Stack>
		</Box>
	);
};

export default Mission;
