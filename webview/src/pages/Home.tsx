/** @format */

import React, { useEffect, useContext } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { TonconnectContext } from '@/contexts/TonconnectProvider';
import TonConnectWallet from '@/components/TonConnectWallet';
import { usersApi, type UserInfoResponse } from '@/services/user';

export const loader = async () => {
	// throw new Response("Not Found", { status: 404 });
	return null;
};

const Home = () => {
	const { address } = useContext(TonconnectContext);
	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const tgUserId = searchParams.get('tgUserId');
	const { data: userData, isFetching, isSuccess } = usersApi.useGetUserQuery(tgUserId || '');

	return (
		<Box>
			{address && (
				<Box>
					<Stack direction="column" spacing={2}>
						<Box display="flex" alignItems="flex-start">
							<Box width={150}>Telegram ID</Box>
							<Box flex={1}>{userData?.data?.tgUserId}</Box>
						</Box>
						<Box display="flex" alignItems="flex-start">
							<Box width={150}>Wallet</Box>
							<Box flex={1} sx={{ wordBreak: 'break-all' }}>
								{address}
							</Box>
						</Box>
					</Stack>
				</Box>
			)}
			<Box mt="25vw">
				<Stack direction="column" spacing={4}>
					<TonConnectWallet />
					<Button
						target="_self"
						href="https://testnet.tonscan.org/nft/EQAdnpjV9j7SjZk6kHVXxXFpnjDsuAhULZxt2os3AaAzKnBH"
						variant="contained"
						fullWidth /* onClick={() => navigate('/rewards')} */
					>
						MY REWARDS
					</Button>
				</Stack>
			</Box>
		</Box>
	);
};

export default Home;
