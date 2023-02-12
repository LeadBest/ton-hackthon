/** @format */

import { Box, Skeleton } from '@mui/material';

const PageLoading: React.FC = () => {
	return (
		<>
			<Box>
				<Box px={3} pb={3} bgcolor="#fff">
					<Skeleton height={30} />
				</Box>
			</Box>
			<Box px={3} py={4}>
				<Box p={3} bgcolor="#fff">
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} width="60%" />
				</Box>
				<Box mt={3} p={3} bgcolor="#fff">
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} />
					<Skeleton height={30} width="60%" />
				</Box>
			</Box>
		</>
	);
};

export default PageLoading;
