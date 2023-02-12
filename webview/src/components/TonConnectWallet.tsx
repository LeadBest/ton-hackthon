/** @format */

import { useEffect, useContext } from 'react';
import { TonconnectContext } from '@/contexts/TonconnectProvider';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from '@/store/default.slice';
import { usersApi, type UserInfoResponse } from '@/services/user';
import { getGlobal } from '@/store/states';
import { type Params, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';

import { Button, Box } from '@mui/material';

const TonConnectWallet = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const tgUserId = searchParams.get('tgUserId');

	const { connectWallet, universalLink, address, connector } = useContext(TonconnectContext);
	const { data: userData, isFetching, isSuccess } = usersApi.useGetUserQuery(tgUserId || '');
	const [createUser, { isLoading: isCreateUserLoading, isError }] = usersApi.useCreateUserMutation();
	const { dialog } = useSelector(getGlobal);
	const dispatch = useDispatch();

	useEffect(() => {
		if (universalLink && !address) {
			dispatch(
				globalActions.toogleDialog({
					visible: true,
					close: true,
					backdropClose: true,
					confirm: true,
					contentComponent: (
						<Box p={3}>
							<QRCode
								size={256}
								style={{ height: '260px', maxWidth: '100%', width: '100%' }}
								value={universalLink}
								viewBox={`0 0 256 256`}
							/>
						</Box>
					),
					title: 'Connect to Tonkeeper',
				}),
			);
		}
	}, [universalLink]);

	useEffect(() => {
		if (!userData && address && tgUserId) {
			createUser({ tgUserId, tonAddress: address });
		}
	}, [userData, address, isFetching]);

	useEffect(() => {
		if (address && dialog.visible) {
			dispatch(globalActions.toogleDialog({ visible: false }));
		}
	}, [address]);

	return (
		<>
			{address ? (
				<Box display="flex" alignItems="center">
					{/* <Box>{address.slice(0, 4) + '...' + address.slice(-3)}</Box> */}
					<Button
						variant="contained"
						color="warning"
						onClick={() => {
							void (async () => {
								await connector.disconnect();
							})();
						}}
						fullWidth
					>
						Disconnect
					</Button>
				</Box>
			) : (
				<Button variant="contained" color="primary" onClick={connectWallet} fullWidth>
					Connect Wallet
				</Button>
			)}
		</>
	);
};

export default TonConnectWallet;
