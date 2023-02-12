/** @format */

import { Box, Card, CardContent } from '@mui/material';
import NFTImg from '@/assets/images/nft_img.png';

const Rewards = () => {
	return (
		<Box>
			<Box fontSize={20} fontWeight="bold" mb={3}>
				My rewards
			</Box>
			<Card sx={{ minWidth: 275 }}>
				<CardContent>
					<Box>
						<img width={'100%'} src={NFTImg} />
					</Box>
					<Box>Blue crystal</Box>
					<Box>#236168</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default Rewards;
